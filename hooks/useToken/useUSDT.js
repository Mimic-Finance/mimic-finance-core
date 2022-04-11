import useContract from "../useContract";
import TokenAddress from "../../constants/TokenAddress.json";
import USDT_ABI from "../../abis/USDT.json";

import useAppSelector from "hooks/useAppSelector";

import { useCallback, useEffect, useState } from "react";

const useUSDT = () => {
  const { account } = useAppSelector((state) => state.account);

  const abi = USDT_ABI.abi;
  const contract = useContract(abi, TokenAddress.USDT);
  const [balance, setBalance] = useState(false);

  const getBalance = useCallback(async () => {
    const _balance = await contract.methods.balanceOf(account).call();
    setBalance(_balance);
  }, [account, contract.methods]);

  useEffect(() => {
    if (account) {
      getBalance();
    }
  }, [getBalance, account]);

  return { contract, balance };
};

export default useUSDT;
