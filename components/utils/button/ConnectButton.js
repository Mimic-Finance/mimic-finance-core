import { Button, Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import Web3 from "web3";

export default function ConnectButton() {
  const [account, setAccount] = useState();
  // Load web3 function
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      const web3 = window.web3;
      const accounts = await web3.eth.getAccounts();
      setAccount(accounts[0]);
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const displayAccount = (acc) => {
    return acc.substring(0, 6) + "..." + acc.substring(38, 42);
  };

  useEffect(() => {
    loadWeb3();
  });

  return account ? (
    <Button display={{ base: "none", md: "flex" }} ml={10}>
      {/* {etherBalance && parseFloat(formatEther(etherBalance)).toFixed(3)} BNB */}
      {displayAccount(account)}
    </Button>
  ) : (
    <Button display={{ base: "none", md: "flex" }} ml={10} onClick={loadWeb3}>
      Connect wallet
    </Button>
  );
}
