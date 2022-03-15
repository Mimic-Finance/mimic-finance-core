import { createSlice } from "@reduxjs/toolkit";

import DaiTokenContract from "../abis/DaiToken.json";
import DappTokenContract from "../abis/DappToken.json";
import TokenFarmContract from "../abis/TokenFarm.json";
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

  DAITokenContract: {},
  DAPPTokenContract: {},
  FarmTokenContract: {},
  FaucetContract: {},
};

export const loadContractData = async () => {
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

      DAITokenContract: {},
      DAPPTokenContract: {},
      FarmTokenContract: {},
      FaucetContract: {},
    };

    const accounts = await web3.eth.getAccounts();
    let currentAccount = accounts[0];
    response.account = accounts[0];
    const networkId = await web3.eth.net.getId();

    // Load DaiToken
    const daiTokenData = DaiTokenContract.networks[networkId];
    if (daiTokenData) {
      const daiToken = new web3.eth.Contract(
        DaiTokenContract.abi,
        daiTokenData.address
      );

      response.daiToken = daiToken;
      response.DAITokenContract = daiToken; //new
      let daiTokenBalance = await daiToken.methods
        .balanceOf(currentAccount)
        .call();
      response.daiTokenBalance = daiTokenBalance.toString();
    } else {
      window.alert("DaiToken contract not deployed to detected network.");
    }

    // Load DappToken
    const dappTokenData = DappTokenContract.networks[networkId];
    if (dappTokenData) {
      const dappToken = new web3.eth.Contract(
        DappTokenContract.abi,
        dappTokenData.address
      );
      response.dappToken = dappToken;
      response.DAPPTokenContract = dappToken; //new
      let dappTokenBalance = await dappToken.methods
        .balanceOf(currentAccount)
        .call();
      response.dappTokenBalance = dappTokenBalance.toString();
    } else {
      window.alert("DappToken contract not deployed to detected network.");
    }

    // Load TokenFarm
    const tokenFarmData = TokenFarmContract.networks[networkId];
    if (tokenFarmData) {
      const tokenFarm = new web3.eth.Contract(
        TokenFarmContract.abi,
        tokenFarmData.address
      );
      response.farmToken = tokenFarm;
      response.FarmTokenContract = tokenFarm; //new
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
      response.FaucetContract = faucetContract; //new
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

const contractSlice = createSlice({
  name: "contractsSlice",
  initialState,
  reducers: {
    setContractData(state, action) {
      state.account = action.payload.account;
      state.daiToken = action.payload.daiToken;
      state.daiTokenBalance = action.payload.daiTokenBalance;
      state.dAppToken = action.payload.dappToken;
      state.dAppTokenBalance = action.payload.dappTokenBalance;
      state.farmToken = action.payload.farmToken;
      state.stakingBalance = action.payload.stakingBalance;
      state.faucetContract = action.payload.faucetContract;

      state.DAITokenContract = action.payload.DAITokenContract;
      state.DAPPTokenContract = action.payload.DAPPTokenContract;
      state.FarmTokenContract = action.payload.FarmTokenContract;
      state.FaucetContract = action.payload.FaucetContract;
    },
  },
});

export const { setContractData: setContractData } = contractSlice.actions;
export default contractSlice.reducer;
