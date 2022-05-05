import { Box, Text, Grid, GridItem } from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { useAutoCompound, useERC20Utils, useSwap } from "hooks/useContracts";
import useAccount from "hooks/useAccount";
import { useCJUSD } from "hooks/useToken";
import Web3 from "web3";
import axios from "axios";

const Portfolio = () => {
  const account = useAccount();
  const AutoCompound = useAutoCompound();
  const CJUSD = useCJUSD();

  const [balance, setBalance] = useState(0);
  const [reward, setReward] = useState(0);

  const handleGetBalance = useCallback(async () => {
    const _balance = await AutoCompound.methods
      .getDepositBalance(account)
      .call();
    setBalance(Web3.utils.fromWei(_balance, "ether"));
  }, [account, AutoCompound]);

  const handleGetReward = useCallback(
    async (_CJUSD_Balance) => {
      const response = await axios.get(
        "https://api-mimic.kmutt.me/api/v1/price/0xd7D49e3c39e88517F9E240d5B5de0aF8fb8b3619"
      );
      const _reward = 0;
      if (_CJUSD_Balance && balance > 0) {
        _reward =
          parseFloat(Web3.utils.fromWei(_CJUSD_Balance.toString())) *
            parseFloat(response.data.price) -
          parseFloat(balance);

        if (_reward < 0) {
          _reward = 0;
        }
      }
      setReward(_reward);
    },
    [balance]
  );

  useEffect(() => {
    handleGetBalance();
  }, [handleGetBalance]);

  useEffect(() => {
    if (CJUSD.balance > 0) {
      handleGetReward(CJUSD.balance);
    }
  }, [CJUSD.balance, handleGetReward]);

  return (
    <>
      {balance > 0 && (
        <Box mt={5}>
          <Text fontSize="xl">
            <b>Portfolio</b>
          </Text>
          <Box p={4} mt={3} className="portfolio-box">
            <Grid
              templateColumns="repeat(12, 1fr)"
              style={{ textAlign: "left" }}
              gap={6}
            >
              <GridItem colSpan={6} style={{ textAlign: "center" }}>
                <Box mb={3}>
                  <b>Balance</b>
                </Box>

                <Box>
                  {parseFloat(balance).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  JUSD
                </Box>
              </GridItem>
              <GridItem colSpan={6} style={{ textAlign: "center" }}>
                <Box mb={3}>
                  <b>Reward</b>
                </Box>

                <Box>
                  {parseFloat(reward).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  JUSD
                </Box>
              </GridItem>
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Portfolio;
