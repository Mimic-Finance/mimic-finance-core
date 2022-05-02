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
import { useJUSD } from "hooks/useToken";
import Whitelisted from "components/Admin/Whitelisted";

const Redeem = () => {
  // Init Contract and account
  const account = useAccount();
  const ERC20Utils = useERC20Utils();
  const Swap = useSwap();
  const JUSD = useJUSD();
  const toast = useToast();

  // Whitelisted Section
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

  // Initialize coin and coinbalance state
  const [coin, setCoin] = useState();
  const [coinBalance, setCoinBalance] = useState(0);

  // create function for set parent state
  const setCoinState = (coin) => setCoin(coin);
  const setCoinBalanceState = (coinBalance) => setCoinBalance(coinBalance);

  const [send_tx_status, setSendTxStatus] = useState(false);
  const [wait_tx, setWaitTx] = useState(false);

  const txStatus = async (hash) => {
    const web3 = window.web3;
    const status = await web3.eth.getTransactionReceipt(hash);
    return status;
  };

  // Redeem section
  const [redeemValue, setRedeemValue] = useState(0);
  const [redeemTo, setRedeemTo] = useState();
  const [mintBalance, setMintBalance] = useState(0);
  const [totalMint, setTotalMint] = useState(0.0);

  const checkDecimals = async (address) => {
    const decimals = await ERC20Utils.methods.decimals(address).call();
    return decimals;
  };

  const handleChangeRedeemTo = async (e) => {
    setRedeemTo(e.target.value);
    const _mintBalance = await Swap.methods
      .getMintBalance(e.target.value, account)
      .call();
    console.log(_mintBalance);
    setMintBalance(_mintBalance);
    const _total = await getTotalMint(e.target.value, _mintBalance);
    setTotalMint(_total);
  };

  const handleChangeRedeemValue = async (e) => {
    setRedeemValue(e.target.value);
    const decimals = await checkDecimals(redeemTo.toString());
    const _JUSDBalance = await JUSD.methods.balanceOf(account).call();
    var _mintBalance = 0;
    if (decimals == 6) {
      _mintBalance = mintBalance / Math.pow(10, 6);
    } else {
      _mintBalance = Web3.utils.fromWei(mintBalance.toString());
    }

    let value = 0;
    if (decimals == 6) {
      if (
        parseFloat(_mintBalance) >
        parseFloat(Web3.utils.fromWei(_JUSDBalance.toString()))
      ) {
        value = Web3.utils.fromWei(_JUSDBalance.toString());
      } else {
        value = mintBalance / Math.pow(10, 6);
      }
    } else {
      if (e.target.value != 0) {
        if (
          parseFloat(_mintBalance) >
          parseFloat(Web3.utils.fromWei(_JUSDBalance.toString()))
        ) {
          value = Web3.utils.fromWei(_JUSDBalance.toString());
        } else {
          value = Web3.utils.fromWei(mintBalance.toString());
        }
      }
    }

    if (
      parseFloat(e.target.value) > parseFloat(value) ||
      parseFloat(e.target.value) < 0
    ) {
      setRedeemValue(0);
      toast({
        title: "error",
        description: "Please enter value less than your balance and Mint Value",
        status: "error",
        duration: 1500,
        isClosable: true,
      });
    }
  };

  const handleSetMaxRedeem = async () => {
    const _JUSDBalance = await JUSD.methods.balanceOf(account).call();
    const decimals = await checkDecimals(redeemTo.toString());
    var _mintBalance = 0;
    if (decimals == 6) {
      _mintBalance = mintBalance / Math.pow(10, 6);
    } else {
      _mintBalance = Web3.utils.fromWei(mintBalance.toString());
    }

    if (
      parseFloat(_mintBalance) >
      parseFloat(Web3.utils.fromWei(_JUSDBalance.toString()))
    ) {
      setRedeemValue(Web3.utils.fromWei(_JUSDBalance.toString()));
    } else {
      if (decimals == 6) {
        setRedeemValue(mintBalance / Math.pow(10, 6));
      } else {
        setRedeemValue(Web3.utils.fromWei(mintBalance.toString()));
      }
    }
  };

  const getTotalMint = async (addr, _mintBalance) => {
    const decimals = await checkDecimals(addr.toString());
    if (decimals == 6) {
      return _mintBalance / Math.pow(10, 6);
    } else {
      return Web3.utils.fromWei(_mintBalance.toString());
    }
  };

  const handleRedeemJUSD = async () => {
    const web3 = window.web3;
    const coinContract = new web3.eth.Contract(ERC20ABI, redeemTo);

    // => set amount with decimals
    if (redeemTo !== null) {
      const _amount = Web3.utils.toWei(redeemValue.toString());

      console.log("approve value => ", _amount);

      // ========== Transaction Start ==============
      setSendTxStatus(true);
      setWaitTx(true);
      // => Approve <<<
      // => approve with coin that user select

      await JUSD.methods
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
                .allowance(JUSD.address, account, Swap.address)
                .call();
              console.log("Allowance ===> ", allowance);

              if (allowance == _amount) {
                // => Redeem <<<
                Swap.methods
                  .redeemBack(_amount, redeemTo)
                  .send({ from: account })
                  .on("transactionHash", (hash) => {
                    const redeemCheck = setInterval(async () => {
                      const tx_status = await txStatus(hash);
                      if (tx_status && tx_status.status) {
                        setWaitTx(false);
                        setSendTxStatus(false);
                        clearInterval(redeemCheck);
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
                    redeemValue +
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
          <title>Mimic Finance | Redeem JUSD</title>
          <meta name="description" content="Dai Faucet" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Text fontSize="4xl" fontWeight="bold" pt={5} align="center">
          Redeem
        </Text>
        <Text fontSize="md" align="center" pt={0}>
          Redeem JUSD to any stable coin
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
                    {/* Choose Redeem To */}
                    <Box className="currency-box">
                      <Text
                        fontSize={"sm"}
                        style={{ textAlign: "left", marginBottom: "15px" }}
                      >
                        Redeem to
                      </Text>
                      <Select
                        onChange={handleChangeRedeemTo}
                        style={{ border: "0" }}
                      >
                        <option>Choose currency to redeem</option>;
                        {whitelisted?.map((token) => {
                          if (token.symbol !== "JUSD") {
                            return (
                              <>
                                <option value={token.address}>
                                  {token.symbol}
                                </option>
                              </>
                            );
                          }
                        })}
                      </Select>
                      <Text
                        pt={2}
                        pr={2}
                        fontSize="sm"
                        style={{ textAlign: "right", opacity: 0.5 }}
                      >
                        Total Mint:{" "}
                        {parseFloat(totalMint).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </Text>
                    </Box>

                    <Box pt={3} pb={3}>
                      <ArrowDownIcon w={8} h={8} />
                    </Box>

                    {/* From */}
                    <Box className="currency-box" mt={3}>
                      <Text
                        fontSize={"sm"}
                        style={{ textAlign: "left", marginBottom: "15px" }}
                      >
                        JUSD
                      </Text>
                      <Grid templateColumns="repeat(10, 1fr)" gap={0}>
                        <GridItem colSpan={10}>
                          <FormControl id="email">
                            <InputGroup size="md">
                              <Input
                                type="number"
                                style={{ border: "0" }}
                                placeholder="0.00"
                                value={redeemValue}
                                disabled={!redeemTo}
                                onChange={handleChangeRedeemValue}
                              />
                              <InputRightElement width="4.5rem">
                                <Button
                                  h="1.75rem"
                                  size="sm"
                                  onClick={handleSetMaxRedeem}
                                  disabled={!redeemTo}
                                >
                                  Max
                                </Button>
                              </InputRightElement>
                            </InputGroup>
                          </FormControl>
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
                        handleRedeemJUSD();
                      }}
                      disabled={redeemValue == 0 || (wait_tx && send_tx_status)}
                    >
                      {wait_tx && send_tx_status ? (
                        <>
                          <Spinner size={"sm"} mr={2} /> Waiting the transaction
                          ...
                        </>
                      ) : (
                        "Redeem"
                      )}
                    </Button>
                  </Box>
                </Box>
              </Center>
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default Redeem;
