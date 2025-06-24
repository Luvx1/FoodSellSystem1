// routes/product.js
const express = require('express');

const {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    uploadProductImages,
    deleteProductImage,
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

// Upload images for a specific product (max 5 images)
router.post('/:id/images', uploadProductImages);

// Delete an image from a product
router.delete('/:id/images', deleteProductImage);

module.exports = router;
