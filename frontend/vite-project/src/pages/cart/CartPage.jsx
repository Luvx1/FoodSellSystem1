import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Empty, Typography, Row, Col, InputNumber, Card } from 'antd';
import { DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { removeFromCart, updateQuantity } from '../../redux/feature/cartSlice';
import { useNavigate } from 'react-router-dom';
import './CartPage.css';

const { Title, Text } = Typography;

export default function CartPage() {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity > 0) {
            dispatch(updateQuantity({ productId, quantity: newQuantity }));
        }
    };

    const handleRemoveItem = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    if (cartItems.length === 0) {
        return (
            <div className="cart-empty">
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description="Your cart is empty"
                />
                <Button
                    className="cart-btn"
                    icon={<ShoppingOutlined />}
                    onClick={() => navigate('/product')}
                    size="large"
                >
                    Continue Shopping
                </Button>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <Title level={2}>Shopping Cart</Title>
            <Row gutter={[24, 24]}>
                <Col xs={24} lg={16}>
                    <div className="cart-items">
                        {cartItems.map((item) => (
                            <Card key={item.productId} className="cart-item">
                                <Row gutter={[16, 16]} align="middle">
                                    <Col xs={24} sm={6}>
                                        <div className="cart-item-image">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                    </Col>
                                    <Col xs={24} sm={12}>
                                        <div className="cart-item-info">
                                            <Title level={4}>{item.name}</Title>
                                            <Text type="secondary">{formatPrice(item.price)}</Text>
                                        </div>
                                    </Col>
                                    <Col xs={12} sm={3}>
                                        <InputNumber
                                            min={1}
                                            value={item.quantity}
                                            onChange={(value) => handleQuantityChange(item.productId, value)}
                                            className="cart-item-quantity"
                                        />
                                    </Col>
                                    <Col xs={12} sm={3}>
                                        <div className="cart-item-actions">
                                            <Text strong>{formatPrice(item.price * item.quantity)}</Text>
                                            <Button
                                                className="cart-btn cart-btn-delete"
                                                icon={<DeleteOutlined />}
                                                onClick={() => handleRemoveItem(item.productId)}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                            </Card>
                        ))}
                    </div>
                </Col>
                <Col xs={24} lg={8}>
                    <Card className="cart-summary">
                        <Title level={3}>Order Summary</Title>
                        <div className="summary-item">
                            <Text>Subtotal</Text>
                            <Text strong>{formatPrice(calculateSubtotal())}</Text>
                        </div>
                        <div className="summary-item">
                            <Text>Shipping</Text>
                            <Text strong>Free</Text>
                        </div>
                        <div className="summary-item total">
                            <Text strong>Total</Text>
                            <Text strong>{formatPrice(calculateSubtotal())}</Text>
                        </div>
                        <Button
                            className="cart-btn"
                            size="large"
                            block
                            onClick={() => navigate('/checkout')}
                        >
                            Proceed to Checkout
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
} 