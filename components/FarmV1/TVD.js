import { Text } from "@chakra-ui/react";
import Web3 from "web3";

import { useState, useEffect } from "react";
import useAppSelector from "../../hooks/useAppSelector";

import CountUp from "react-countup";

const TVD = () => {
  const { farmToken, daiToken } = useAppSelector((state) => state.auth);
  //TVD
  const [tvd, setTVD] = useState(0);

  const loadTVD = async () => {
    if (farmToken._address && daiToken) {
      let _tvd = await daiToken.methods.balanceOf(farmToken._address).call();
      setTVD(_tvd.toString());
    }
  };

  useEffect(() => {
    loadTVD();
  }, [farmToken]);

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
