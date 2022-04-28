import { useSwap } from "hooks/useContracts";
import { Button } from "@chakra-ui/react";
import { useState } from "react";
import Web3 from "web3";

const SwapComp = () => {
  const Swap = useSwap();
  const [amount, setAmount] = useState(100000);
  const [token, setToken] = useState(
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  );

  const handleSwap = async () => {
    try {
      const _amount = await Swap.methods.testSwapValue(amount, token).call();
      console.log(_amount);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Button onClick={handleSwap}>Swap</Button>
    </>
  );
};

export default SwapComp;
