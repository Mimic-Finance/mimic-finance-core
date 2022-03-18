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
} from "@chakra-ui/react";
import { ArrowDownIcon } from "@chakra-ui/icons";
import Toast from "../../components/Utils/Toast/Toast";
import Web3 from "web3";

import useAppSelector from "../../hooks/useAppSelector";
import { useEffect, useState } from "react";

const Faucet = () => {
  const { account } = useAppSelector((state) => state.account);
  const { SwapContract, JUSDContract, MimicContract } = useAppSelector(
    (state) => state.contracts
  );

  //Token Balance
  const { MimicBalance, JUSDBalance } = useAppSelector(
    (state) => state.contracts
  );

  console.log("Mimic => " + Web3.utils.fromWei(MimicBalance.toString()));
  console.log("JUSD =>" + Web3.utils.fromWei(JUSDBalance.toString()));

  //Swap State
  const [MimicSwap, setMimicSwap] = useState(0);
  const [JUSDSwap, setJUSDSwap] = useState(0);

  // to do fix to use from smartcontract rate
  const [mockRate, setMockRate] = useState(
    (Math.random() * (0.99 - 0.1) + 0.1).toFixed(4)
  );

  const handleChangeMimicSwap = (e) => {
    if (e.target.value > Web3.utils.fromWei(MimicBalance.toString())) {
      Toast.fire({
        icon: "warning",
        title: "Insufficient of Mimic Balance",
      });
    } else {
      setMimicSwap(e.target.value);
      setJUSDSwap(e.target.value * mockRate);
    }
  };

  const handleSetMaxMimicSwap = () => {
    setMimicSwap(Web3.utils.fromWei(MimicBalance.toString()));
  };

  const handleClickSwap = async () => {
    console.log(Web3.utils.toWei(MimicSwap.toString()));
    await MimicContract.methods
      .approve(SwapContract._address, Web3.utils.toWei(MimicSwap.toString()))
      .send({ from: account })
      .on("transactionHash", (hash) => {
        Toast.fire({
          icon: "success",
          title: "Approved Success",
        }).then(() => {
          SwapContract.methods
            .SwapToken(Web3.utils.toWei(MimicSwap.toString()))
            .send({ from: account })
            .on("transactionHash", (hash) => {
              Toast.fire({
                icon: "success",
                title: "Swap Success",
              }).then(() => {
                setMimicSwap(0);
                setJUSDSwap(0);
              });
            });
        });
      });
  };

  useEffect(() => {
    setJUSDSwap(MimicSwap * mockRate);
  }, [MimicBalance, MimicSwap, mockRate]);

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Mimic Finance | Swap</title>
          <meta name="description" content="Dai Faucet" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Text fontSize="4xl" fontWeight="bold" pt={5} align="center">
          Mimic Swap
        </Text>
        <Text fontSize="md" align="center" pt={0}>
          Mimic Finance Decentralize Exchange
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
                          value={MimicSwap}
                          onChange={handleChangeMimicSwap}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={handleSetMaxMimicSwap}
                          >
                            Max
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Select style={{ border: "0" }}>
                      <option>Mimic</option>
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
                          value={JUSDSwap}
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
                disabled={MimicSwap == 0}
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

export default Faucet;
