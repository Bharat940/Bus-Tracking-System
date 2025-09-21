import { createSlice } from "@reduxjs/toolkit";

const busSlice = createSlice({
  name: "buses",
  initialState: { list: [] },
  reducers: {
    setBuses(state, action) {
      state.list = action.payload;
    },
  },
});

export const { setBuses } = busSlice.actions;
export default busSlice.reducer;
