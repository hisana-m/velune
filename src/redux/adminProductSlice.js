
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3000";

// Fetch all products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/products`);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add product
export const addAdminProduct = createAsyncThunk(
  "adminProducts/add",
  async (product, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update product
export const updateAdminProduct = createAsyncThunk(
  "adminProducts/update",
  async (product, { rejectWithValue }) => {
    try {
      const { id, ...changes } = product;

      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });

      if (!response.ok) {
        throw new Error("Failed to update product");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete product
export const deleteAdminProduct = createAsyncThunk(
  "adminProducts/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminProductSlice = createSlice({
  name: "adminProducts",

  initialState: {
    products: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })

      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addAdminProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })

      .addCase(updateAdminProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (product) =>
            String(product.id) === String(action.payload.id)
        );

        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })

      .addCase(deleteAdminProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (product) =>
            String(product.id) !== String(action.payload)
        );
      });
  },
});

export default adminProductSlice.reducer;
