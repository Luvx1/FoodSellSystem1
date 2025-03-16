import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Products from "../pages/Products";

const AdminRoutes = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route index element={<Dashboard />} /> {/* Trang mặc định */}
        <Route path="users" element={<Users />} />
        <Route path="products" element={<Products />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminRoutes; // ✅ Đảm bảo export default
