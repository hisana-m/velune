
import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import wishlistReducer from "./wishlistSlice";

import adminProductReducer from "./adminProductSlice";
import adminUserReducer from "./adminUserSlice";
import adminOrderReducer from "./adminOrderSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,

    adminProducts: adminProductReducer,
    adminUsers: adminUserReducer,
    adminOrders: adminOrderReducer,
  },
});

export default store;
