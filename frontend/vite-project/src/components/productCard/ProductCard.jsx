import React from 'react';
import { Card, Button, Typography } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import './ProductCard.css';
import { useLanguage } from '../../LanguageContext';

const { Meta } = Card;
const { Text } = Typography;

const ProductCard = ({ product, onAddToCart, onClick }) => {
    const { lang } = useLanguage();
    const cardText = {
        en: { addToCart: 'Add to Cart' },
        vn: { addToCart: 'Thêm vào giỏ' },
    };

    // Ánh xạ tên và mô tả sản phẩm đa ngữ (demo)
    const productTranslations = {
        // Sử dụng _id hoặc name gốc làm key
        'Margherita Pizza': {
            en: {
                name: 'Margherita Pizza',
                description: 'Margherita-based pizza topped with premium cheese and fresh tomatoes.'
            },
            vn: {
                name: 'Pizza Margherita',
                description: 'Pizza Margherita phủ phô mai cao cấp và cà chua tươi.'
            }
        },
        'Spaghetti with Cheese': {
            en: {
                name: 'Spaghetti with Cheese',
                description: 'The outstanding red color and cheese flavor make this dish irresistible.'
            },
            vn: {
                name: 'Mì Ý phô mai',
                description: 'Màu đỏ nổi bật và vị phô mai thơm ngon khiến món ăn khó cưỡng.'
            }
        },
        'Baked Lasagna': {
            en: {
                name: 'Baked Lasagna',
                description: 'When combining the rich taste of cheese and meat, you get this classic dish.'
            },
            vn: {
                name: 'Lasagna nướng',
                description: 'Sự kết hợp giữa phô mai và thịt tạo nên món ăn truyền thống này.'
            }
        },
        'Crab Spagheti Cheese': {
            en: {
                name: 'Crab Spaghetti Cheese',
                description: 'Your sense of smell will be roused by the aroma of crab and cheese.'
            },
            vn: {
                name: 'Mì Ý cua phô mai',
                description: 'Hương thơm của cua và phô mai đánh thức vị giác của bạn.'
            }
        },
        // Thêm các sản phẩm khác nếu muốn
    };

    // Lấy tên/mô tả theo ngôn ngữ, nếu không có thì fallback về gốc
    const translated = productTranslations[product.name]?.[lang] || { name: product.name, description: product.description };

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
                        alt={translated.name}
                        src={product.image || 'https://via.placeholder.com/300x200?text=No+Image'}
                        className="product-image"
                    />
                </div>
            }
            onClick={onClick}>
            <Meta
                title={translated.name}
                description={
                    <div className="product-description">
                        <Text ellipsis={{ rows: 2 }}>{translated.description}</Text>
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
                    {cardText[lang].addToCart}
                </Button>
            </div>
        </Card>
    );
};

export default ProductCard;
