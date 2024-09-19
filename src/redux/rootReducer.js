import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice";

const rootReducer = combineReducers({
  user: authReducer,
});

export default rootReducer;
