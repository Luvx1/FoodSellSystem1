import './ProductModal.css';
import { useState, useEffect } from 'react';
import { addToCart } from '../../utils/cartUtils';
import Cookies from 'js-cookie';

export default function ProductModal({ product, onClose }) {
    const [quantity, setQuantity] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Kiểm tra trạng thái đăng nhập khi component mount
        const userToken = Cookies.get('userToken');
        setIsLoggedIn(!!userToken);
    }, []);

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    // Xử lý thêm sản phẩm vào giỏ hàng
    const handleAddToCart = () => {
        if (!isLoggedIn) {
            alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng');
            return;
        }
        addToCart({ 
            id: product._id, // Sử dụng ID từ MongoDB
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            quantity 
        });
        alert('Sản phẩm đã được thêm vào giỏ hàng!');
        onClose(); // Đóng modal sau khi thêm vào giỏ hàng
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <h2>{product.name}</h2>
                <img className="modal-image" src={product.image} alt={product.name} />

                {product.description && <p className="product-description">{product.description}</p>}

                <p>Price: $ {product.price}</p>

                {/* Số lượng sản phẩm */}
                <div className="quantity-controls">
                    <button onClick={decreaseQuantity}>-</button>
                    <span>{quantity}</span>
                    <button onClick={increaseQuantity}>+</button>
                </div>

                {/* Nút thêm vào giỏ hàng */}
                <button className="add-to-cart-button" onClick={handleAddToCart}>
                    Add to Cart
                </button>
            </div>
        </div>
    );
}