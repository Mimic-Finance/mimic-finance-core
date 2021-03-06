import Head from "next/head";
import styles from "styles/Home.module.css";
import {
  Text,
  Box,
  Container,
  SimpleGrid,
  Button,
  Image,
} from "@chakra-ui/react";
import { FaGavel } from "react-icons/fa";
import Link from "next/link";
import OpenPool from "constants/OpenPool.json";
import { Pool } from "components/Pools/Pool";
import { useJUSD } from "hooks/useToken";

const Home = () => {
  const JUSD = useJUSD();
  return (
    <div className={styles.container}>
      <Head>
        <title>Mimic Finance | Farm</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Text
        fontSize={{ base: "4xl", md: "4xl", lg: "5xl" }}
        fontWeight="bold"
        pt={7}
        align="center"
      >
        Enter any pool with withlisted token
      </Text>
      <Text
        fontSize={{ base: "lg", md: "xl", lg: "2xl" }}
        align="center"
        pt={4}
      >
        Deposit with whitelisted Token{" "}
        <a href="#">
          <Link href="/whitelisted" passHref style={{ color: "teal" }}>
            <small>
              <u>Check here</u>
            </small>
          </Link>
        </a>
      </Text>

      <Container maxW="container.xl">
        <Text fontWeight="bold" fontSize="xl" pt={20}>
          Available Farming Pools
        </Text>

        <SimpleGrid mt={5} minChildWidth="300px" gap={10} spacing="60px">
          {OpenPool.map((pool) => {
            return (
              <>
                <Box mt={20} ml={5}>
                  <Pool
                    key={pool.symbol === "JUSD" ? JUSD.address : pool.address}
                    address={
                      pool.symbol === "JUSD" ? JUSD.address : pool.address
                    }
                    poolName={pool.symbol}
                    description={pool.description}
                    token={pool.token}
                    apr={pool.apr}
                    label={pool.symbol}
                    color={pool.color}
                    type={pool.type}
                    gradient={
                      pool.gradient
                        ? {
                            color1: pool.gradient.color1,
                            color2: pool.gradient.color2,
                          }
                        : null
                    }
                  />
                </Box>
              </>
            );
          })}
        </SimpleGrid>
      </Container>
    </div>
  );
};

export default Home;
