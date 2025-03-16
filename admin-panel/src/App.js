import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminRoutes from "./routes/adminRoutes"; // ✅ Import mặc định
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Điều hướng mặc định đến /admin */}
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Routes>
    </Router>
  );
}

export default App;
