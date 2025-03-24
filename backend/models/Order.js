const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true,
                },
                name: { type: String, required: true },
                price: { type: Number, required: true },
                quantity: { type: Number, required: true, default: 1 },
                image: { type: String },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        shippingAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            phoneNumber: { type: String, required: true },
            district: { type: String },
            notes: { type: String },
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ['COD', 'BANK_TRANSFER', 'CREDIT_CARD', 'MOMO'],
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed'],
            default: 'pending',
        },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipping', 'delivered', 'cancelled'],
            default: 'pending',
        },
        cancelReason: { type: String },
        cancelledAt: { type: Date },
        deliveredAt: { type: Date },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
