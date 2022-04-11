import useContract from "../useContract";
import CJUSD_ABI from "../../abis/cJUSD.json";

import useAppSelector from "hooks/useAppSelector";

import { useCallback, useEffect, useState } from "react";

const useCJUSD = () => {
  const { account } = useAppSelector((state) => state.account);

  const abi = CJUSD_ABI.abi;
  const contract = useContract(abi, CJUSD_ABI.networks[1].address);
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

export default useCJUSD;
