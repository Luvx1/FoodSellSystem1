const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Import Routes
const productRoutes = require("./routes/productRoutes");

app.use("/api/products", productRoutes);

module.exports = app;
