import React from 'react';
import { Card, Button, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './ProductCard.css';

const { Meta } = Card;
const { Text } = Typography;

const ProductCard = ({ product, onAddToCart, onClick }) => {
    // Format price to Vietnamese currency
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    // Handle add to cart without triggering navigation
    const handleAddToCart = (e) => {
        e.stopPropagation(); // Prevent click from bubbling up to card
        onAddToCart();
    };

    return (
        <Card
            hoverable
            className="product-card"
            cover={
                <div className="product-image-container" onClick={onClick}>
                    <img
                        alt={product.name}
                        src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                        className="product-image"
                    />
                </div>
            }
            onClick={onClick}>
            <Meta
                title={product.name}
                description={
                    <div className="product-description">
                        <Text ellipsis={{ rows: 2 }}>{product.description}</Text>
                        <div className="product-price">{formatPrice(product.price)}</div>
                    </div>
                }
            />
            <div className="product-actions">
                <Button
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={handleAddToCart}
                    className="add-to-cart-btn">
                    Add to Cart
                </Button>
            </div>
        </Card>
    );
};

export default ProductCard;
