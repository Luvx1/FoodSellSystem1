import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import AdminProducts from "../pages/AdminProducts";
import Orders from "../pages/Order";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<Orders />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
