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
        console.log('[AUTH] Không có Authorization header hoặc header không đúng định dạng:', authHeader);
        return res.status(401).json({ message: 'Không có token, quyền truy cập bị từ chối' });
    }

    try {
        // Lấy token từ header (bỏ phần 'Bearer ' ở đầu)
        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        console.log('[AUTH] Token không hợp lệ:', err.message);
        res.status(401).json({ message: 'Token không hợp lệ' });
    }
};

router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    // Kiểm tra refresh token có được cung cấp hay không
    if (!refreshToken) {
        return res.status(401).json({ message: 'Refresh token là bắt buộc' });
    }

    try {
        // Xác thực refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh');

        // Kiểm tra người dùng có tồn tại không và token có trong database không
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Kiểm tra xem refresh token có tồn tại trong database không
        const tokenExists = user.refreshTokens && user.refreshTokens.some((t) => t.token === refreshToken);
        if (!tokenExists) {
            return res.status(403).json({ message: 'Refresh token không hợp lệ hoặc đã bị thu hồi' });
        }

        // Tạo access token mới
        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Tạo refresh token mới (token rotation)
        const newRefreshToken = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh',
            { expiresIn: '7d' }
        );

        // Xóa refresh token cũ và thêm refresh token mới
        user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);
        user.refreshTokens.push({ token: newRefreshToken });
        await user.save();

        res.json({
            accessToken,
            refreshToken: newRefreshToken,
            message: 'Tạo mới token thành công',
        });
    } catch (err) {
        console.error(err.message);
        return res.status(403).json({ message: 'Refresh token không hợp lệ hoặc đã hết hạn' });
    }
});

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
            user = new User({
                name,
                email,
                password: hashedPassword,
                role: 'customer',
                avatar: 'https://cloud.appwrite.io/v1/storage/buckets/67dbb6420032d8a2ee8f/files/67dbcb3d26027f2e8bc1/view?project=67dbb339000bfac45e0d',
            });
            await user.save();

            // Tạo access token
            const accessToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            // Tạo refresh token
            const refreshToken = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh',
                { expiresIn: '7d' }
            );

            // Lưu refresh token vào database
            user.refreshTokens = [{ token: refreshToken }];
            await user.save();

            res.status(201).json({
                message: 'Đăng ký thành công!',
                accessToken,
                refreshToken,
            });
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

            // Tạo access token (ngắn hạn - 1 giờ)
            const accessToken = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            // Tạo refresh token (dài hạn - 7 ngày)
            const refreshToken = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET + '_refresh',
                { expiresIn: '7d' }
            );

            // Lưu refresh token vào database
            user.refreshTokens = user.refreshTokens || [];
            user.refreshTokens.push({ token: refreshToken });
            await user.save();

            res.status(200).json({
                message: 'Đăng nhập thành công!',
                accessToken,
                refreshToken,
            });
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Lỗi Server');
        }
    }
);
router.post('/logout', authMiddleware, async (req, res) => {
    const { refreshToken } = req.body;
    const userId = req.user.userId;

    try {
        // Tìm user và xóa refresh token
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        if (refreshToken) {
            // Xóa một refresh token cụ thể
            user.refreshTokens = user.refreshTokens.filter((t) => t.token !== refreshToken);
        } else {
            // Xóa tất cả refresh token (đăng xuất khỏi tất cả thiết bị)
            user.refreshTokens = [];
        }

        await user.save();
        res.json({ message: 'Đăng xuất thành công' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
});
// API: Lấy thông tin người dùng hiện tại
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        // Tìm user theo ID từ token và loại bỏ các trường nhạy cảm
        const user = await User.findById(userId).select('-password -refreshTokens');

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Trả về tất cả thông tin người dùng trừ các trường nhạy cảm
        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                phoneNumber: user.phoneNumber,
                address: user.address,
                role: user.role,
                bio: user.bio,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Lỗi Server' });
    }
});

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

// API: Lấy tất cả user (chỉ cho admin)
router.get('/all-users', authMiddleware, async (req, res) => {
    try {
        // Chỉ cho phép admin truy cập
        if (!req.user.role || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Chỉ admin mới được phép xem danh sách user' });
        }
        const users = await User.find().select('-password -refreshTokens');
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi Server' });
    }
});

// API: Xóa user (chỉ cho admin)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        if (!req.user.role || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Chỉ admin mới được phép xóa user' });
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy user' });
        }
        res.json({ message: 'Xóa user thành công' });
    } catch (err) {
        res.status(500).json({ message: 'Lỗi Server' });
    }
});

module.exports = router;
