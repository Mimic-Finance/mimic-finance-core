import { combineReducers } from "redux";

import contractsReducer from "../slices/contracts";
import accountReducer from "../slices/account";

const rootReducer = combineReducers({
  account: accountReducer,
  contracts: contractsReducer,
});

export default rootReducer;
