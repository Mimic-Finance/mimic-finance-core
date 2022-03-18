import Head from "next/head";
import styles from "../../styles/Home.module.css";
import {
  Text,
  Box,
  Button,
  FormControl,
  InputGroup,
  Input,
  InputRightElement,
  Grid,
  GridItem,
  Select,
  Center,
} from "@chakra-ui/react";
import Toast from "../../components/Utils/Toast/Toast";
import Web3 from "web3";

import useAppSelector from "../../hooks/useAppSelector";
import { useEffect, useState } from "react";
import { ArrowDownIcon } from "@chakra-ui/icons";

import AggregatorV3InterfaceABI from "../../abis/@chainlink/AggregatorV3InterfaceABI.json";
import config from "../../config.json";

const Dex = () => {
  const { account } = useAppSelector((state) => state.account);
  const { DexContract, USDCContract } = useAppSelector(
    (state) => state.contracts
  );

  //Token Balance
  const { ETHBalance, USDCBalance } = useAppSelector(
    (state) => state.contracts
  );

  console.log("ETH => " + Web3.utils.fromWei(ETHBalance.toString()));
  console.log("USDC => " + USDCBalance);

  //Swap State
  const [ETHSwap, setETHSwap] = useState(0);
  const [USDCSwap, setUSDCSwap] = useState(0);

  //Swap Currency
  const [from, setFrom] = useState("USDC");
  const [to, setTo] = useState("ETH");

  //Rate Swap
  const [rate, setRate] = useState(0);

  const handleChangeETH = (e) => {
    if (
      e.target.value > parseFloat(Web3.utils.fromWei(ETHBalance.toString()))
    ) {
      Toast.fire({
        icon: "warning",
        title: "Insufficient of ETH Balance",
      });
    } else {
      setETHSwap(e.target.value);
      setUSDCSwap(e.target.value * (1 / rate));
    }
  };

  const handleChangeUSDC = (e) => {
    if (e.target.value > parseFloat(USDCBalance)) {
      Toast.fire({
        icon: "warning",
        title: "Insufficient of USDC Balance",
      });
    } else {
      setUSDCSwap(e.target.value);
      setETHSwap(e.target.value * rate);
    }
  };

  const handleMaxETH = () => {
    setETHSwap(Web3.utils.fromWei(ETHBalance.toString()));
    setUSDCSwap(Web3.utils.fromWei(ETHBalance.toString()) * (1 / rate));
  };

  const handleMaxUSDC = () => {
    setUSDCSwap(USDCBalance);
    setETHSwap(USDCBalance * rate);
  };

  const handleChageCurrency = (e) => {
    if (e.target.value === "USDC") {
      setFrom("USDC");
      setTo("ETH");
      setETHSwap(0);
      setUSDCSwap(0);
    } else {
      setFrom("ETH");
      setTo("USDC");
      setETHSwap(0);
      setUSDCSwap(0);
    }
  };

  const handleClickSwap = () => {
    if (from === "USDC") {
      handleClickUSDCtoETHSwap();
    } else {
      handleClickETHtoUSDCSwap();
    }
  };

  const handleClickETHtoUSDCSwap = async () => {
    if (DexContract) {
      await DexContract.methods
        .swapEthForUSDC(web3.utils.toWei(ETHSwap))
        .send({
          value: web3.utils.toWei(ETHSwap),
          from: account,
        })
        .on("transactionHash", (hash) => {
          Toast.fire({
            icon: "success",
            title: "Swap Success",
          });
        });
    }
  };

  const handleClickUSDCtoETHSwap = async () => {
    const USDC = USDCSwap * Math.pow(10, 6);
    if (DexContract) {
      await USDCContract.methods
        .approve(DexContract._address, USDC)
        .send({
          from: account,
        })
        .on("transactionHash", (hash) => {
          Toast.fire({
            icon: "success",
            title: "Approved",
          });
          DexContract.methods
            .swapUSDCForEth(USDC)
            .send({ from: account })
            .on("transactionHash", (hash) => {
              Toast.fire({
                icon: "success",
                title: "Swap Success",
              });
            });
        });
    }
  };

  /**
   *
   * Price Feed (ChainLink)
   */
  const loadRateSwap = () => {
    const web3 = new Web3(config.forkNetworkRPC);
    const aggregatorV3InterfaceABI = AggregatorV3InterfaceABI;
    const addr = "0x986b5E1e1755e3C2440e960477f25201B0a8bbD4"; //USDC - ETH
    const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr);
    priceFeed.methods
      .latestRoundData()
      .call()
      .then((roundData) => {
        setRate(Web3.utils.fromWei(roundData.answer.toString()));
      });
  };

  useEffect(() => {
    loadRateSwap();
  });

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Mimic Finance | Dex</title>
          <meta name="description" content="Dai Faucet" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Text fontSize="4xl" fontWeight="bold" pt={5} align="center">
          Quick Swap
        </Text>
        <Text fontSize="md" align="center" pt={0}>
          Decentralize Exchange based-on Uniswap
        </Text>

        <Center>
          <Box w={450} pt={6}>
            <Box className="swap-box" style={{ textAlign: "center" }} p={5}>
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
                          value={from == "USDC" ? USDCSwap : ETHSwap}
                          onChange={
                            from == "USDC" ? handleChangeUSDC : handleChangeETH
                          }
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={
                              from == "USDC" ? handleMaxUSDC : handleMaxETH
                            }
                          >
                            Max
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Select
                      style={{ border: "0" }}
                      onChange={handleChageCurrency}
                    >
                      <option>USDC</option>
                      <option>ETH</option>
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
                          value={to == "ETH" ? ETHSwap : USDCSwap}
                          disabled
                        />
                      </InputGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Select style={{ border: "0" }} disabled>
                      <option>{to}</option>
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
                disabled={USDCSwap == 0 && ETHSwap == 0}
                onClick={handleClickSwap}
              >
                Swap
              </Button>
            </Box>
          </Box>
        </Center>
      </div>
    </>
  );
};

export default Dex;
