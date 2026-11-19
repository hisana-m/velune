
import { createSlice } from "@reduxjs/toolkit";

function getSavedUser() {
  try {
    const savedUser = localStorage.getItem("velune-user");

    if (!savedUser) return null;

    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem("velune-user");
    return null;
  }
}

const savedUser = getSavedUser();

const initialState = {
  user: savedUser,
  isLoggedIn: Boolean(savedUser),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
      state.isLoggedIn = true;

      localStorage.setItem(
        "velune-user",
        JSON.stringify(action.payload)
      );
    },

    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;

      localStorage.removeItem("velune-user");
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
