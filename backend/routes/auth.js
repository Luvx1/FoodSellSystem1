const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

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

module.exports = router;
