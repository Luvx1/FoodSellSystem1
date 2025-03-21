// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        images: [{ type: String }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
