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
import { useState } from "react";

const Faucet = () => {
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

  const handleChangeETHSwap = (e) => {
    if (e.target.value > parseFloat(ETHBalance)) {
      Toast.fire({
        icon: "warning",
        title: "Insufficient of ETH Balance",
      });
    } else {
      setETHSwap(e.target.value);
    }
  };

  const handleChangeUSDCSwap = (e) => {
    if (e.target.value > parseFloat(USDCBalance)) {
      Toast.fire({
        icon: "warning",
        title: "Insufficient of USDC Balance",
      });
    } else {
      setUSDCSwap(e.target.value);
    }
  };

  const handleSetMaxETHSwap = () => {
    setETHSwap(Web3.utils.fromWei(ETHBalance.toString()));
  };

  const handleSetMaxUSDCSwap = () => {
    setUSDCSwap(USDCBalance);
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
                  ETH {"->"} USDC
                </Text>
                <Grid templateColumns="repeat(10, 1fr)" gap={0}>
                  <GridItem colSpan={7}>
                    <FormControl id="email">
                      <InputGroup size="md">
                        <Input
                          type="number"
                          style={{ border: "0" }}
                          placeholder="0.00"
                          value={ETHSwap}
                          onChange={handleChangeETHSwap}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={handleSetMaxETHSwap}
                          >
                            Max
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Select style={{ border: "0" }}>
                      <option>ETH</option>
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
                disabled={ETHSwap == 0}
                onClick={handleClickETHtoUSDCSwap}
              >
                Swap
              </Button>
            </Box>
          </Box>
        </Center>
        <Center>
          {/* USCD to ETH */}
          <Box w={450} pt={6}>
            <Box className="swap-box" style={{ textAlign: "center" }} p={5}>
              {/* From */}
              <Box className="currency-box">
                <Text
                  fontSize={"sm"}
                  style={{ textAlign: "left", marginBottom: "15px" }}
                >
                  USDC {"->"} ETH
                </Text>
                <Grid templateColumns="repeat(10, 1fr)" gap={0}>
                  <GridItem colSpan={7}>
                    <FormControl id="email">
                      <InputGroup size="md">
                        <Input
                          type="number"
                          style={{ border: "0" }}
                          placeholder="0.00"
                          value={USDCSwap}
                          onChange={handleChangeUSDCSwap}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={handleSetMaxUSDCSwap}
                          >
                            Max
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Select style={{ border: "0" }}>
                      <option>USDC</option>
                    </Select>
                  </GridItem>
                </Grid>
              </Box>

              {/* Button */}
              <Button
                style={{ borderRadius: "15px" }}
                width={"100%"}
                colorScheme="cyan"
                height="70px"
                className="swap-button"
                disabled={USDCSwap == 0}
                onClick={handleClickUSDCtoETHSwap}
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

export default Faucet;
