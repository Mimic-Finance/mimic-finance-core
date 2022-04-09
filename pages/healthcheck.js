import { Center, Text, Box } from "@chakra-ui/react";
import useAppSelector from "../hooks/useAppSelector";
const Healthcheck = () => {
  const { FarmingContract, JUSDContract, AutoContract } = useAppSelector(
    (state) => state.contracts
  );
  const { account } = useAppSelector((state) => state.account);

  return (
    <>
      <Box style={{ textAlign: "left" }} ml={20}>
        <Text>Account: {account}</Text>
        <Text>FarmingContract: {FarmingContract._address}</Text>
        <Text>JUSDContract: {JUSDContract._address}</Text>
        <Text>AutoContract: {AutoContract._address}</Text>
      </Box>
    </>
  );
};

export default Healthcheck;
