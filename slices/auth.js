import { createSlice } from "@reduxjs/toolkit";

import DaiToken from "../abis/DaiToken.json";
import DappToken from "../abis/DappToken.json";
import TokenFarm from "../abis/TokenFarm.json";
import FaucetContract from "../abis/Faucet.json";

const initialState = {
  loading: true,
  account: "0x0",
  daiToken: {},
  daiTokenBalance: 0,
  dAppToken: {},
  dAppTokenBalance: 0,
  farmToken: {},
  stakingBalance: 0,
  faucetContract: {},
};

export const loadBlockchainData = async () => {
  try {
    const web3 = window.web3;

    let response = {
      account: "0x0",
      daiToken: {},
      daiTokenBalance: 0,
      dappToken: {},
      dAppTokenBalance: 0,
      farmToken: {},
      stakingBalance: 0,
      faucetContract: {},
    };

    const accounts = await web3.eth.getAccounts();
    let currentAccount = accounts[0];
    response.account = accounts[0];
    const networkId = await web3.eth.net.getId();

    // Load DaiToken
    const daiTokenData = DaiToken.networks[networkId];
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(
        DaiToken.abi,
        daiTokenData.address
      );

      response.daiToken = daiToken;
      let daiTokenBalance = await daiToken.methods
        .balanceOf(currentAccount)
        .call();
      response.daiTokenBalance = daiTokenBalance.toString();
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
      response.dappToken = dappToken;
      let dappTokenBalance = await dappToken.methods
        .balanceOf(currentAccount)
        .call();
      response.dappTokenBalance = dappTokenBalance.toString();
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
      response.farmToken = tokenFarm;
      let stakingBalance = await tokenFarm.methods
        .stakingBalance(currentAccount)
        .call();
      response.stakingBalance = stakingBalance.toString();
    } else {
      window.alert("TokenFarm contract not deployed to detected network.");
    }

    // Load Faucet Contract
    const faucetContractData = FaucetContract.networks[networkId];
    if (faucetContractData) {
      const faucetContract = new web3.eth.Contract(
        FaucetContract.abi,
        faucetContractData.address
      );
      response.faucetContract = faucetContract;
    } else {
      window.alert("Faucet Contract not deployed to detected network.");
    }

    return response;
  } catch {
    console.log("Cannot Load Blockchain Data");
    return { status: false };
  }
  return Promise.reject(new Error("Error Load Blockchain Data"));
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    setBlockchainData(state, action) {
      state.account = action.payload.account;
      state.daiToken = action.payload.daiToken;
      state.daiTokenBalance = action.payload.daiTokenBalance;
      state.dAppToken = action.payload.dappToken;
      state.dAppTokenBalance = action.payload.dappTokenBalance;
      state.farmToken = action.payload.farmToken;
      state.stakingBalance = action.payload.stakingBalance;
      state.faucetContract = action.payload.faucetContract;
    },
  },
});

export const { setBlockchainData: setBlockchainData } = authSlice.actions;
export default authSlice.reducer;
