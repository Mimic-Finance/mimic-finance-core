import { Box, Text, Grid, GridItem } from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { useAutoCompound, useERC20Utils, useSwap } from "hooks/useContracts";
import useAccount from "hooks/useAccount";
import { useCJUSD } from "hooks/useToken";
import Web3 from "web3";

const Portfolio = () => {
  const account = useAccount();
  const ERC20Utils = useERC20Utils();
  const AutoCompound = useAutoCompound();
  const CJUSD = useCJUSD();
  const Swap = useSwap();

  const [balance, setBalance] = useState(0);
  const [reward, setReward] = useState(0);

  const getBalanceAndReward = useCallback(async () => {
    const _balance = await ERC20Utils.methods
      .balanceOf(CJUSD.address, account)
      .call();
    const _cJUSDPrice = await Swap.methods.cJUSDPrice().call();
    const _cJUSDBuyPrice = await AutoCompound.methods
      .cJUSDBuyPrice(account)
      .call();
    const _reward = (_cJUSDPrice - _cJUSDBuyPrice) * _balance;
    setBalance(Web3.utils.fromWei(_balance, "ether"));
    setReward(parseFloat(Web3.utils.fromWei(_reward.toString(), "ether")));
  }, [account, AutoCompound, ERC20Utils]);

  useEffect(() => {
    getBalanceAndReward();
  }, [getBalanceAndReward]);

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
              {/* <GridItem colSpan={3} style={{ textAlign: "center" }}>
                <Box mb={3}>
                  <b>Totals</b>
                </Box>
    
                <Box>
                  {(parseFloat(balance) + parseFloat(reward)).toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )}
                </Box>
              </GridItem> */}
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );
};

export default Portfolio;
