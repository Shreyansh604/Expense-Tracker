import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import transactionReducer from "../features/transaction/transactionSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionReducer,
  }
});