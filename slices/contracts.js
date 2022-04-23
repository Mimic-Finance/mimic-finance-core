import { createSlice } from "@reduxjs/toolkit";

import JUSD_ABI from "../abis/JUSD.json";
import cJUSD_ABI from "../abis/cJUSD.json";
import Mimic_ABI from "../abis/Mimic.json";
import Farming_ABI from "../abis/Farming.json";
import Faucet_ABI from "../abis/Faucet.json";
import Swap_ABI from "../abis/Swap.json";
import Dex_ABI from "../abis/Dex.json";

import Auto_ABI from "../abis/Auto.json";
import ERC20Utils_ABI from "../abis/ERC20Utils.json";

//Import Stable Coin ABI
import TokenAddress from "../constants/TokenAddress.json";
import DAI_ABI from "../abis/DAI.json";
import USDT_ABI from "../abis/USDT.json";
import BUSD_ABI from "../abis/BUSD.json";
import USDC_ABI from "../abis/ERC20Mock.json";

import config from "../config.json";

const initialState = {
  //Smart Contract loading
  loading: true,

  //Balances
  ETHBalance: 0,
  USDCBalance: 0,

  //Reward
  RewardBalance: 0,

  // Contracts
  cJUSDContract: {},
  AutoContract: {},
  JUSDContract: {},
  MimicContract: {},
  FarmingContract: {},
  FaucetContract: {},
  SwapContract: {},
  DexContract: {},
  ERC20UtilsContract: {},

  //StableCoin Contract
  USDCContract: {},
  BUSDContract: {},
  DAIContract: {},
  USDTContract: {},

  // JUSD Pool
  cJUSDBalance: 0,
  JUSDBalance: 0,
  MimicBalance: 0,
  JUSDStakingBalance: 0,

  // JUSD Auto pool
  StableCoinAutoCompoundStakingBalance: 0,
};

export const loadContractData = async (account) => {
  try {
    const web3 = window.web3;

    let response = {
      //Balances
      ETHBalance: 0,
      USDCBalance: 0,

      //Reward
      RewardBalance: 0,

      //Contract
      cJUSDContract: {},
      AutoContract: {},
      JUSDContract: {},
      MimicContract: {},
      FarmingContract: {},
      FaucetContract: {},
      SwapContract: {},
      DexContract: {},
      ERC20UtilsContract: {},

      //StableCoin Contract
      USDCContract: {},
      BUSDContract: {},
      DAIContract: {},
      USDTContract: {},

      // JUSD Pool
      JUSDBalance: 0,
      MimicBalance: 0,
      JUSDStakingBalance: 0,

      // JUSD Auto pool
      StableCoinAutoCompoundStakingBalance: 0,
    };

    // const accounts = await web3.eth.getAccounts();
    let currentAccount = account;
    const networkId = await web3.eth.net.getId();

    /**
     *
     * GET ETH Balance
     *
     */
    try {
      response.ETHBalance = await web3.eth.getBalance(currentAccount);
    } catch {
      console.log("cann't load ETH Balance");
    }

    /**
     * Load JUSD Contract
     * JUSD.json
     */
    try {
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
    } catch {
      console.log("cann't load JUSD Contract");
    }

    /**
     * Load Mimic Contract (Gov Token)
     * Mimic.json
     */
    try {
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
    } catch {
      console.log("cann't load Mimic Contract");
    }

    /**
     * Load Farming Contract (Gov Token)
     * Farming.json
     */
    try {
      const FarmingData = Farming_ABI.networks[networkId];
      if (FarmingData) {
        const FarmingContract = new web3.eth.Contract(
          Farming_ABI.abi,
          FarmingData.address
        );
        response.FarmingContract = FarmingContract;

        // let JUSDStakingBalance = await FarmingContract.methods
        //   .stakingBalance(currentAccount)
        //   .call();
        // let RewardBalance = await FarmingContract.methods
        //   .checkRewardByAddress(currentAccount)
        //   .call();

        // response.JUSDStakingBalance = JUSDStakingBalance.toString();
        // response.RewardBalance = RewardBalance.toString();
      } else {
        window.alert("Farming contract not deployed to detected network.");
      }
    } catch {
      console.log("cann't load Farming Contract");
    }

    /**
     * Load Faucet Contract (Gov Token)
     * Faucet.json
     */
    try {
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
    } catch {
      console.log("cann't load Faucet Contract");
    }

    /**
     * Load Swap Contract
     * Swap.json
     */
    try {
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
    } catch {
      console.log("cann't load Swap Contract");
    }

    /**
     * Load Dex Contract
     * Dex.json
     */
    try {
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
    } catch {
      console.log("cann't load DEX Contract");
    }

    //======================================  Stable Coin Section  ===========================================
    /**
     * Load USDC Contract
     * USDC.json
     */
    try {
      if (USDC_ABI) {
        const usdcContract = new web3.eth.Contract(
          USDC_ABI.abi,
          TokenAddress.USDC
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
    } catch {
      console.log("cann't load USDC Contract");
    }

    /**
     * Load USDT Contract
     * USDT.json
     */
    try {
      if (USDT_ABI) {
        const usdtContract = new web3.eth.Contract(
          USDT_ABI.abi,
          TokenAddress.USDT
        );
        response.USDTContract = usdtContract;
      } else {
        window.alert("USDT Contract not deployed");
      }
    } catch {
      console.log("cann't load USDT Contract");
    }

    /**
     * Load DAI Contract
     * DAI.json
     */
    try {
      if (DAI_ABI) {
        const daiContract = new web3.eth.Contract(
          DAI_ABI.abi,
          TokenAddress.DAI
        );
        response.DAIContract = daiContract;
      } else {
        window.alert("dai Contract not deployed");
      }
    } catch {
      console.log("cann't load dai Contract");
    }

    /**
     * Load BUSD Contract
     * BUSD.json
     */
    try {
      if (BUSD_ABI) {
        const busdContract = new web3.eth.Contract(
          BUSD_ABI.abi,
          TokenAddress.BUSD
        );
        response.BUSDContract = busdContract;
      } else {
        window.alert("BUSD Contract not deployed");
      }
    } catch {
      console.log("cann't load BUSD Contract");
    }

    //===============================  End Stable Coin Section =====================================

    /**
     * Load AutoCompound Contract
     * Auto.json
     */
    try {
      const autoContractData = Auto_ABI.networks[networkId];
      if (autoContractData) {
        const AutoContract = new web3.eth.Contract(
          Auto_ABI.abi,
          autoContractData.address
        );
        response.AutoContract = AutoContract;
        let StableCoinAutoCompoundStakingBalance = await AutoContract.methods
          .stakingBalance(currentAccount)
          .call();
        response.StableCoinAutoCompoundStakingBalance = StableCoinAutoCompoundStakingBalance.toString();
      } else {
        window.alert("Auto Contract not deployed");
      }
    } catch {
      console.log("cann't load Auto Contract");
    }

    /**
     * Load cJUSD Contract
     * cJUSD.json
     */
    try {
      const cJUSDTokenData = cJUSD_ABI.networks[networkId];
      if (cJUSDTokenData) {
        const cJUSDContract = new web3.eth.Contract(
          cJUSD_ABI.abi,
          cJUSDTokenData.address
        );

        response.cJUSDContract = cJUSDContract;
        // Get cJUSD Balance
        let cJUSDBalance = await cJUSDContract.methods
          .balanceOf(currentAccount)
          .call();
        response.cJUSDBalance = cJUSDBalance.toString();
      } else {
        window.alert("cJUSD contract not deployed to detected network.");
      }
    } catch {
      console.log("cann't load cJUSD Contract");
    }

    /**
     * Load ERC20Utils Contract
     * ERC20Utils.json
     */
    try {
      const ERC20UtilsData = ERC20Utils_ABI.networks[networkId];
      if (ERC20UtilsData) {
        const ERC20UtilsContract = new web3.eth.Contract(
          ERC20Utils_ABI.abi,
          ERC20UtilsData.address
        );

        response.ERC20UtilsContract = ERC20UtilsContract;
      } else {
        window.alert("ERC20Utils contract not deployed to detected network.");
      }
    } catch {
      console.log("cann't load ERC20Utils Contract");
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

      //Reward
      state.RewardBalance = action.payload.RewardBalance;

      //Token Balance
      state.cJUSDBalance = action.payload.cJUSDBalance;
      state.JUSDBalance = action.payload.JUSDBalance;
      state.MimicBalance = action.payload.MimicBalance;
      state.JUSDStakingBalance = action.payload.JUSDStakingBalance;
      state.StableCoinAutoCompoundStakingBalance = action.payload.StableCoinAutoCompoundStakingBalance;

      //Contracts
      state.cJUSDContract = action.payload.cJUSDContract;
      state.AutoContract = action.payload.AutoContract;
      state.JUSDContract = action.payload.JUSDContract;
      state.MimicContract = action.payload.MimicContract;
      state.FarmingContract = action.payload.FarmingContract;
      state.FaucetContract = action.payload.FaucetContract;
      state.SwapContract = action.payload.SwapContract;
      state.DexContract = action.payload.DexContract;
      state.ERC20UtilsContract = action.payload.ERC20UtilsContract;

      //Stable coin Contract
      state.USDCContract = action.payload.USDCContract;
      state.USDTContract = action.payload.USDTContract;
      state.BUSDContract = action.payload.BUSDContract;
      state.DAIContract = action.payload.DAIContract;
    },
  },
});

export const { setContractData: setContractData } = contractSlice.actions;
export default contractSlice.reducer;
