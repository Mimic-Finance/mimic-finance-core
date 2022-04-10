import { useEffect, useState } from "react";
import TokenAddress from "../constants/TokenAddress.json";

//import ABI file
import usdc from "../abis/ERC20Mock.json";
import farm from "../abis/Farming.json";

const useContract = (abi, address) => {
  const web3 = window.web3;
  const [contract, setContract] = useState(new web3.eth.Contract(abi, address));

  useEffect(() => {
    setContract(new web3.eth.Contract(abi, address));
  }, [abi, address, web3]);

  return contract;
};

export const useUSDC = () => {
  const abi = usdc.abi;
  return useContract(abi, TokenAddress.USDC);
};

export const useFarm = () => {
  const abi = farm.abi;
  console.log(farm.address);
  return useContract(abi, farm.address);
};

export default useContract;
