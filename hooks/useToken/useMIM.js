import useContract from "../useContract";
import MIMIC_ABI from "../../abis/Mimic.json";

import useAppSelector from "hooks/useAppSelector";

import { useCallback, useEffect, useState } from "react";

const useMIMIC = () => {
  const { account } = useAppSelector((state) => state.account);

  const abi = MIMIC_ABI.abi;
  const contract = useContract(abi, MIMIC_ABI.networks[1].address);
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

export default useMIMIC;
