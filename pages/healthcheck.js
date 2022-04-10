import { Text, Box } from "@chakra-ui/react";
import useAppSelector from "../hooks/useAppSelector";

import { useUSDC, useFarm } from "hooks/useContract";
import { useEffect, useState, useCallback } from "react";

const Healthcheck = () => {
  const { FarmingContract, JUSDContract, AutoContract } = useAppSelector(
    (state) => state.contracts
  );
  const { account } = useAppSelector((state) => state.account);
  const [USDCBalance, setUSDCBalance] = useState(0);

  const USDCContract = useUSDC();
  const getUSDCBalance = useCallback(async () => {
    const balance = await USDCContract.methods.balanceOf(account).call();
    setUSDCBalance(balance);
  }, [USDCContract.methods, account]);

  const farmContract = useFarm();
  console.log(farmContract);

  useEffect(() => {
    getUSDCBalance();
  }, [getUSDCBalance]);

  return (
    <>
      <Box style={{ textAlign: "left" }} ml={20}>
        <Text>Account: {account}</Text>
        <Text>FarmingContract: {FarmingContract._address}</Text>
        <Text>JUSDContract: {JUSDContract._address}</Text>
        <Text>AutoContract: {AutoContract._address}</Text>

        <Text>USDC Balance: {USDCBalance}</Text>
      </Box>
    </>
  );
};

export default Healthcheck;
