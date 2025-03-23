const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                },
                name: String,
                price: Number,
                quantity: Number,
                image: String,
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        shippingAddress: {
            fullName: String,
            address: String,
            city: String,
            postalCode: String,
            country: String,
            phone: String,
        },
        paymentMethod: {
            type: String,
            required: true,
        },
        paymentStatus: {
            type: String,
            default: 'pending',
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending',
        },
        cancelReason: String,
        cancelledAt: Date,
        deliveredAt: Date,
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
