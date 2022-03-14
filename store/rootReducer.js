import { combineReducers } from "redux";

import contractsReducer from "../slices/contracts";

const rootReducer = combineReducers({
  contracts: contractsReducer,
});

export default rootReducer;
