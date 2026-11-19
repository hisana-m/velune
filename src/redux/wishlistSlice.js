
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { logout } from "./authSlice";

import {
  getUserWishlist,
  toggleWishlistItem,
  deleteWishlistItem,
  emptyUserWishlist,
} from "../data/cartWishlist";

function getUserId(getState) {
  return getState().auth.user?.id;
}

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetchWishlist",
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState);

      if (!userId) return [];

      return await getUserWishlist(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleWishlist = createAsyncThunk(
  "wishlist/toggleWishlist",
  async (product, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState);

      if (!userId) {
        return rejectWithValue("Please log in first.");
      }

      return await toggleWishlistItem(userId, product);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlist/removeFromWishlist",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState);

      if (!userId) {
        return rejectWithValue("Please log in first.");
      }

      return await deleteWishlistItem(userId, productId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const clearWishlist = createAsyncThunk(
  "wishlist/clearWishlist",
  async (_, { getState, rejectWithValue }) => {
    try {
      const userId = getUserId(getState);

      if (!userId) return [];

      return await emptyUserWishlist(userId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      .addCase(toggleWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
        state.error = null;
      })
      .addCase(toggleWishlist.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      .addCase(clearWishlist.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(clearWishlist.rejected, (state, action) => {
        state.error = action.payload || action.error.message;
      })

      // Clear previous user's wishlist from Redux on logout.
      .addCase(logout, (state) => {
        state.items = [];
        state.loading = false;
        state.error = null;
      });
  },
});

export default wishlistSlice.reducer;
