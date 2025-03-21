const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// ...existing code...

const authMiddleware = (req, res, next) => {
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

// ...rest of your code remains the same

// API: Đăng ký user mới
router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Tên không được để trống'),
        body('email').isEmail().withMessage('Email không hợp lệ'),
        body('password').isLength({ min: 6 }).withMessage('Mật khẩu ít nhất 6 ký tự'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        try {
            // Kiểm tra email đã tồn tại chưa
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ message: 'Email đã tồn tại!' });
            }

            // Mã hóa mật khẩu
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Tạo user mới
            user = new User({ name, email, password: hashedPassword });
            await user.save();

            // Tạo token JWT
            const payload = { userId: user.id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(201).json({ message: 'Đăng ký thành công!', token });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Lỗi Server');
        }
    }
);

// API: Login user
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email không hợp lệ'),
        body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            // Kiểm tra email có tồn tại không
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Email không tồn tại!' });
            }

            // Kiểm tra mật khẩu
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Mật khẩu không chính xác!' });
            }

            // Tạo token JWT
            const payload = { userId: user.id };
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ message: 'Đăng nhập thành công!', token });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Lỗi Server');
        }
    }
);

// API: Thay đổi mật khẩu người dùng
router.put(
    '/change-password',
    authMiddleware,
    [
        body('currentPassword').notEmpty().withMessage('Mật khẩu hiện tại không được để trống'),
        body('newPassword').isLength({ min: 6 }).withMessage('Mật khẩu mới ít nhất 6 ký tự'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { currentPassword, newPassword } = req.body;
        const userId = req.user.userId;

        try {
            // Tìm user theo ID từ token
            let user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Không tìm thấy người dùng' });
            }

            // Xác thực mật khẩu hiện tại
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Mật khẩu hiện tại không chính xác' });
            }

            // Kiểm tra nếu mật khẩu mới giống mật khẩu cũ
            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            if (isSamePassword) {
                return res.status(400).json({ message: 'Mật khẩu mới phải khác mật khẩu cũ' });
            }

            // Mã hóa mật khẩu mới
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);

            // Lưu thay đổi
            await user.save();

            res.json({ message: 'Thay đổi mật khẩu thành công' });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Lỗi Server');
        }
    }
);

module.exports = router;
