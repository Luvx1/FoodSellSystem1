import './ProductModal.css';
import { useState } from 'react';

export default function ProductModal({ product, onClose }) {
    const [quantity, setQuantity] = useState(1);

    const increaseQuantity = () => setQuantity(quantity + 1);
    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="close-button" onClick={onClose}>
                    ×
                </button>
                <h2>{product.name}</h2>
                <img className="modal-image" src={product.image} alt={product.name} />

                {/* Thêm mô tả sản phẩm */}
                {product.description && <p className="product-description">{product.description}</p>}

                <p>Price: {product.price}</p>

                {/* Số lượng sản phẩm */}
                <div className="quantity-controls">
                    <button onClick={decreaseQuantity}>-</button>
                    <span>{quantity}</span>
                    <button onClick={increaseQuantity}>+</button>
                </div>

                <button className="add-to-cart-button">Add to Cart</button>
            </div>
        </div>
    );
}
