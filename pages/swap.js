import Head from "next/head";
import styles from "../styles/Home.module.css";
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
import Swal from "sweetalert2";

import useAppSelector from "../hooks/useAppSelector";

const Faucet = () => {
  const { faucetContract, account } = useAppSelector((state) => state.auth);

  const claimToken = async () => {
    await faucetContract.methods
      .claim()
      .send({ from: account })
      .on("transactionHash", (hash) => {
        Swal.fire({
          icon: "success",
          title: "Claim Success",
          showConfirmButton: false,
          timer: 1500,
        });
      });
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
          Mimic Swap
        </Text>
        {/* <Text fontSize="md" align="center" pt={0}>
          Mimic Finance Decentralize Exchange
        </Text> */}
        <Center>
          <Box w={450} pt={8}>
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
                        />
                        <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm">
                            Max
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Select style={{ border: "0" }}>
                      <option>mDAI</option>
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
                        />
                        <InputRightElement width="4.5rem">
                          <Button h="1.75rem" size="sm">
                            Max
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                    </FormControl>
                  </GridItem>
                  <GridItem colSpan={3}>
                    <Select style={{ border: "0" }}>
                      <option>TOKEN</option>
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
