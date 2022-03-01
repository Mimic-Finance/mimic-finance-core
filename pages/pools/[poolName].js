import Head from "next/head";
import styles from "../../styles/Home.module.css";

import { useRouter } from "next/router";

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

import { Panel } from "../../components/FarmPanel/Panel";

const DeFiFriendsPage = () => {
  const { poolName } = useRouter().query;
  const [poolInfo, setPoolInfo] = useState();

  useEffect(() => {
    fetch("/api/pools/" + poolName)
      .then((response) => response.json())
      .then((data) => setPoolInfo(data));
  }, [poolName]);

  if (!poolInfo) {
    return (
      <Center style={{ paddingTop: "50px;" }}>
        <Spinner />
      </Center>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Mimic Finance | Multi Farming Yields Aggerator System</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.xl" mt={10}>
        {poolInfo && (
          <>
            <Grid templateColumns="repeat(10, 1fr)" gap={6}>
              <GridItem colSpan={1}>
                <Box>
                  <Image
                    src={"/assets/images/pools/" + poolInfo.label + ".png"}
                    alt={poolInfo.label}
                    width={150}
                  />
                </Box>
              </GridItem>
              <GridItem colSpan={7}>
                <Text fontSize="4xl">
                  <b>{poolInfo.poolName}</b>
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
                <Text fontSize="4xl">{poolInfo.apy} %</Text>
              </GridItem>
            </Grid>

            <Grid templateColumns="repeat(10, 1fr)" gap={10} mt={7}>
              <GridItem colSpan={6}>
                <Text fontSize="xl">
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {poolInfo.description}
                </Text>

                <Box mt={10}>
                  <Text fontSize="xl">
                    <b>Total Value Deposited</b>
                  </Text>
                  <Text fontSize="5xl">
                    $ <CountUp duration={2} end={poolInfo.tvd} separator="," />
                  </Text>
                </Box>
              </GridItem>
              <GridItem colSpan={4}>
                <Panel info={poolInfo} />
                <Box mt={5}>
                  <Text fontSize="xl">
                    <b>Portfolio</b>
                  </Text>
                  <Box mt={2} p={4} className="portfolio-box">
                    <Grid templateColumns="repeat(9, 1fr)" gap={6}>
                      <GridItem colSpan={3}>
                        <Text fontSize="l">Balance</Text>
                        <Text mt={2} fontSize="m">
                          $ 753.23
                        </Text>
                      </GridItem>
                      <GridItem colSpan={3}>
                        <Text fontSize="l">Reward</Text>
                        <Text mt={2} fontSize="m">
                          $ 5.23
                        </Text>
                      </GridItem>
                      <GridItem colSpan={3}>
                        <Text fontSize="l">Totals</Text>
                        <Text mt={2} fontSize="m">
                          $ 758.46
                        </Text>
                      </GridItem>
                    </Grid>
                  </Box>
                </Box>
              </GridItem>
            </Grid>
          </>
        )}
      </Container>
    </div>
  );
};

export default DeFiFriendsPage;