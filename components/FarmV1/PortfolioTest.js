import { Box, Text, Grid, GridItem, Button } from "@chakra-ui/react";
import useAppSelector from "../../hooks/useAppSelector";

const Portfolio = ({ balance, reward, total }) => {
  const { farmToken } = useAppSelector((state) => state.auth);

  const claimReward = async () => {
    await farmToken.methods.issueTokens().call();
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
