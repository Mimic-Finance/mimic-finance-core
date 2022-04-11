import useContract from "../useContract";
import TokenAddress from "../../constants/TokenAddress.json";
import DAI_ABI from "../../abis/DAI.json";

import useAppSelector from "hooks/useAppSelector";

import { useCallback, useEffect, useState } from "react";

const useDAI = () => {
  const { account } = useAppSelector((state) => state.account);

  const abi = DAI_ABI.abi;
  const contract = useContract(abi, TokenAddress.DAI);
  const [balance, setBalance] = useState(false);

  const methods = contract.methods;
  const address = contract._address;

  const getBalance = useCallback(async () => {
    const _balance = await contract.methods.balanceOf(account).call();
    setBalance(_balance);
  }, [account, contract.methods]);

  useEffect(() => {
    if (account) {
      getBalance();
    }
  }, [getBalance, account]);

  return { contract, methods, address, balance };
};

export default useDAI;
