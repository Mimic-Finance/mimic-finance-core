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

const Mint = () => {
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
            <Box className="col-md-7">
              <Center>
                <Box w={450} pt={6}>
                  <Box
                    className="swap-box mint-box"
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
                                //   value={MimicSwap}
                                //   onChange={handleChangeMimicSwap}
                              />
                              <InputRightElement width="4.5rem">
                                <Button
                                  h="1.75rem"
                                  size="sm"
                                  // onClick={handleSetMaxMimicSwap}
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
                                //   value={JUSDSwap}
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
                      // disabled={MimicSwap == 0}
                      // onClick={handleClickSwap}
                    >
                      Swap
                    </Button>
                  </Box>
                </Box>
              </Center>
            </Box>
            <Box className="col-md-5" pt={6}>
              <Box
                className="swap-box mint-box"
                style={{ textAlign: "center" }}
                p={5}
              >
                Guide Box
              </Box>
            </Box>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default Mint;
