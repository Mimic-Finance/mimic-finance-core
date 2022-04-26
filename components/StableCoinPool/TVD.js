import { useState, useEffect, useCallback } from "react";
import Web3 from "web3";
import CountUp from "react-countup";
import { useFarm, useERC20Utils } from "hooks/useContracts";
import { Text, Box } from "@chakra-ui/react";

const TVD = ({ tokenAddress, symbol }) => {
  const Farm = useFarm();
  const ERC20Utils = useERC20Utils();
  const [tvd, setTVD] = useState(0);

  const loadTVD = useCallback(async () => {
    const _tvd = await ERC20Utils.methods
      .balanceOf(tokenAddress, Farm.address)
      .call();

    const decimal = await ERC20Utils.methods.decimals(tokenAddress).call();
    if (decimal == 6) {
      setTVD(_tvd / Math.pow(10, 6));
    } else {
      setTVD(Web3.utils.fromWei(_tvd.toString()));
    }
  }, [ERC20Utils, tokenAddress, Farm]);

  useEffect(() => {
    loadTVD();
  }, [loadTVD]);

  return (
    <>
      {tvd > 0 && (
        <Box>
          <Text fontSize="xl">
            <b>Total Value Deposited</b>
          </Text>
          <Text fontSize="5xl">
            <CountUp duration={2} end={tvd} separator="," />
            <font size="6">{" " + symbol}</font>
          </Text>
        </Box>
      )}
    </>
  );
};

export default TVD;
