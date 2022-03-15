import { useState, useEffect } from "react";
import useAppSelector from "../../hooks/useAppSelector";
import Web3 from "web3";
import CountUp from "react-countup";

import { Text } from "@chakra-ui/react";

const TVD = () => {
  const { FarmTokenContract, DAITokenContract } = useAppSelector(
    (state) => state.contracts
  );

  const [tvd, setTVD] = useState(0);

  const loadTVD = async () => {
    if (FarmTokenContract._address && DAITokenContract) {
      let _tvd = await DAITokenContract.methods
        .balanceOf(FarmTokenContract._address)
        .call();
      setTVD(_tvd.toString());
    }
  };

  useEffect(() => {
    loadTVD();
  }, [FarmTokenContract]);

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
