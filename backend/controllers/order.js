// controllers/order.js
const Order = require('../models/Order');
const Product = require('../models/Product');
const { default: mongoose } = require('mongoose');

function isValidObjectId(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

// Tạo đơn hàng mới (POST)
const createOrder = async (req, res) => {
    const { userId, products, shippingAddress, paymentMethod } = req.body;
    try {
        // Tính tổng giá trị đơn hàng
        let totalAmount = 0;
        const orderItems = [];

        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Sản phẩm có ID ${item.productId} không tồn tại!` });
            }

            const itemTotal = product.price * item.quantity;
            totalAmount += itemTotal;

            orderItems.push({
                productId: item.productId,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                image: product.images && product.images.length > 0 ? product.images[0] : null,
            });
        }

        const newOrder = new Order({
            userId,
            products: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod,
            status: 'pending', // Trạng thái mặc định khi tạo đơn hàng
        });

        await newOrder.save();
        res.status(201).json({ message: 'Đơn hàng đã được tạo!', order: newOrder });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// Lấy tất cả đơn hàng (GET)
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// Lấy đơn hàng theo ID (GET)
const getOrderById = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại!' });
        }
        res.status(200).json(order);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// Lấy đơn hàng theo user ID (GET)
const getOrdersByUser = async (req, res) => {
    const { userId } = req.params;
    try {
        if (!isValidObjectId(userId)) {
            return res.status(400).json({ message: 'ID người dùng không hợp lệ' });
        }

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// Cập nhật đơn hàng (PUT)
const updateOrder = async (req, res) => {
    const { id } = req.params;
    const { shippingAddress, status, paymentStatus } = req.body;
    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại!' });
        }

        // Chỉ cho phép cập nhật một số thông tin
        if (shippingAddress) order.shippingAddress = shippingAddress;
        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        await order.save();
        res.status(200).json({ message: 'Cập nhật đơn hàng thành công!', order });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// Cập nhật trạng thái đơn hàng (PATCH)
const updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({
            message: 'Trạng thái không hợp lệ',
            validStatuses,
        });
    }

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại!' });
        }

        // Không cho phép thay đổi trạng thái của đơn hàng đã hủy
        if (order.status === 'cancelled' && status !== 'cancelled') {
            return res.status(400).json({ message: 'Không thể thay đổi trạng thái của đơn hàng đã hủy!' });
        }

        // Cập nhật trạng thái
        order.status = status;

        // Nếu đơn hàng đã hoàn thành, thì cập nhật thời gian hoàn thành
        if (status === 'delivered') {
            order.deliveredAt = Date.now();
        }

        await order.save();
        res.status(200).json({ message: 'Cập nhật trạng thái đơn hàng thành công!', order });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// Hủy đơn hàng (PATCH)
const cancelOrder = async (req, res) => {
    const { id } = req.params;
    const { cancelReason } = req.body;

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại!' });
        }

        // Chỉ cho phép hủy đơn hàng khi đơn hàng ở trạng thái pending hoặc processing
        if (order.status !== 'pending' && order.status !== 'processing') {
            return res.status(400).json({
                message: 'Không thể hủy đơn hàng ở trạng thái hiện tại',
                currentStatus: order.status,
            });
        }

        // Cập nhật trạng thái và lý do hủy
        order.status = 'cancelled';
        order.cancelReason = cancelReason || 'Không có lý do được cung cấp';
        order.cancelledAt = Date.now();

        await order.save();
        res.status(200).json({ message: 'Đơn hàng đã được hủy thành công!', order });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

// Xóa đơn hàng (DELETE)
const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findByIdAndDelete(id);
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại!' });
        }

        res.status(200).json({ message: 'Đơn hàng đã được xóa!' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi Server');
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    getOrdersByUser,
    updateOrder,
    updateOrderStatus,
    cancelOrder,
    deleteOrder,
};
