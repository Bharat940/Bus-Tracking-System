import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import busReducer from "./busSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    buses: busReducer,
  },
});
