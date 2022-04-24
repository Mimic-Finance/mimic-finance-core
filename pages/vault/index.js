import Head from "next/head";
import styles from "styles/Home.module.css";
import { Text, Grid, Container, Button } from "@chakra-ui/react";

import { Pool } from "components/Pools/Pool";

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Mimic Finance | Multi Farming Yields Aggerator System</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Text fontSize="5xl" fontWeight="bold" pt={7} align="center">
        Enter any Vault with any Token
      </Text>
      <Text fontSize="2xl" align="center" pt={4}>
        Deposit with whitelisted Token{" "}
        <a href="/whitelisted" style={{ color: "teal" }}>
          <small>Check here</small>
        </a>
      </Text>
      {/* <Text align="center" pt={2} style={{ color: "#999" }}>
        BTC, ETH, BNB, ADA, DOT, DOGE, AVAX, LTC, UNI, CAKE AND ALL STABLE COINS{" "}
      </Text> */}

      <Container maxW="container.lg">
        <Text fontWeight="bold" fontSize="xl" pt={20}>
          Available Farming Pools
        </Text>

        <Grid templateColumns="repeat(1, 1fr)" gap={20} pt={5}>
          <Pool
            poolName="Stable Coin Pool"
            description="Stable Coin Pool is a pool that allows you to deposit any stable coin to get a yield of 1% per day."
            token="Token: BUSD, USDC, DAI, USDT, JUSD"
            apy={122.32}
            label="stable-coin"
            color="#98dfe7"
          />
        </Grid>
      </Container>
    </div>
  );
};

export default Home;
