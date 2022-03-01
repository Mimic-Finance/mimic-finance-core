import {
  Grid,
  GridItem,
  Select,
  FormControl,
  Input,
  Center,
  Text,
  Button,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import Portfolio from "./PortfolioTest";

import Web3 from "web3";

import DaiToken from "../../abis/DaiToken.json";
import DappToken from "../../abis/DappToken.json";
import TokenFarm from "../../abis/TokenFarm.json";

const Stake = () => {
  const router = useRouter();
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
  const [stakeSuccess, setStakeSuccess] = useState(0);

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

  const stakeTokens = async (amount) => {
    setLoading(true);
    await daiToken.methods
      .approve(farmToken._address, amount)
      .send({ from: account })
      .on("transactionHash", (hash) => {
        farmToken.methods
          .stakeTokens(amount)
          .send({ from: account })
          .on("transactionHash", (hash) => {
            setStakeSuccess(stakeSuccess + 1);
            setLoading(false);
          });
      });
  };

  useEffect(() => {
    const Loader = async () => {
      await loadWeb3();
      await loadBlockchainData();
    };
    Loader();
  }, [account]);

  useEffect(() => {
    const Loader = async () => {
      await loadWeb3();
      await loadBlockchainData();
    };
    Loader();
  }, [stakeSuccess]);

  const setStakeValueMax = () => {
    setStakeValue(Web3.utils.fromWei(daiTokenBalance.toString()));
  };

  const handleChangeStakeValue = (e) => {
    setStakeValue(e.target.value);
  };

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
            <InputGroup size="md">
              <Input
                type="number"
                style={{ borderRadius: "0px 10px 10px 0px" }}
                placeholder="0.00"
                value={stakeValue}
                onChange={handleChangeStakeValue}
              />
              <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={setStakeValueMax}>
                  Max
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </GridItem>
      </Grid>

      <Button
        style={{
          color: "#FFFFFF",
          background: "linear-gradient(90deg ,#576cea 0%, #da65d1 100%)",
        }}
        disabled={stakeValue == 0}
        mt={2}
        mb={5}
        w={"100%"}
        onClick={() => {
          stakeTokens(Web3.utils.toWei(stakeValue.toString()));
        }}
      >
        Stake
      </Button>

      <Portfolio
        balance={Web3.utils.fromWei(stakingBalance.toString())}
        reward={Web3.utils.fromWei(dAppTokenBalance.toString())}
        total={
          parseInt(Web3.utils.fromWei(dAppTokenBalance.toString())) +
          parseInt(Web3.utils.fromWei(stakingBalance.toString()))
        }
      />
    </>
  );
};

export default Stake;
