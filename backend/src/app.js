const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// Kết nối cơ sở dữ liệu
connectDB();

// Middleware
app.use(express.json()); // Middleware để đọc JSON
app.use(express.urlencoded({ extended: true })); // Middleware để xử lý form data
app.use(cors()); // Cho phép CORS

// Routes
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);

// Middleware kiểm tra route không tồn tại (404)
app.use((req, res, next) => {
    res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

// Middleware xử lý lỗi toàn cục
app.use(errorHandler);

module.exports = app;