import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../Features/auth/authSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  }
});