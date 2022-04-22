import { Text, Box } from "@chakra-ui/react";

import { useUSDC, useBUSD } from "hooks/useToken";
import { useFarm, useAutoCompound } from "hooks/useContracts";
import useAccount from "hooks/useAccount";

const Healthcheck = () => {
  const USDC = useUSDC();
  const BUSD = useBUSD();
  const Farm = useFarm();
  const AutoCompound = useAutoCompound();

  const account = useAccount();

  return (
    <>
      <Box style={{ textAlign: "left" }} ml={20}>
        <Text>Account: {account}</Text>

        <Text>USDC Balance: {USDC.balance}</Text>
        <Text>BUSD Balance: {BUSD.balance}</Text>
      </Box>
    </>
  );
};

export default Healthcheck;