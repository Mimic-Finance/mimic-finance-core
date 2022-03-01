import {
  Grid,
  GridItem,
  Select,
  FormControl,
  Input,
  Center,
  Text,
  Button,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

import Web3 from "web3";

import DaiToken from "../../abis/DaiToken.json";
import DappToken from "../../abis/DappToken.json";
import TokenFarm from "../../abis/TokenFarm.json";

const Stake = () => {
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

  const loadBlockchainData = async () => {
    const web3 = window.web3;

    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);

    //To do fix type later
    const networkId = await web3.eth.net.getId();
    // const networkId = "*";

    // Load DaiToken
    const daiTokenData = DaiToken.networks[5777];
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(
        DaiToken.abi,
        daiTokenData.address
      );
      setDaiToken({ daiToken });
      let daiTokenBalance = await daiToken.methods.balanceOf(account).call();
      setDaiTokenBalance(daiTokenBalance.toString());
    } else {
      window.alert("DaiToken contract not deployed to detected network.");
    }

    // Load DappToken
    const dappTokenData = DappToken.networks[5777];
    if (dappTokenData) {
      const dappToken = new web3.eth.Contract(
        DappToken.abi,
        dappTokenData.address
      );
      setdAppToken({ dappToken });
      let dappTokenBalance = await dappToken.methods.balanceOf(account).call();
      setdAppTokenBalance(dappTokenBalance.toString());
    } else {
      window.alert("DappToken contract not deployed to detected network.");
    }

    // Load TokenFarm
    const tokenFarmData = TokenFarm.networks[5777];
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(
        TokenFarm.abi,
        tokenFarmData.address
      );
      setFarmToken({ tokenFarm });
      let stakingBalance = await tokenFarm.methods
        .stakingBalance(account)
        .call();
      setStakingBalance(stakingBalance.toString());
    } else {
      window.alert("TokenFarm contract not deployed to detected network.");
    }

    setLoading(false);
  };

  // Load web3 function
  const loadWeb3 = async () => {
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

  const stakeTokens = (amount) => {
    setLoading(true);
    daiToken.methods
      .approve(farmToken._address, amount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        farmToken.methods
          .stakeTokens(amount)
          .send({ from: account })
          .on("transactionHash", (hash) => {
            setLoading(false);
          });
      });
  };

  const unstakeTokens = (amount) => {
    setLoading(true);
    farmToken.methods
      .unstakeTokens()
      .send({ from: account })
      .on("transactionHash", (hash) => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadWeb3();
    console.log(account);
    // if (account != "0x0") {

    //   loadBlockchainData();
    // }
  }, [account]);

  return (
    <>
      <Grid templateColumns="repeat(10, 1fr)" gap={0}>
        <GridItem colSpan={3}>
          <Select style={{ borderRadius: "10px 0px 0px 10px" }}>
            <option>mDAI</option>
          </Select>
        </GridItem>
        <GridItem colSpan={7}>
          <FormControl id="email">
            <Input
              type="number"
              style={{ borderRadius: "0px 10px 10px 0px" }}
              placeholder="0.00"
            />
          </FormControl>
        </GridItem>
      </Grid>

      <Button
        style={{
          color: "#FFFFFF",
          background: "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
        }}
        disabled={loading}
        mt={2}
        mb={5}
        w={"100%"}
      >
        Stake
      </Button>
    </>
  );
};

export default Stake;
