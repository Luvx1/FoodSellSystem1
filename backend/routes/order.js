const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const {
    createOrder,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    orderConfirm,
    getUserOrders,
    getOrderDetails,
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

// Admin middleware - kiểm tra quyền admin
const admin = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Không có token, quyền truy cập bị từ chối' });
    }

    try {
        // Lấy token từ header
        const token = authHeader.split(' ')[1];

        // Decode JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log('Decoded token:', decoded); // Log để debug

        // Kiểm tra role admin
        if (decoded && decoded.role === 'admin') {
            // Lưu thông tin user để sử dụng trong các handler tiếp theo
            req.user = decoded;
            next();
        } else {
            return res.status(403).json({
                message: 'Truy cập bị từ chối, yêu cầu quyền quản trị viên',
            });
        }
    } catch (err) {
        console.error('JWT verification error:', err);
        return res.status(401).json({ message: 'Token không hợp lệ hoặc hết hạn' });
    }
};
// Lấy tất cả đơn hàng (chỉ admin)
router.get('/', protect, admin, getAllOrders);
// Tạo đơn hàng mới
router.post('/', protect, createOrder);

// Cập nhật trạng thái đơn hàng (chỉ admin)
router.patch('/:id/status', protect, admin, updateOrderStatus);

// Hủy đơn hàng (cho người dùng)
router.patch('/:id/cancel', protect, cancelOrder);

// Xác nhận đơn hàng
router.patch('/:id/confirm', protect, orderConfirm);
// User order history
router.get('/user/history', protect, getUserOrders);

// Get order details
router.get('/:id', protect, getOrderDetails);

module.exports = router;
