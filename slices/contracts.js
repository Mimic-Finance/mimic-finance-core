import { createSlice } from "@reduxjs/toolkit";

import JUSD_ABI from "../abis/JUSD.json";
import Mimic_ABI from "../abis/Mimic.json";
import Farming_ABI from "../abis/Farming.json";
import Faucet_ABI from "../abis/Faucet.json";

const initialState = {
  //Smart Contract loading
  loading: true,

  // Contracts
  JUSDContract: {},
  MimicContract: {},
  FarmingContract: {},
  FaucetContract: {},

  // JUSD Pool
  JUSDBalance: 0,
  MimicBalance: 0,
  JUSDStakingBalance: 0,
};

export const loadContractData = async (account) => {
  try {
    const web3 = window.web3;

    let response = {
      JUSDContract: {},
      MimicContract: {},
      FarmingContract: {},
      FaucetContract: {},

      // JUSD Pool
      JUSDBalance: 0,
      MimicBalance: 0,
      JUSDStakingBalance: 0,
    };

    // const accounts = await web3.eth.getAccounts();
    let currentAccount = account;
    const networkId = await web3.eth.net.getId();

    /**
     * Load JUSD Contract
     * JUSD.json
     */
    const JUSDTokenData = JUSD_ABI.networks[networkId];
    if (JUSDTokenData) {
      const JUSDContract = new web3.eth.Contract(
        JUSD_ABI.abi,
        JUSDTokenData.address
      );

      response.JUSDContract = JUSDContract;
      // Get JUSD Balance
      let JUSDBalance = await JUSDContract.methods
        .balanceOf(currentAccount)
        .call();
      response.JUSDBalance = JUSDBalance.toString();
    } else {
      window.alert("JUSD contract not deployed to detected network.");
    }

    /**
     * Load Mimic Contract (Gov Token)
     * Mimic.json
     */
    const MimicTokenData = Mimic_ABI.networks[networkId];
    if (MimicTokenData) {
      const MimicContract = new web3.eth.Contract(
        Mimic_ABI.abi,
        MimicTokenData.address
      );

      response.MimicContract = MimicContract;
      let MimicBalance = await MimicContract.methods
        .balanceOf(currentAccount)
        .call();
      response.MimicBalance = MimicBalance.toString();
    } else {
      window.alert("MimicToken contract not deployed to detected network.");
    }

    /**
     * Load Farming Contract (Gov Token)
     * Farming.json
     */
    const FarmingData = Farming_ABI.networks[networkId];
    if (FarmingData) {
      const FarmingContract = new web3.eth.Contract(
        Farming_ABI.abi,
        FarmingData.address
      );

      response.FarmingContract = FarmingContract;
      let JUSDStakingBalance = await FarmingContract.methods
        .stakingBalance(currentAccount)
        .call();
      response.JUSDStakingBalance = JUSDStakingBalance.toString();
    } else {
      window.alert("Farming contract not deployed to detected network.");
    }

    /**
     * Load Faucet Contract (Gov Token)
     * Faucet.json
     */
    const faucetContractData = Faucet_ABI.networks[networkId];
    if (faucetContractData) {
      const faucetContract = new web3.eth.Contract(
        Faucet_ABI.abi,
        faucetContractData.address
      );
      response.FaucetContract = faucetContract;
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
      state.JUSDBalance = action.payload.JUSDBalance;
      state.MimicBalance = action.payload.MimicBalance;
      state.JUSDStakingBalance = action.payload.JUSDStakingBalance;

      state.JUSDContract = action.payload.JUSDContract;
      state.MimicContract = action.payload.MimicContract;
      state.FarmingContract = action.payload.FarmingContract;
      state.FaucetContract = action.payload.FaucetContract;
    },
  },
});

export const { setContractData: setContractData } = contractSlice.actions;
export default contractSlice.reducer;
