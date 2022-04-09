import Head from "next/head";
import styles from "../../styles/Home.module.css";
import Web3 from "web3";
import { useRouter } from "next/router";
import TVD from "../../components/JUSDAuto/TVD";

import {
  Text,
  Grid,
  Container,
  Box,
  GridItem,
  Image,
  Spinner,
  Center,
  IconButton,
  ButtonGroup,
  Divider,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaCalculator } from "react-icons/fa";
import CountUp from "react-countup";
import Portfolio from "../../components/JUSDAuto/Portfolio";

import { Panel } from "../../components/JUSDAuto/Panel";

const JUSDAuto = () => {
  const info = {
    poolName: "",
    label: "",
    description: "",
    tvd: 100,
    apy: 100,
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Mimic Finance | Multi Farming Yields Aggerator System</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.xl" mt={10}>
        <>
          <Grid templateColumns="repeat(10, 1fr)" gap={6}>
            <GridItem colSpan={1}>
              <Box>
                <Image
                  src={"/assets/images/pools/JUSD.png"}
                  alt="JUSD Staking"
                  width={100}
                />
              </Box>
            </GridItem>
            <GridItem colSpan={7}>
              <Text fontSize="4xl">
                <b>Auto-Compound JUSD Pool</b>
              </Text>
            </GridItem>
            <GridItem colSpan={2} style={{ textAlign: "right" }}>
              <ButtonGroup variant="ghost" color="gray.600">
                <IconButton
                  aria-label="Calculator"
                  icon={<FaCalculator fontSize="15px" />}
                />
              </ButtonGroup>
              &nbsp; APY
              <Text fontSize="4xl">50 %</Text>
            </GridItem>
          </Grid>

          <Grid templateColumns="repeat(10, 1fr)" gap={10} mt={7}>
            <GridItem colSpan={6}>
              <Text fontSize="xl">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; $JUSD is a
                stablecoin whose value is pegged to the U.S. dollar, which means
                it is shielded from the wild swings in prices that are typically
                associated with a cryptocurrency.
              </Text>

              <Box mt={10}>
                <Text fontSize="xl">
                  <b>Total Value Deposited</b>
                </Text>
                {/* <TVD></TVD> (to do fix) */}
              </Box>
            </GridItem>
            <GridItem colSpan={4}>
              <Panel info={info} />
              {/* <Portfolio></Portfolio> */}
            </GridItem>
          </Grid>
        </>
      </Container>
    </div>
  );
};

export default JUSDAuto;
