import { useState } from 'react';
import './ProductCard.css';
import ProductModal from './ProductModal';
import { addToCart } from '../../utils/cartUtils';

export default function ProductCard({ product }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    // Xử lý thêm sản phẩm vào giỏ hàng
    const handleAddToCart = () => {
        addToCart({
            id: product._id, // Sử dụng ID từ MongoDB
            name: product.name,
            description: product.description,
            price: product.price,
            image: product.image,
            quantity: 1,
        });
        alert('Sản phẩm đã được thêm vào giỏ hàng!');
    };

    return (
        <>
            <div className="product-card" onClick={openModal}>
                <img src={product.image} alt={product.name} className="product-image" />
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <p className="product-price">$ {product.price}</p>
            </div>

            {/* Hiển thị modal khi bấm vào card */}
            {isModalOpen && <ProductModal product={product} onClose={closeModal} onAddToCart={handleAddToCart} />}
        </>
    );
}
