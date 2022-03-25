import useAppSelector from "../hooks/useAppSelector";
import { useEffect, useState } from "react";
import Web3 from "web3";

const Test = () => {
  const { AutoContract, JUSDContract, cJUSDContract } = useAppSelector(
    (state) => state.contracts
  );
  const [cJUSD, setCJUSD] = useState(0);
  const [JUSD, setJUSD] = useState(0);

  const getCJUSDBalance = async () => {
    const balance = await AutoContract.methods.getcJUSDBalance().call();
    setCJUSD(Web3.utils.fromWei(balance.toString()));
  };

  const getJUSDBalance = async () => {
    const balance = await AutoContract.methods.getJUSDBalance().call();
    setJUSD(Web3.utils.fromWei(balance.toString()));
  };

  useEffect(() => {
    const Loader = async () => {
      await getCJUSDBalance();
      await getJUSDBalance();
    };
    Loader();
  });

  return (
    <>
      <h1>Blance of Auto-compound Contract</h1>
      <p>CJUSD = {cJUSD}</p>
      <p>JUSD = {JUSD}</p>
    </>
  );
};

export default Test;
