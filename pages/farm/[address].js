import { useEffect, useState, useCallback } from "react";

import styles from "styles/Home.module.css";
import Head from "next/head";
import OpenPool from "constants/OpenPool.json";
import { PoolContextProvider } from "contexts/PoolContext";
import { Panel } from "components/StableCoinPool/Panel";
import { useERC20Utils } from "hooks/useContracts";
import { useRouter } from "next/router";

import {
  Text,
  Grid,
  Container,
  Box,
  GridItem,
  Image,
  IconButton,
  ButtonGroup,
  Badge,
} from "@chakra-ui/react";

import { FaCalculator } from "react-icons/fa";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import TVD from "components/StableCoinPool/TVD";
import Link from "next/link";

const StableCoinPool = () => {
  const router = useRouter();
  const { address } = router.query;
  const ERC20Utils = useERC20Utils();
  const [symbol, setSymbol] = useState();
  const [poolInfo, setPoolInfo] = useState(
    OpenPool.find((pool) => pool.address == address)
  );

  const getImage = (address) => {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${address}/logo.png`;
  };

  const getSymbol = useCallback(async () => {
    try {
      const _symbol = await ERC20Utils.methods.symbol(address).call();
      //FIX load JUSD pool info
      if (_symbol === "JUSD") {
        setPoolInfo(OpenPool.find((pool) => pool.symbol === "JUSD"));
      }
      setSymbol(_symbol);
    } catch {}
  }, [ERC20Utils.methods, address]);

  useEffect(() => {
    getSymbol();
  }, [getSymbol]);

  return (
    <div className={styles.container}>
      <PoolContextProvider address={address}>
        <Head>
          <title>Mimic Finance | {symbol} Pool</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Container maxW="container.xl" mt={10}>
          <>
            <Grid templateColumns="repeat(10, 1fr)" gap={6}>
              <GridItem colSpan={1}>
                <Box>
                  <Image
                    src={getImage(address)}
                    alt={address}
                    width={75}
                    minWidth={45}
                    fallbackSrc="/assets/images/logo-box.png"
                  />
                </Box>
              </GridItem>
              <GridItem colSpan={5}>
                <Text fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>
                  <b>{symbol}</b>
                </Text>
              </GridItem>
              <GridItem colSpan={4} style={{ textAlign: "right" }}>
                <ButtonGroup variant="ghost" color="gray.600">
                  <IconButton
                    aria-label="Calculator"
                    icon={<FaCalculator fontSize="15px" />}
                  />
                </ButtonGroup>
                &nbsp; APR
                <Text fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}>
                  {poolInfo?.apr} %
                </Text>
              </GridItem>
            </Grid>

            <Box className="row">
              <Box className="col-md-7" pt={{ base: 5, md: 3, lg: 3 }}>
                <Text
                  fontSize="md"
                  style={{ textAlign: "justify", textJustify: "inter-word" }}
                  pr={{ base: 0, md: 0, lg: 7 }}
                  pl={{ base: 0, md: 0, lg: 7 }}
                >
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  {poolInfo?.info}
                  <Box pt={5}>
                    <Badge variant="outline" colorScheme="blue">
                      <Link
                        passHref
                        href={`https://etherscan.io/token/${address}`}
                      >
                        <Text style={{ cursor: "pointer" }}>
                          {"< > "}Contract <ExternalLinkIcon />
                        </Text>
                      </Link>
                    </Badge>
                  </Box>
                </Text>

                <br />
                <Box
                  pl={{ base: 0, md: 0, lg: 7 }}
                  pt={{ base: 3, md: 0, lg: 0 }}
                  pb={{ base: 5, md: 0, lg: 0 }}
                  textAlign={{ base: "center", md: "left", lg: "left" }}
                >
                  <TVD tokenAddress={address} symbol={symbol}></TVD>
                </Box>
              </Box>
              <Box className="col-md-5" style={{ paddingTop: "10px" }}>
                <Panel symbol={symbol} tokenAddress={address} />
              </Box>
            </Box>
          </>
        </Container>
      </PoolContextProvider>
    </div>
  );
};

export default StableCoinPool;
