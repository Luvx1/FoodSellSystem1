import { useState } from 'react';
import './ProductCard.css';
import ProductModal from './ProductModal';

export default function ProductCard({ product }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <div className="product-card" onClick={openModal}>
                <img src={product.image} alt={product.name} className="product-image" />
                <h3 className="product-name">{product.name}</h3>
                {/* Hiển thị mô tả ở trên giá */}
                <p className="product-description">{product.description}</p>
                <p className="product-price">Price: {product.price}</p>
            </div>

            {/* Hiển thị modal khi bấm vào card */}
            {isModalOpen && <ProductModal product={product} onClose={closeModal} />}
        </>
    );
}
