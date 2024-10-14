import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    supplierId: null,
    // other user properties can go here
  },
  role: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = { supplierId: null }; // Reset supplierId on logout
      state.role = null;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setUser, logout, setRole } = userSlice.actions;
export default userSlice.reducer;
