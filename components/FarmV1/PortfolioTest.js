import { Box, Text, Grid, GridItem, Button } from "@chakra-ui/react";
import useAppSelector from "../../hooks/useAppSelector";

const Portfolio = ({ balance, reward, total }) => {
  const { account, farmToken } = useAppSelector((state) => state.auth);

  const claimReward = async () => {
    console.log("CALL");
    await farmToken.methods
      .issueTokens()
      .send({ from: account })
      .on("transactionHash", (hash) => {
        // setWithdrawSuccess(withdrawSuccess + 1);
        // set reload after withdraw
        console.log("OK!");
      });
  };

  const checkReward = async () => {
    console.log("check Reward");
    const reward = await farmToken.methods.checkReward().call();
    console.log(reward);
  };

  return (
    <Box mt={5}>
      <Text fontSize="xl">
        <b>Portfolio</b>
      </Text>
      <Box mt={2} p={4} className="portfolio-box">
        <Grid templateColumns="repeat(9, 1fr)" gap={6}>
          <GridItem colSpan={3}>
            <Text fontSize="l">Balance</Text>
            <Text mt={2} fontSize="m">
              $ {balance}
            </Text>
          </GridItem>
          <GridItem colSpan={3}>
            <Text fontSize="l">Reward</Text>
            <Text mt={2} fontSize="m">
              $ {reward}
            </Text>
            <Box pt={3}>
              <Button
                onClick={() => {
                  claimReward();
                }}
                size="xs"
                colorScheme="purple"
              >
                Claim
              </Button>
              <Button
                onClick={() => {
                  checkReward();
                }}
                size="xs"
                colorScheme="orange"
              >
                Check Reward
              </Button>
            </Box>
          </GridItem>
          <GridItem colSpan={3}>
            <Text fontSize="l">Totals</Text>
            <Text mt={2} fontSize="m">
              $ {total}
            </Text>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default Portfolio;
