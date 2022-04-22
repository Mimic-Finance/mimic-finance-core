import { useEffect, useState } from "react";

const useContract = (abi, address) => {
  const web3 = window.web3;
  const [contract, setContract] = useState(new web3.eth.Contract(abi, address));

  useEffect(() => {
    setContract(new web3.eth.Contract(abi, address));
  }, [abi, address, web3]);

  return contract;
};

export default useContract;
