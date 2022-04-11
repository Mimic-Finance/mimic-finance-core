import useContract from "../useContract";
import TokenAddress from "../../constants/TokenAddress.json";
import BUSD_ABI from "../../abis/BUSD.json";

import useAppSelector from "hooks/useAppSelector";

import { useCallback, useEffect, useState } from "react";

const useBUSD = () => {
  const { account } = useAppSelector((state) => state.account);

  const abi = BUSD_ABI.abi;
  const contract = useContract(abi, TokenAddress.BUSD);
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

export default useBUSD;
