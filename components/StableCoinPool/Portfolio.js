import {
  Box,
  Text,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { useFarm, useERC20Utils } from "hooks/useContracts";
import useAccount from "hooks/useAccount";
import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";

const Portfolio = ({ token, symbol }) => {
  const account = useAccount();
  const Farm = useFarm();
  const ERC20Utils = useERC20Utils();

  const [balance, setBalance] = useState(0);
  const [reward, setReward] = useState(0);

  const getBalanceAndReward = useCallback(async () => {
    const decimal = await ERC20Utils.methods.decimals(token).call();
    const _balance = await Farm.methods
      .getStakingBalance(token, account)
      .call();
    const _reward = await Farm.methods.calculateRewards(account, token).call();

    if (decimal == 6) {
      setBalance(_balance / Math.pow(10, decimal));
      setReward(Web3.utils.fromWei(_reward, "ether"));
    } else {
      setBalance(Web3.utils.fromWei(_balance, "ether"));
      setReward(Web3.utils.fromWei(_reward, "ether"));
    }
  }, [account, token, ERC20Utils, Farm]);

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
                  })} {symbol}
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
                  })} MIM
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
