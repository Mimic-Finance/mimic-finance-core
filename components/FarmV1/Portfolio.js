import { Box, Text, Grid, GridItem } from "@chakra-ui/react";
import Web3 from "web3";

import DaiToken from "../../abis/DaiToken.json";
import DappToken from "../../abis/DappToken.json";
import TokenFarm from "../../abis/TokenFarm.json";
import { useState, useEffect } from "react";

const Portfolio = () => {
  const [account, setAccount] = useState("0x0");
  //DAI Token
  const [daiToken, setDaiToken] = useState({});
  const [daiTokenBalance, setDaiTokenBalance] = useState(0);
  //DApp Token
  const [dAppToken, setdAppToken] = useState({});
  const [dAppTokenBalance, setdAppTokenBalance] = useState(0);
  //Farm Token
  const [farmToken, setFarmToken] = useState({});
  const [stakingBalance, setStakingBalance] = useState(0);
  //loading State
  const [loading, setLoading] = useState(true);

  //Stake Value
  const [stakeValue, setStakeValue] = useState(0);

  const loadBlockchainData = async () => {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    let currentAccount = accounts[0];
    const networkId = await web3.eth.net.getId();

    // Load DaiToken
    const daiTokenData = DaiToken.networks[networkId];
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(
        DaiToken.abi,
        daiTokenData.address
      );

      setDaiToken(daiToken);
      let daiTokenBalance = await daiToken.methods
        .balanceOf(currentAccount)
        .call();
      setDaiTokenBalance(daiTokenBalance.toString());
    } else {
      window.alert("DaiToken contract not deployed to detected network.");
    }

    // Load DappToken
    const dappTokenData = DappToken.networks[networkId];
    if (dappTokenData) {
      const dappToken = new web3.eth.Contract(
        DappToken.abi,
        dappTokenData.address
      );
      setdAppToken(dappToken);
      let dappTokenBalance = await dappToken.methods
        .balanceOf(currentAccount)
        .call();
      setdAppTokenBalance(dappTokenBalance.toString());
    } else {
      window.alert("DappToken contract not deployed to detected network.");
    }

    // Load TokenFarm
    const tokenFarmData = TokenFarm.networks[networkId];
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(
        TokenFarm.abi,
        tokenFarmData.address
      );
      setFarmToken(tokenFarm);
      let stakingBalance = await tokenFarm.methods
        .stakingBalance(currentAccount)
        .call();
      setStakingBalance(stakingBalance.toString());
    } else {
      window.alert("TokenFarm contract not deployed to detected network.");
    }

    setLoading(false);
  };

  // Load web3 function
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
      await loadBlockchainData();
      console.log(daiToken);
      console.log(farmToken);
    };
    Loader();
  }, [account]);

  return (
    <Box mt={5}>
      <Text fontSize="xl">
        <b>Portfolio</b>
      </Text>
      <Box mt={2} p={4} className="portfolio-box">
        <Grid templateColumns="repeat(9, 1fr)" gap={6}>
          <GridItem colSpan={3}>
            <Text fontSize="l">Balance</Text>
            <Text mt={2} fontSize="m">
              $ {Web3.utils.fromWei(stakingBalance.toString())}
            </Text>
          </GridItem>
          <GridItem colSpan={3}>
            <Text fontSize="l">Reward</Text>
            <Text mt={2} fontSize="m">
              $ {Web3.utils.fromWei(dAppTokenBalance.toString())}
            </Text>
          </GridItem>
          <GridItem colSpan={3}>
            <Text fontSize="l">Totals</Text>
            <Text mt={2} fontSize="m">
              ${" "}
              {parseInt(Web3.utils.fromWei(dAppTokenBalance.toString())) +
                parseInt(Web3.utils.fromWei(stakingBalance.toString()))}
            </Text>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
};

export default Portfolio;
