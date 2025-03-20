// routes/product.js
const express = require('express');
const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} = require('../controllers/product');

const router = express.Router();

// API: Tạo sản phẩm mới
router.post('/', createProduct);

// API: Lấy tất cả sản phẩm
router.get('/', getAllProducts);

// API: Lấy sản phẩm theo ID
router.get('/:id', getProductById);

// API: Cập nhật sản phẩm theo ID
router.put('/:id', updateProduct);

// API: Xóa sản phẩm theo ID
router.delete('/:id', deleteProduct);

module.exports = router;
