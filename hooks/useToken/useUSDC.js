import useContract from "../useContract";
import TokenAddress from "../../constants/TokenAddress.json";
import USDC_ABI from "../../abis/ERC20Mock.json";

import useAppSelector from "hooks/useAppSelector";

import { useCallback, useEffect, useState } from "react";

const useUSDC = () => {
  const { account } = useAppSelector((state) => state.account);

  const abi = USDC_ABI.abi;
  const contract = useContract(abi, TokenAddress.USDC);
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

export default useUSDC;
