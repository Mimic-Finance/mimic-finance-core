import { useState, useEffect, useCallback } from "react";
import useAppSelector from "../../hooks/useAppSelector";
import Web3 from "web3";
import CountUp from "react-countup";

import { Text } from "@chakra-ui/react";

const TVD = () => {
  const { FarmingContract, JUSDContract } = useAppSelector(
    (state) => state.contracts
  );

  const [tvd, setTVD] = useState(0);

  const loadTVD = useCallback(async () => {
    if (FarmingContract._address && JUSDContract) {
      let _tvd = await JUSDContract.methods
        .balanceOf(FarmingContract._address)
        .call();
      setTVD(_tvd.toString());
    }
  }, [FarmingContract._address, JUSDContract]);

  useEffect(() => {
    loadTVD();
  }, [FarmingContract, loadTVD]);

  return (
    <Text fontSize="5xl">
      ${" "}
      <CountUp
        duration={2}
        end={Web3.utils.fromWei(tvd.toString())}
        separator=","
      />
    </Text>
  );
};

export default TVD;
