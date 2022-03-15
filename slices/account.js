import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: true,
  account: "0x0",
};

export const detectAccount = async () => {
  try {
    const web3 = window.web3;

    let response = {
      account: "0x0",
    };

    const accounts = await web3.eth.getAccounts();
    response.account = accounts[0];

    return response;
  } catch {
    console.log("Cannot detection accounts data");
    return { status: false };
  }
  return Promise.reject(new Error("Error detection accounts data"));
};

const accountSlice = createSlice({
  name: "accountSlice",
  initialState,
  reducers: {
    setAccountData(state, action) {
      state.account = action.payload.account;
    },
  },
});

export const { setAccountData: setAccountData } = accountSlice.actions;
export default accountSlice.reducer;
