import { logout } from "./authSlice";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getUserCart,
  addCartItem,
  changeCartQuantity,
  deleteCartItem,
  emptyUserCart,
} from "../data/cartWishlist";

function getUserId(getState) {
  return getState().auth.user?.id;
}

export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState);

      if (!userId) return [];

      return await getUserCart(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (payload, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState);

      if (!userId) {
        return rejectWithValue("Please log in first.");
      }

      // Supports both addToCart(product) and
      // addToCart({ product, quantity })
      const product = payload.product || payload;
      const quantity = Number(payload.quantity) || 1;

      return await addCartItem(userId, product, quantity);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const increaseQuantity = createAsyncThunk(
  "cart/increaseQuantity",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState);

      if (!userId) {
        return rejectWithValue("Please log in first.");
      }

      return await changeCartQuantity(userId, productId, 1);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  "cart/decreaseQuantity",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState);

      if (!userId) {
        return rejectWithValue("Please log in first.");
      }

      return await changeCartQuantity(userId, productId, -1);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState);

      if (!userId) {
        return rejectWithValue("Please log in first.");
      }

      return await deleteCartItem(userId, productId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState);

      if (!userId) return [];

      return await emptyUserCart(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(increaseQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
      })
      .addCase(increaseQuantity.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(decreaseQuantity.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
      })
      .addCase(decreaseQuantity.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Clear previous user's cart from Redux on logout.
      .addCase(logout, (state) => {
        state.items = [];
        state.loading = false;
        state.error = null;
      });
  },
});

export default cartSlice.reducer;
