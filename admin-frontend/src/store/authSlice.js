import { createSlice } from "@reduxjs/toolkit";
import { getCurrentUser } from "../services/auth.service";

const initial = {
  user: getCurrentUser(),
  token: localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState: initial,
  reducers: {
    setAuth(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    clearAuth(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
