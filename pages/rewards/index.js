import Head from "next/head";
import styles from "styles/Home.module.css";
import {
  Text,
  Container,
  StatHelpText,
  StatArrow,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  TableContainer,
  Table,
  Tr,
  Td,
  Th,
  Thead,
  Tbody,
  Image,
  Button,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useWhitelisted } from "hooks/useFunctions";
import { useState, useEffect, useCallback } from "react";
import { useFarm } from "hooks/useContracts";
import useAccount from "hooks/useAccount";
import CountUp from "react-countup";
import Web3 from "web3";

const Rewards = () => {
  const getWhitelisted = useWhitelisted();
  const [whitelisted, setWhitelisted] = useState([]);
  const [total_reward, setTotalReward] = useState(0);
  const [rewards, setReward] = useState([]);

  const [send_tx_status, setSendTxStatus] = useState(false);
  const [wait_tx, setWaitTx] = useState(false);

  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  const toast = useToast();

  /**
   * Init contracts
   */
  const Farm = useFarm();
  const account = useAccount();

  const getImage = (address) => {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
  };

  const getReward = useCallback(async () => {
    var rewardPerPool = [];

    for (let i = 0; i < whitelisted.length; i++) {
      const _reward = await Farm.methods
        .checkRewardByAddress(account, whitelisted[i].address)
        .call();

      rewardPerPool.push({
        address: whitelisted[i].address,
        symbol: whitelisted[i].symbol,
        reward: _reward,
      });
    }
    setReward(rewardPerPool);
  }, [Farm.methods, account, whitelisted]);

  const getTotalReward = useCallback(async () => {
    var tmp_total_reward = 0;
    var tmp = 0;
    for (let i = 0; i < rewards.length; i++) {
      tmp = Web3.utils.fromWei(rewards[i].reward.toString());
      tmp_total_reward += parseFloat(tmp);
    }
    setTotalReward(tmp_total_reward);
  }, [rewards]);

  const handleClickClaim = async (_address) => {
    setSendTxStatus(true);
    setWaitTx(true);

    Farm.methods
      .claimRewards(_address)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        const claimCheck = setInterval(async () => {
          const tx_status = await txStatus(hash);
          if (tx_status && tx_status.status) {
            setWaitTx(false);
            setSendTxStatus(false);
            clearInterval(claimCheck);
            toast({
              title: "Success",
              description: "Claming rewards success!",
              status: "success",
              duration: 1500,
              isClosable: true,
            });
            getReward();
            getTotalReward();
          }
        }, 1500);
      });
  };

  useEffect(() => {
    setWhitelisted(getWhitelisted);
  }, [getWhitelisted]);

  useEffect(() => {
    if (whitelisted.length > 0) {
      getReward();
    }
  }, [getReward, whitelisted.length]);

  useEffect(() => {
    if (rewards.length > 0) {
      getTotalReward();
    }
  }, [getTotalReward, rewards.length]);

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Mimic Finance | Claim Rewards</title>
          <meta
            name="description"
            content="Multi Farming Yields Aggerator System"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Text fontSize="5xl" fontWeight="bold" pt={7} align="center">
          Your Rewards
        </Text>
        <Text fontSize="2xl" align="center" pt={2}>
          Claim your rewards all pool here
        </Text>

        <Container maxW={"3xl"} mt={5}>
          <StatGroup>
            <Stat className="stat-box">
              <StatLabel>MIM Price</StatLabel>
              <StatNumber>$ 0.17 </StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>
            <Stat className="stat-box">
              <StatLabel>Total Rewards</StatLabel>
              <StatNumber>
                <CountUp duration={2} end={total_reward} separator="," /> MIM
              </StatNumber>
              <StatHelpText>
                ~ ${" "}
                {(total_reward * 0.17).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </StatHelpText>
            </Stat>
          </StatGroup>
        </Container>

        {total_reward > 0 && (
          <>
            <Container maxW={"3xl"} mt={5}>
              <TableContainer maxWidth="100%">
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Icon</Th>
                      <Th>Symbol</Th>
                      <Th>Rewards</Th>
                      <Th style={{ textAlign: "right" }}>Action</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {rewards &&
                      rewards.map((token, i) => {
                        return (
                          <Tr
                            key={i}
                            hidden={
                              parseFloat(
                                Web3.utils.fromWei(token.reward.toString())
                              ) <= 0
                                ? true
                                : false
                            }
                          >
                            <Td>
                              <Image
                                w={8}
                                src={getImage(token.address)}
                                alt={token.symbol}
                                fallbackSrc="/assets/images/logo-box.png"
                              ></Image>
                            </Td>
                            <Td>{token.symbol}</Td>
                            <Td>
                              <CountUp
                                duration={2}
                                end={parseFloat(
                                  Web3.utils.fromWei(token.reward.toString())
                                )}
                                separator=","
                              />
                              {" MIM"}
                            </Td>
                            <Td style={{ textAlign: "right" }}>
                              <Button
                                w={100}
                                disabled={wait_tx && send_tx_status}
                                onClick={() => {
                                  handleClickClaim(token.address);
                                }}
                                size="sm"
                                style={{
                                  color: "#FFFFFF",
                                  background:
                                    "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
                                }}
                              >
                                {wait_tx && send_tx_status ? (
                                  <Spinner size="sm" />
                                ) : (
                                  "Claim"
                                )}
                              </Button>
                            </Td>
                          </Tr>
                        );
                      })}
                  </Tbody>
                </Table>
              </TableContainer>
            </Container>
          </>
        )}
      </div>
    </>
  );
};

export default Rewards;
