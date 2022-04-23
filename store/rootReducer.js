import { combineReducers } from "redux";

import accountReducer from "../slices/account";

const rootReducer = combineReducers({
  account: accountReducer,
});

export default rootReducer;
