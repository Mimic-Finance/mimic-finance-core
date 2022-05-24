import Head from "next/head";
import styles from "styles/Home.module.css";
import {
  Text,
  Container,
  TableContainer,
  Table,
  Tr,
  Td,
  Th,
  Thead,
  Tbody,
  Image,
  Badge,
  Box,
  SimpleGrid,
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { useWhitelisted } from "hooks/useFunctions";
import { useState, useEffect, useCallback } from "react";
import { useJUSD, useMIM } from "hooks/useToken";
import { useFarm } from "hooks/useContracts";
import useAccount from "hooks/useAccount";
import CountUp from "react-countup";
import Web3 from "web3";
import Link from "next/link";

const Portfolio = () => {
  const getWhitelisted = useWhitelisted();
  const [whitelisted, setWhitelisted] = useState([]);
  const [total_reward, setTotalReward] = useState(0);
  const [rewards, setReward] = useState([]);

  const [JUSDBalance, setJUSDBalance] = useState(0);
  const [MIMBalance, setMIMBalance] = useState(0);
  const [ETHBalance, setETHBalance] = useState(0);

  const Farm = useFarm();
  const account = useAccount();
  const JUSD = useJUSD();
  const MIM = useMIM();

  useEffect(() => {
    if (JUSD.balance) {
      setJUSDBalance(Web3.utils.fromWei(JUSD.balance.toString()));
    }
    if (MIM.balance) {
      setMIMBalance(Web3.utils.fromWei(MIM.balance.toString()));
    }
  }, [JUSD.balance, MIM.balance]);

  const getETHBalance = useCallback(async () => {
    const _balance = await web3.eth.getBalance(account);
    setETHBalance(parseFloat(Web3.utils.fromWei(_balance.toString(), "ether")));
  }, [account]);

  useEffect(() => {
    getETHBalance();
  }, [getETHBalance]);

  const getImage = (address) => {
    return `/assets/images/tokens/${address}.png`;
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
          <title>Mimic Finance | Portfolio</title>
          <meta
            name="description"
            content="Multi Farming Yields Aggerator System"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Text fontSize="5xl" fontWeight="bold" pt={7} align="center">
          Portfolio
        </Text>
        <Text align="center">
          The greater the potential for reward in the value portfolio, the less
          risk there is.
        </Text>

        <Container maxW={"50%"} mt={5}>
          <SimpleGrid minChildWidth={"200px"}>
            <Box className="balance-box" m={3}>
              <Badge variant="outline" colorScheme="gray">
                ETH Balance
              </Badge>
              <Text fontSize="3xl">
                <CountUp duration={2} end={ETHBalance} separator="," />{" "}
                <font size="4">ETH</font>
              </Text>
            </Box>

            <Box className="balance-box" m={3}>
              <Badge variant="outline" colorScheme="pink">
                JUSD Balance
              </Badge>
              <Text fontSize="3xl">
                <CountUp duration={2} end={JUSDBalance} separator="," />{" "}
                <font size="4">JUSD</font>
              </Text>
            </Box>
          </SimpleGrid>

          <SimpleGrid minChildWidth={"200px"}>
            <Box className="balance-box" m={3}>
              <Badge variant="outline" colorScheme="blue">
                Mimic Balance
              </Badge>
              <Text fontSize="3xl">
                <CountUp duration={2} end={MIMBalance} separator="," />{" "}
                <font size="4">MIM</font>
              </Text>
            </Box>

            <Box className="balance-box" m={3}>
              <Badge variant="outline" colorScheme="green">
                Mimic Reward
              </Badge>
              <Text fontSize="3xl">
                <CountUp duration={2} end={total_reward} separator="," />{" "}
                <font size="4">MIM</font>
              </Text>
            </Box>
          </SimpleGrid>

          {total_reward > 0 && (
            <>
              <Container maxW={"5xl"} mt={5}>
                <Text pb={2} fontSize={"xl"}>
                  Farm Reward
                </Text>
                <TableContainer maxWidth="100%">
                  <Table>
                    <Thead>
                      <Tr>
                        <Th>Icon</Th>
                        <Th>Symbol</Th>
                        <Th>APR</Th>
                        <Th style={{ textAlign: "right" }}>Rewards</Th>
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
                              <Td>
                                {token.symbol}{" "}
                                <Link passHref href={`/farm/${token.address}`}>
                                  <a>
                                    <ExternalLinkIcon />
                                  </a>
                                </Link>
                              </Td>
                              <Td>
                                {(Math.random(10, 99) * 100).toFixed(2)} %
                              </Td>
                              <Td style={{ textAlign: "right" }}>
                                <CountUp
                                  duration={2}
                                  end={parseFloat(
                                    Web3.utils.fromWei(token.reward.toString())
                                  )}
                                  separator=","
                                />
                                {" MIM"}
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
        </Container>
      </div>
    </>
  );
};

export default Portfolio;
