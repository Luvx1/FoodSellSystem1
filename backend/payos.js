const express = require('express');
const PayOS = require('@payos/node');
const router = express.Router();

// Thay các giá trị này bằng thông tin của bạn
const PAYOS_CLIENT_ID = 'bbd93d8c-7b77-4495-ba1e-033ffd195361';
const PAYOS_API_KEY = '08e0fe73-f1d6-4e71-acbc-c941907a585c';
const PAYOS_CHECKSUM_KEY = 'ad03105447808296feffacfb13ebbe8535896b1bd1def48324f8cfc2e85b162b';

const payOS = new PayOS(PAYOS_CLIENT_ID, PAYOS_API_KEY, PAYOS_CHECKSUM_KEY);

router.post('/create_payment', async (req, res) => {
    try {
        const { amount, description, items, buyerName, buyerEmail, buyerPhone, buyerAddress } = req.body;
        // Tạo mã đơn hàng ngẫu nhiên (bạn có thể dùng orderId thực tế)
        const orderCode = Date.now();

        // Cắt mô tả nếu dài hơn 25 ký tự
        const shortDescription = description.length > 25 ? description.slice(0, 25) : description;

        const paymentLinkRes = await payOS.createPaymentLink({
            orderCode,
            amount,
            description: shortDescription,
            items, // [{ name, quantity, price }]
            buyerName,
            buyerEmail,
            buyerPhone,
            buyerAddress,
            returnUrl: 'http://localhost:5173/payos_return',
            cancelUrl: 'http://localhost:5173/checkout',
        });

        res.json({ checkoutUrl: paymentLinkRes.checkoutUrl });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to create PayOS payment', detail: error.message });
    }
});

module.exports = router; 