import Head from "next/head";
import styles from "../../styles/Home.module.css";
import {
  Text,
  Center,
  Container,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
} from "@chakra-ui/react";

import Toast from "../../components/Utils/Toast/Toast";
import Web3 from "web3";

import useAppSelector from "../../hooks/useAppSelector";
import { useState } from "react";

const Faucet = () => {
  const { account } = useAppSelector((state) => state.account);
  const {
    ETHBalance,
    USDCBalance,
    JUSDBalance,
    MimicBalance,
    JUSDStakingBalance,
  } = useAppSelector((state) => state.contracts);

  return (
    <>
      <div className={styles.container}>
        <Head>
          <title>Mimic Finance | Portfolio</title>
          <meta name="description" content="Dai Faucet" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <Text fontSize="4xl" fontWeight="bold" pt={5} align="center">
          Portfolio
        </Text>
        <Text fontSize="md" align="center" pt={0}>
          <b>Account:</b> {account}
        </Text>
        <Container maxW="container.md" mt={10}>
          <Center>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>TOKEN</Th>
                  <Th>TYPE</Th>
                  <Th isNumeric>Balance</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>ETH</Td>
                  <Td>ERC-20</Td>
                  <Td isNumeric>
                    {Number(
                      parseFloat(
                        Web3.utils.fromWei(ETHBalance.toString())
                      ).toFixed(4)
                    ).toLocaleString("en")}
                  </Td>
                </Tr>
                <Tr>
                  <Td>USDC</Td>
                  <Td>ERC-20</Td>
                  <Td isNumeric>
                    {Number(parseFloat(USDCBalance).toFixed(4)).toLocaleString(
                      "en"
                    )}
                  </Td>
                </Tr>
                <Tr>
                  <Td>JUSD</Td>
                  <Td>ERC-20</Td>
                  <Td isNumeric>
                    {Number(
                      parseFloat(
                        Web3.utils.fromWei(JUSDBalance.toString())
                      ).toFixed(4)
                    ).toLocaleString("en")}
                  </Td>
                </Tr>
                <Tr>
                  <Td>MIM</Td>
                  <Td>ERC-20</Td>
                  <Td isNumeric>
                    {Number(
                      parseFloat(
                        Web3.utils.fromWei(MimicBalance.toString())
                      ).toFixed(4)
                    ).toLocaleString("en")}
                  </Td>
                </Tr>
                <Tr>
                  <Td>JUSD-POOL</Td>
                  <Td>LP</Td>
                  <Td isNumeric>
                    {Number(
                      parseFloat(
                        Web3.utils.fromWei(JUSDStakingBalance.toString())
                      ).toFixed(4)
                    ).toLocaleString("en")}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Center>
        </Container>
      </div>
    </>
  );
};

export default Faucet;
