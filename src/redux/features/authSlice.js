import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  role: null,
};

export const authSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload; // Ensure this contains supplierId
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
    },
    author: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { login, logout, author } = authSlice.actions;
export default authSlice.reducer;
