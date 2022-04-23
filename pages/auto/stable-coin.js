import Head from "next/head";
import styles from "styles/Home.module.css";
import Web3 from "web3";
import { useRouter } from "next/router";
import TVD from "components/StableCoinAutoCompound/TVD";

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
import Portfolio from "../../components/StableCoinAutoCompound/Portfolio";

import { Panel } from "../../components/StableCoinAutoCompound/Panel";

const StableCoinAutoCompound = () => {
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
                  src={"/assets/images/pools/stable-coin.png"}
                  alt="stable-coin-pool-auto"
                  width={200}
                />
              </Box>
            </GridItem>
            <GridItem colSpan={7}>
              <Text fontSize="4xl">
                <b>Auto-Compound: Stable Coin</b>
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
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; A stablecoin is
                a class of cryptocurrencies that attempt to offer price
                stability and are backed by a reserve asset. Stablecoins have
                gained traction as they attempt to offer the best of both
                worlds—the instant processing and security or privacy of
                payments of cryptocurrencies, and the volatility-free stable
                valuations of fiat currencies.
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

export default StableCoinAutoCompound;
