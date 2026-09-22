import { Routes, Route } from "react-router-dom";

import PublicLayout from "../components/layout/PublicLayout.jsx";
import AdminLayout from "../components/layout/AdminLayout.jsx";
import AdminRoute from "../components/layout/AdminRoute.jsx";

import Home from "../pages/Home.jsx";
import Products from "../pages/Products.jsx";
import ProductDetail from "../pages/ProductDetail.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Cart from "../pages/Cart.jsx";
import Orders from "../pages/Orders.jsx"; // <-- 1. Import Orders here
import AdminDashboard from "../pages/AdminDashboard.jsx";
import AdminProducts from "../pages/AdminProducts.jsx";

export default function AppRouter() {
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/orders" element={<Orders />} /> {/* <-- 2. Inserted here! */}
      </Route>

      {/* ==================== ADMIN ONLY ROUTES ==================== */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        }
      />
      <Route
        path="/admin/products"
        element={
          <AdminRoute>
            <AdminProducts />
          </AdminRoute>
        }
      />
    </Routes>
  );
}