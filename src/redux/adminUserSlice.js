
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_URL = "http://localhost:3000";

export const fetchAdminUsers = createAsyncThunk(
  "adminUsers/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_URL}/users`);

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const toggleUserBlock = createAsyncThunk(
  "adminUsers/toggleBlock",
  async (user, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `${API_URL}/users/${user.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isBlocked: !user.isBlocked,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user");
      }

      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminUserSlice = createSlice({
  name: "adminUsers",

  initialState: {
    users: [],
    loading: false,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAdminUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleUserBlock.fulfilled, (state, action) => {
        const index = state.users.findIndex(
          (user) => String(user.id) === String(action.payload.id)
        );

        if (index !== -1) {
          state.users[index] = action.payload;
        }
      });
  },
});

export default adminUserSlice.reducer;
