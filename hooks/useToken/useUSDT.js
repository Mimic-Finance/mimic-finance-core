import useContract from "../useContract";
import TokenAddress from "../../constants/TokenAddress.json";
import USDT_ABI from "../../abis/USDT.json";

import useAppSelector from "hooks/useAppSelector";

import { useCallback, useEffect, useState } from "react";

const useUSDT = (_account) => {
  const { account } = useAppSelector((state) => state.account);
  if (_account) {
    account = _account;
  }

  const abi = USDT_ABI.abi;
  const contract = useContract(abi, TokenAddress.USDT);
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

export default useUSDT;
