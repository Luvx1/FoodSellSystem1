const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUser,
    updateOrder,
    updateOrderStatus,
    cancelOrder,
    deleteOrder,
} = require('../controllers/order');

// Middleware bảo vệ route - xác thực JWT token
const protect = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Không có token, quyền truy cập bị từ chối' });
    }

    try {
        // Lấy token từ header (bỏ phần 'Bearer ' ở đầu)
        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

// Middleware xác thực quyền admin
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Bạn không có quyền truy cập chức năng này' });
    }
};

// Tạo đơn hàng mới
router.post('/', protect, createOrder);

// Lấy tất cả đơn hàng (chỉ admin)
router.get('/', protect, admin, getAllOrders);

// Lấy đơn hàng theo user ID
router.get('/user/:userId', protect, getOrdersByUser);

// Lấy đơn hàng theo ID
router.get('/:id', protect, getOrderById);

// Cập nhật đơn hàng
router.put('/:id', protect, updateOrder);

// Cập nhật trạng thái đơn hàng
router.patch('/:id/status', protect, admin, updateOrderStatus);

// Hủy đơn hàng
router.patch('/:id/cancel', protect, cancelOrder);

// Xóa đơn hàng (chỉ admin)
router.delete('/:id', protect, admin, deleteOrder);

module.exports = router;
