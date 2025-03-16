const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên sản phẩm (bắt buộc)
    price: { type: Number, required: true, min: 0 }, // Giá sản phẩm (bắt buộc, >= 0)
    description: { type: String, default: "" }, // Mô tả sản phẩm
    image: { type: String, default: "" }, // Ảnh sản phẩm (URL)
    category: { type: String, required: true }, // Loại sản phẩm
    stock: { type: Number, default: 0, min: 0 }, // Số lượng tồn kho
}, { timestamps: true });

module.exports = mongoose.model("Product", ProductSchema);

