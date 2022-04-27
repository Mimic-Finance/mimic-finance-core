import Head from "next/head";
import {
  Text,
  Container,
  Grid,
  GridItem,
  Flex,
  Button,
  Image,
  Box,
  Center,
} from "@chakra-ui/react";

import Link from "next/link";

const Home = () => {
  return (
    <>
      <Head>
        <title>Mimic Finance | Multi Farming Yields Aggerator System</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW="container.xl">
        <Center>
          <Grid
            templateRows="repeat(1, 1fr)"
            templateColumns="repeat(1, 1fr)"
            gap={5}
            pt={{ base: "3", md: "5", lg: "7" }}
          >
            <GridItem colSpan={1} pt={10}>
              <Center pb={7}>
                <Image
                  src="/assets/images/logo-box.png"
                  alt="mimic_finance"
                  width="140px"
                />
              </Center>
              <Center>
                <Text className="text-primary home-title">
                  Multi <text className="text-normal">Farming</text>
                </Text>
              </Center>
              <Text className="home-subtitle text-normal">
                <Center>Yields Aggerator System</Center>
              </Text>
              <Text className="text-normal" mt={7}>
                <Center style={{ textAlign: "center" }}>
                  Make investment easy low fees & Makes farming easy only one
                  step
                </Center>
              </Text>
            </GridItem>
            <GridItem colSpan={1}>
              <Center>
                <Flex>
                  <Grid
                    templateRows="repeat(1, 1fr)"
                    templateColumns="repeat(2, 1fr)"
                    gap={5}
                    pt={{ base: "2", md: "4", lg: "7" }}
                  >
                    <GridItem colSpan={1}>
                      <Button>Documents</Button>
                    </GridItem>
                    <GridItem colSpan={1}>
                      <Link href="/farm" passHref>
                        <Button
                          style={{
                            color: "#FFFFFF",
                            background:
                              "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
                          }}
                        >
                          Launch App
                        </Button>
                      </Link>
                    </GridItem>
                  </Grid>
                </Flex>
              </Center>
            </GridItem>
          </Grid>
        </Center>
      </Container>

      {/* <Box bgGradient="linear(to-r, #da65d1, #576cea)" mt="20">
        <Container maxW="container.xl">
          <Grid
            templateRows="repeat(1, 1fr)"
            templateColumns="repeat(10, 1fr)"
            gap={5}
            pt={{ base: "4", md: "5", lg: "20" }}
            pb={{ base: "4", md: "5", lg: "20" }}
          >
            <GridItem colSpan={10}>
              <Center>
                <Text
                  className="home-subtitle home-h3"
                  style={{ color: "#ffffff" }}
                >
                  Recommended Pool
                </Text>
              </Center>
            </GridItem>
          </Grid>
        </Container>
      </Box> */}

      <Box>
        <Container maxW="container.xl" pt={20}>
          <Center>
            <Text className="home-subtitle home-h3">Join our community</Text>
          </Center>
        </Container>
      </Box>

      <Box>
        <Container maxW="container.xl" pt={10}>
          <Grid templateColumns="repeat(2, 1fr)" gap={5} pt={5}>
            <Box
              w="100%"
              p={{ base: "6", md: "8", lg: "10" }}
              style={{ borderRadius: 10 }}
              className="community-box"
            >
              <Center>
                <Image
                  src="/assets/images/blue-twitter-icon.svg"
                  alt="mimic_finance"
                  width={{ base: "40px", md: "60px", lg: "80px" }}
                  className="community-icon"
                />
              </Center>
              <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl", lg: "2xl" }}>
                Twitter
              </Text>

              <Text fontSize={{ base: "xs", md: "sm", lg: "md" }}>@MimicFinance</Text>
            </Box>
            <Box
              w="100%"
              p={{ base: "6", md: "8", lg: "10" }}
              style={{ borderRadius: 10 }}
              className="community-box"
            >
              <Center>
                <Image
                  src="/assets/images/blue-telegram-icon.svg"
                  alt="mimic_finance"
                  width={{ base: "40px", md: "60px", lg: "80px" }}
                  className="community-icon"
                />
              </Center>
              <Text fontWeight="bold" fontSize={{ base: "lg", md: "xl", lg: "2xl" }}>
                Telegram
              </Text>

              <Text fontSize={{ base: "xs", md: "sm", lg: "md" }}>@MimicFinance</Text>
            </Box>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Home;
