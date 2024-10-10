import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: [],
  reducers: {
    addToCart: (state, action) => {
      const itemIndex = state.findIndex(
        (item) => item.id === action.payload.id
      );
      if (itemIndex >= 0) {
        state[itemIndex].quantity += 1;
      } else {
        state.push({ ...action.payload, quantity: 1 });
      }
    },
    increaseQuantity: (state, action) => {
      const itemIndex = state.findIndex((item) => item.id === action.payload);
      if (itemIndex >= 0) {
        state[itemIndex].quantity += 1;
      }
    },
    decreaseQuantity: (state, action) => {
      const itemIndex = state.findIndex((item) => item.id === action.payload);
      if (itemIndex >= 0) {
        state[itemIndex].quantity -= 1;
        if (state[itemIndex].quantity <= 0) {
          state.splice(itemIndex, 1);
        }
      }
    },
    removeFromCart: (state, action) => {
      const itemIndex = state.findIndex((item) => item.id === action.payload);
      if (itemIndex >= 0) {
        state.splice(itemIndex, 1);
      }
    },
    resetCart: (state) => {
      return [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
  resetCart,
} = cartSlice.actions;

export default cartSlice.reducer;
