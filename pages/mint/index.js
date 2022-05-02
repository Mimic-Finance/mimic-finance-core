import Head from "next/head";
import styles from "../../styles/Home.module.css";
import {
  Text,
  Box,
  Button,
  Container,
  FormControl,
  InputGroup,
  Input,
  InputRightElement,
  Grid,
  GridItem,
  Select,
  Center,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { ArrowDownIcon } from "@chakra-ui/icons";
import { useWhitelisted } from "hooks/useFunctions";
import { useERC20Utils, useSwap } from "hooks/useContracts";
import { useEffect, useState } from "react";
import Web3 from "web3";
import useAccount from "hooks/useAccount";
import ERC20ABI from "../../constants/ERC20ABI.json";

const Mint = () => {
  const account = useAccount();
  const toast = useToast();
  const ERC20Utils = useERC20Utils();
  const Swap = useSwap();
  // Initialize coin and coinbalance state
  const [coin, setCoin] = useState();
  const [coinBalance, setCoinBalance] = useState(0);

  // create function for set parent state
  const setCoinState = (coin) => setCoin(coin);
  const setCoinBalanceState = (coinBalance) => setCoinBalance(coinBalance);

  const [mintValue, setMintValue] = useState(0);

  const getWhitelisted = useWhitelisted(
    "auto-stake",
    "0x0000000000000000000000000000000000000000",
    setCoinState,
    setCoinBalanceState
  );
  const [whitelisted, setWhitelisted] = useState([]);

  useEffect(() => {
    setWhitelisted(getWhitelisted);
  }, [getWhitelisted]);

  const checkDecimals = async (address) => {
    const decimals = await ERC20Utils.methods.decimals(address).call();
    return decimals;
  };

  const setMintValueMax = async () => {
    const decimals = await checkDecimals(coin.toString());
    if (decimals == 6) {
      setMintValue(coinBalance / Math.pow(10, 6));
    } else {
      setMintValue(Web3.utils.fromWei(coinBalance.toString()));
    }
  };

  const handleChangeMintValue = async (e) => {
    setMintValue(e.target.value);
    const decimals = await checkDecimals(coin.toString());
    let value = 0;
    if (decimals == 6) {
      value = coinBalance / Math.pow(10, 6);
    } else {
      if (e.target.value != 0) {
        value = Web3.utils.fromWei(coinBalance.toString());
      }
    }

    if (
      parseFloat(e.target.value) > parseFloat(value) ||
      parseFloat(e.target.value) < 0
    ) {
      setMintValue(0);
      toast({
        title: "error",
        description: "Please enter value less than your balance",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  const handleChangeToken = async (e) => {
    setMintValue(0);
    setCoin(e.target.value);
    let _coinBalance = await ERC20Utils.methods
      .balanceOf(e.target.value.toString(), account)
      .call();
    setCoinBalance(_coinBalance);
  };

  const [send_tx_status, setSendTxStatus] = useState(false);
  const [wait_tx, setWaitTx] = useState(false);

  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  const handleMintJUSD = async () => {
    const web3 = window.web3;
    const coinContract = new web3.eth.Contract(ERC20ABI, coin);

    // => set amount with decimals
    if (coin !== null) {
      // => get decimals of token
      const decimals = await ERC20Utils.methods
        .decimals(coin.toString())
        .call();
      const _amount = 0;
      if (decimals == 6) {
        // decimal = 6
        _amount = mintValue * Math.pow(10, 6);
      } else {
        // decimal = 18
        _amount = Web3.utils.toWei(mintValue.toString());
      }

      console.log("approve value => ", _amount);

      // ========== Transaction Start ==============
      setSendTxStatus(true);
      setWaitTx(true);
      // => Approve <<<
      // => approve with coin that user select

      await coinContract.methods
        .approve(Swap.address, _amount)
        .send({ from: account })
        .on("transactionHash", (hash) => {
          const refreshId = setInterval(async () => {
            const tx_status = await txStatus(hash);
            if (tx_status && tx_status.status) {
              clearInterval(refreshId);

              toast({
                title: "Success",
                description: "Approved Success!",
                status: "success",
                duration: 1500,
                isClosable: true,
              });

              // => Check Allowance value <<<
              const allowance = await ERC20Utils.methods
                .allowance(coin, account, Swap.address)
                .call();
              console.log("Allowance ===> ", allowance);

              if (allowance == _amount) {
                // => Deposit <<<
                Swap.methods
                  .JUSDMinter(_amount, coin)
                  .send({ from: account })
                  .on("transactionHash", (hash) => {
                    const mintCheck = setInterval(async () => {
                      const tx_status = await txStatus(hash);
                      if (tx_status && tx_status.status) {
                        setWaitTx(false);
                        setSendTxStatus(false);
                        clearInterval(mintCheck);
                        toast({
                          title: "Success",
                          description: "Mint JUSD Success!",
                          status: "success",
                          duration: 1500,
                          isClosable: true,
                        });
                        setMintValue(0);
                      }
                    }, 1500);
                  });
              } else {
                toast({
                  title: "Error",
                  description:
                    "Please set approve value = " +
                    mintValue +
                    " on your wallet",
                  status: "error",
                  duration: 1500,
                  isClosable: true,
                });
              }
            }
          }, 1500);
        });
    } else {
      toast({
        title: "Error",
        description: "Please select coin",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Mimic Finance | Swap</title>
          <meta name="description" content="Dai Faucet" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Text fontSize="4xl" fontWeight="bold" pt={5} align="center">
          Mint JUSD
        </Text>
        <Text fontSize="md" align="center" pt={0}>
          Mimic Finance Decentralize Exchange
        </Text>

        <Container maxW={"4xl"} pt={5}>
          <Box className="row">
            <Box className="col-md-12">
              <Center>
                <Box w={450} pt={6}>
                  <Box
                    className="swap-box"
                    style={{ textAlign: "center" }}
                    p={5}
                  >
                    {/* From */}
                    <Box className="currency-box">
                      <Text
                        fontSize={"sm"}
                        style={{ textAlign: "left", marginBottom: "15px" }}
                      >
                        From
                      </Text>
                      <Grid templateColumns="repeat(10, 1fr)" gap={0}>
                        <GridItem colSpan={7}>
                          <FormControl id="email">
                            <InputGroup size="md">
                              <Input
                                type="number"
                                style={{ border: "0" }}
                                placeholder="0.00"
                                value={mintValue}
                                onChange={handleChangeMintValue}
                              />
                              <InputRightElement width="4.5rem">
                                <Button
                                  h="1.75rem"
                                  size="sm"
                                  onClick={setMintValueMax}
                                >
                                  Max
                                </Button>
                              </InputRightElement>
                            </InputGroup>
                          </FormControl>
                        </GridItem>
                        <GridItem colSpan={3}>
                          <Select
                            onChange={handleChangeToken}
                            style={{ border: "0" }}
                          >
                            {whitelisted?.map((token) => {
                              if (token.symbol !== "JUSD") {
                                return (
                                  <option
                                    key={token.address}
                                    value={token.address}
                                  >
                                    {token.symbol}
                                  </option>
                                );
                              }
                            })}
                          </Select>
                        </GridItem>
                      </Grid>
                    </Box>

                    <Box pt={3} pb={3}>
                      <ArrowDownIcon w={8} h={8} />
                    </Box>

                    {/* To  */}
                    <Box className="currency-box">
                      <Text
                        fontSize={"sm"}
                        style={{ textAlign: "left", marginBottom: "15px" }}
                      >
                        To
                      </Text>
                      <Grid templateColumns="repeat(10, 1fr)" gap={0}>
                        <GridItem colSpan={7}>
                          <FormControl id="email">
                            <InputGroup size="md">
                              <Input
                                type="number"
                                style={{ border: "0" }}
                                placeholder="0.00"
                                disabled={true}
                                value={mintValue}
                              />
                            </InputGroup>
                          </FormControl>
                        </GridItem>
                        <GridItem colSpan={3}>
                          <Select style={{ border: "0" }}>
                            <option>JUSD</option>
                          </Select>
                        </GridItem>
                      </Grid>
                    </Box>

                    {/* Button */}
                    <Button
                      style={{ borderRadius: "15px" }}
                      width={"100%"}
                      colorScheme="pink"
                      height="70px"
                      className="swap-button"
                      onClick={() => {
                        handleMintJUSD();
                      }}
                      disabled={mintValue == 0 || (wait_tx && send_tx_status)}
                    >
                      {wait_tx && send_tx_status ? (
                        <>
                          <Spinner size={"sm"} mr={2} /> Waiting the transaction
                          ...
                        </>
                      ) : (
                        "Mint"
                      )}
                    </Button>
                  </Box>
                </Box>
              </Center>
            </Box>
            {/* <Box className="col-md-5" pt={6}>
              <Box className="swap-box " style={{ textAlign: "center" }} p={5}>
                Guide Box
              </Box>
            </Box> */}
          </Box>
        </Container>
      </div>
    </>
  );
};

export default Mint;
