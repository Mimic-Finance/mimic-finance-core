import useContract from "../useContract";
import JUSD_ABI from "../../abis/JUSD.json";

import useAppSelector from "hooks/useAppSelector";

import { useCallback, useEffect, useState } from "react";

const useJUSD = () => {
  const { account } = useAppSelector((state) => state.account);

  const abi = JUSD_ABI.abi;
  const contract = useContract(abi, JUSD_ABI.networks[1].address);
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

export default useJUSD;
