import { createSlice } from "@reduxjs/toolkit";

import JUSD_ABI from "../abis/JUSD.json";
import Mimic_ABI from "../abis/Mimic.json";
import Farming_ABI from "../abis/Farming.json";
import Faucet_ABI from "../abis/Faucet.json";
import Swap_ABI from "../abis/Swap.json";
import Dex_ABI from "../abis/Dex.json";
import USDC_ABI from "../abis/ERC20Mock.json";

import config from "../config.json";

const initialState = {
  //Smart Contract loading
  loading: true,

  //Balances
  ETHBalance: 0,
  USDCBalance: 0,

  // Contracts
  JUSDContract: {},
  MimicContract: {},
  FarmingContract: {},
  FaucetContract: {},
  SwapContract: {},
  DexContract: {},
  USDCContract: {},

  // JUSD Pool
  JUSDBalance: 0,
  MimicBalance: 0,
  JUSDStakingBalance: 0,
};

export const loadContractData = async (account) => {
  try {
    const web3 = window.web3;

    let response = {
      //Balances
      ETHBalance: 0,
      USDCBalance: 0,

      //Contract
      JUSDContract: {},
      MimicContract: {},
      FarmingContract: {},
      FaucetContract: {},
      SwapContract: {},
      DexContract: {},
      USDCContract: {},

      // JUSD Pool
      JUSDBalance: 0,
      MimicBalance: 0,
      JUSDStakingBalance: 0,
    };

    // const accounts = await web3.eth.getAccounts();
    let currentAccount = account;
    const networkId = await web3.eth.net.getId();

    /**
     *
     * GET ETH Balance
     *
     */
    response.ETHBalance = await web3.eth.getBalance(currentAccount);

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

    /**
     * Load Swap Contract
     * Swap.json
     */
    const swapContractData = Swap_ABI.networks[networkId];
    if (swapContractData) {
      const swapContract = new web3.eth.Contract(
        Swap_ABI.abi,
        swapContractData.address
      );
      response.SwapContract = swapContract;
    } else {
      window.alert("Swap Contract not deployed");
    }

    /**
     * Load Dex Contract
     * Dex.json
     */
    const dexContractData = Dex_ABI.networks[networkId];
    if (dexContractData) {
      const dexContract = new web3.eth.Contract(
        Dex_ABI.abi,
        dexContractData.address
      );
      response.DexContract = dexContract;
    } else {
      window.alert("Dex Contract not deployed");
    }

    /**
     * Load USDC Contract
     * Dex.json
     */

    if (USDC_ABI) {
      const usdcContract = new web3.eth.Contract(
        USDC_ABI.abi,
        config.USDC_TESTNET
      );
      response.USDCContract = usdcContract;
      let USDCBalance = await usdcContract.methods
        .balanceOf(currentAccount)
        .call();
      console.log(USDCBalance);
      response.USDCBalance = USDCBalance / Math.pow(10, 6);
    } else {
      window.alert("USCD (Mock) Contract not deployed");
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
      //Balances
      state.ETHBalance = action.payload.ETHBalance;
      state.USDCBalance = action.payload.USDCBalance;

      //Token Balance
      state.JUSDBalance = action.payload.JUSDBalance;
      state.MimicBalance = action.payload.MimicBalance;
      state.JUSDStakingBalance = action.payload.JUSDStakingBalance;

      //Contracts
      state.JUSDContract = action.payload.JUSDContract;
      state.MimicContract = action.payload.MimicContract;
      state.FarmingContract = action.payload.FarmingContract;
      state.FaucetContract = action.payload.FaucetContract;
      state.SwapContract = action.payload.SwapContract;
      state.DexContract = action.payload.DexContract;
      state.USDCContract = action.payload.USDCContract;
    },
  },
});

export const { setContractData: setContractData } = contractSlice.actions;
export default contractSlice.reducer;
