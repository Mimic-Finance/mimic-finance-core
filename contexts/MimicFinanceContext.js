import { createContext, useEffect, useState } from "react";
import { setContractData, loadContractData } from "../slices/contracts";
import { setAccountData, detectAccount } from "../slices/account";
import useAppDispatch from "../hooks/useAppDispatch";
import Loading from "../components/utils/Loading/Loading";
import Web3 from "web3";
import useAppSelector from "../hooks/useAppSelector";

export const MimicFinanceContext = createContext(false);

export const MimicFinanceProvider = ({ children }) => {
  const [accountLoading, setAccountLoading] = useState(true);
  const [contractLoading, setContractLoading] = useState(true);

  const { account } = useAppSelector((state) => state.account);

  const dispatch = useAppDispatch();

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      /**
       * Detect Account [0]
       */
      const accountData = await detectAccount();
      if (accountData) {
        dispatch(setAccountData(accountData));
        setAccountLoading(false);
      }
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  useEffect(() => {
    const Loader = async () => {
      await loadWeb3();
      /**
       * Load Contract Data
       */
      if (account && account !== "0x0") {
        const contractData = await loadContractData(account);
        if (contractData) {
          dispatch(setContractData(contractData));
          setContractLoading(false);
        }
      }
    };
    Loader();
  }, [dispatch, account]);

  if (!accountLoading && !contractLoading) {
    return (
      <MimicFinanceContext.Provider>{children}</MimicFinanceContext.Provider>
    );
  } else {
    return (
      <MimicFinanceContext.Provider>
        <Loading />
      </MimicFinanceContext.Provider>
    );
  }
};
