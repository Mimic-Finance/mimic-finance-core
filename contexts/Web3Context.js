import { createContext, useState, useCallback, useEffect } from "react";
import { setBlockchainData, loadBlockchainData } from "../slices/auth";
import useAppDispatch from "../hooks/useAppDispatch";
import Web3 from "web3";

export const Web3Context = createContext(false);

export const Web3Provider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const dispatch = useAppDispatch();

  const loadWeb3 = async () => {
    console.log("load");
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
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
      const blockchainData = await loadBlockchainData();
      dispatch(setBlockchainData(blockchainData));
    };
    Loader();
  }, [dispatch]);

  return (
    <Web3Context.Provider value={authenticated}>
      {children}
    </Web3Context.Provider>
  );
};
