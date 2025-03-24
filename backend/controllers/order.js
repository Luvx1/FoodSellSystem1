const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

// Tạo đơn hàng mới
const createOrder = async (req, res) => {
    try {
        const { items, shippingAddress, paymentMethod } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Đơn hàng phải có ít nhất một sản phẩm',
            });
        }

        if (!shippingAddress || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: 'Địa chỉ giao hàng và phương thức thanh toán là bắt buộc',
            });
        }

        // Tính toán đơn hàng với dữ liệu từ database
        const orderItems = [];
        let totalAmount = 0;

        // Lấy thông tin sản phẩm từ database để đảm bảo giá cả chính xác
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Sản phẩm với ID ${item.productId} không tồn tại`,
                });
            }

            orderItems.push({
                productId: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images && product.images.length > 0 ? product.images[0] : null,
            });

            totalAmount += product.price * item.quantity;
        }

        // Tạo đơn hàng mới
        const newOrder = new Order({
            userId: req.user.userId, // Lấy từ authentication middleware
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod,
            status: 'pending',
            paymentStatus: 'pending',
        });

        // Lưu đơn hàng vào database
        await newOrder.save();

        res.status(201).json({
            success: true,
            message: 'Đơn hàng đã được tạo thành công',
            order: newOrder,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tạo đơn hàng',
            error: error.message,
        });
    }
};

// Lấy tất cả đơn hàng (Admin)
const getAllOrders = async (req, res) => {
    try {
        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter parameters
        const status = req.query.status;
        const filter = {};

        // Apply status filter if provided
        if (status) {
            filter.status = status;
        }

        // Query with pagination
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limit)
            .populate('userId', 'name email'); // Populate basic user info

        // Get total count for pagination info
        const totalOrders = await Order.countDocuments(filter);
        const totalPages = Math.ceil(totalOrders / limit);

        res.status(200).json({
            success: true,
            count: orders.length,
            pagination: {
                totalOrders,
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            orders,
        });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy danh sách đơn hàng',
            error: error.message,
        });
    }
};

// Cập nhật trạng thái đơn hàng (chỉ admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        // Kiểm tra id hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID đơn hàng không hợp lệ',
            });
        }

        // Validate status
        const validStatuses = ['pending', 'processing', 'shipping', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ',
                validStatuses,
            });
        }

        // Tìm đơn hàng
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng',
            });
        }

        // Logic xử lý theo trạng thái
        if (order.status === 'cancelled' && status !== 'cancelled') {
            return res.status(400).json({
                success: false,
                message: 'Không thể thay đổi trạng thái của đơn hàng đã hủy',
            });
        }

        // Xử lý timestamp cho trạng thái đặc biệt
        if (status === 'delivered' && order.status !== 'delivered') {
            order.deliveredAt = Date.now();
        }

        if (status === 'cancelled' && order.status !== 'cancelled') {
            order.cancelledAt = Date.now();
            order.cancelReason = req.body.cancelReason || 'Hủy bởi quản trị viên';
        }

        // Cập nhật trạng thái
        order.status = status;

        // Lưu thông tin cập nhật
        const updatedOrder = await order.save();

        // Trả về kết quả
        res.status(200).json({
            success: true,
            message: 'Cập nhật trạng thái đơn hàng thành công',
            order: updatedOrder,
        });
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng',
            error: error.message,
        });
    }
};

// Hủy đơn hàng (chỉ cho đơn hàng đang ở trạng thái pending)
const cancelOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { cancelReason } = req.body;

        // Kiểm tra id hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID đơn hàng không hợp lệ',
            });
        }

        // Tìm đơn hàng
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng',
            });
        }

        // Kiểm tra người dùng có quyền hủy đơn hàng không (phải là đơn hàng của họ hoặc admin)
        if (order.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền hủy đơn hàng này',
            });
        }

        // Kiểm tra trạng thái đơn hàng
        if (order.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Chỉ có thể hủy đơn hàng ở trạng thái chờ xử lý',
                currentStatus: order.status,
            });
        }

        // Cập nhật trạng thái đơn hàng
        order.status = 'cancelled';
        order.cancelReason = cancelReason || 'Khách hàng yêu cầu hủy';
        order.cancelledAt = Date.now();

        // Lưu thông tin cập nhật
        const updatedOrder = await order.save();

        res.status(200).json({
            success: true,
            message: 'Hủy đơn hàng thành công',
            order: updatedOrder,
        });
    } catch (error) {
        console.error('Error cancelling order:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi hủy đơn hàng',
            error: error.message,
        });
    }
};

// Xác nhận đơn hàng thành công
const orderConfirm = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra id hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID đơn hàng không hợp lệ',
            });
        }

        // Tìm đơn hàng
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng',
            });
        }

        // Kiểm tra người dùng có quyền xác nhận đơn hàng không (phải là đơn hàng của họ hoặc admin)
        if (order.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xác nhận đơn hàng này',
            });
        }

        // Kiểm tra trạng thái đơn hàng
        if (order.status !== 'pending') {
            return res.status(400).json({
                success: false,
                message: 'Chỉ có thể xác nhận đơn hàng ở trạng thái chờ xử lý',
                currentStatus: order.status,
            });
        }

        // Cập nhật trạng thái đơn hàng thành processing (đã xác nhận)
        order.status = 'processing';
        order.confirmedAt = Date.now();

        // Lưu thông tin cập nhật
        const updatedOrder = await order.save();

        // Có thể thêm logic gửi email xác nhận đơn hàng ở đây
        
        res.status(200).json({
            success: true,
            message: 'Xác nhận đơn hàng thành công',
            order: updatedOrder,
        });
    } catch (error) {
        console.error('Error confirming order:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xác nhận đơn hàng',
            error: error.message,
        });
    }
};
// Lấy lịch sử đơn hàng của người dùng
const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.userId; // Get userId from authenticated user

        // Pagination parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filter parameters
        const status = req.query.status;
        const filter = { userId }; // Base filter always includes userId

        // Apply status filter if provided
        if (status) {
            filter.status = status;
        }

        // Query with pagination
        const orders = await Order.find(filter)
            .sort({ createdAt: -1 }) // Sort by newest first
            .skip(skip)
            .limit(limit);

        // Get total count for pagination info
        const totalOrders = await Order.countDocuments(filter);
        const totalPages = Math.ceil(totalOrders / limit);

        res.status(200).json({
            success: true,
            count: orders.length,
            pagination: {
                totalOrders,
                totalPages,
                currentPage: page,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            orders,
        });
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy lịch sử đơn hàng',
            error: error.message,
        });
    }
};
// Lấy thông tin chi tiết một đơn hàng
const getOrderDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.userId;

        // Kiểm tra id hợp lệ
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID đơn hàng không hợp lệ',
            });
        }

        // Tìm đơn hàng
        const order = await Order.findById(id);
        
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng',
            });
        }

        // Kiểm tra quyền truy cập
        if (order.userId.toString() !== userId && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Bạn không có quyền xem đơn hàng này',
            });
        }

        res.status(200).json({
            success: true,
            order,
        });
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi lấy thông tin đơn hàng',
            error: error.message,
        });
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    orderConfirm,
    getUserOrders, // Add new function to exports
    getOrderDetails, // Add new function to exports
};
