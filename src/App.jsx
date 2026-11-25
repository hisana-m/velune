
import { Routes, Route, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/Admin/AdminProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import ToastProvider from "./components/Toast/ToastProvider";

import Home from "./pages/home/Home";
import Collections from "./pages/collections/Collections";
import About from "./pages/about/About";
import Contact from "./pages/contact/Contact";
import Cart from "./pages/cart/Cart";
import Checkout from "./pages/checkout/Checkout";
import Wishlist from "./pages/wishlist/Wishlist";
import ProductDetails from "./pages/productDetails/ProductDetails";
import Login from "./pages/login/Login";
import Orders from "./pages/orders/Orders";
import OrderDetails from "./pages/orderDetails/OrderDetails";

import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AdminProducts from "./pages/admin/products/AdminProducts";
import AdminUsers from "./pages/admin/users/AdminUsers";
import AdminOrders from "./pages/admin/orders/AdminOrders";

export default function App() {
  const location = useLocation();

  const user = useSelector((state) => state.auth.user);

  const isAdminRoute = location.pathname.startsWith("/admin");
  const showCustomerLayout =
    !isAdminRoute && user?.role !== "admin";

  return (
    <div className="min-h-screen w-full">
      <ToastProvider />

      {showCustomerLayout && <Navbar />}

      <Routes>
        {/* Customer Routes */}
        <Route path="/" element={<Home />} />

        <Route path="/collections" element={<Collections />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        <Route path="/login" element={<Login />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wishlist"
          element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
          }
        />

        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="products"
            element={<AdminProducts />}
          />

          <Route
            path="users"
            element={<AdminUsers />}
          />

          <Route
            path="orders"
            element={<AdminOrders />}
          />
        </Route>
      </Routes>

      {showCustomerLayout && <Footer />}
    </div>
  );
}
