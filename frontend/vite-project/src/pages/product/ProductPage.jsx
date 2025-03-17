import { useEffect, useState } from 'react';
import ProductCard from '../../components/productCard/ProductCard';
import './ProductPage.css';
import newFoodImg from '../../assets/image/new.jpg';
import Burger from '../../assets/image/burger.jpg';
import Beef from '../../assets/image/B1.png';
import friedChickenImg from '../../assets/image/chicken.jpg';
import sideDishesImg from '../../assets/image/side_dishes.jpg';
import { Button } from 'antd';
import axios from 'axios';
import { addToCart } from '../../utils/cartUtils';

export default function ProductPage() {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [productData, setProductData] = useState([]);

    const categories = [
        { name: 'New Food', img: newFoodImg, link: '/product', cateId: null },
        { name: 'Burger', img: Burger, link: '/burger', cateId: 1 },
        { name: 'Beef', img: Beef, link: '/beef', cateId: 2 },
        { name: 'Fried Chicken', img: friedChickenImg, link: '/fried-chicken', cateId: 3 },
        { name: 'Side Dishes', img: sideDishesImg, link: '/side-dishes', cateId: 4 },
    ];

    const fetchProducts = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/products');
            const data = response.data;
            setProductData(data);
            console.log('Fetch product success:', data);
        } catch (error) {
            console.error('Fetch product error:', error);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (filteredProducts.length === 0) {
            setFilteredProducts(productData);
        }
    }, [productData]);

    const handleGetProductByCategory = (cateId) => {
        if (cateId === null) {
            setFilteredProducts(productData.filter((p) => !p.cateId));
        } else {
            setFilteredProducts(productData.filter((p) => p.cateId === cateId));
        }
    };

    const handleAddToCart = (product) => {
        const newProduct = {
            id: product._id, // Sử dụng ID từ MongoDB
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.image
        };
        addToCart(newProduct);
    };

    return (
        <div className="product-page">
            <div className="category-menu">
                {categories.map((category, index) => (
                    <div key={index} className="category-item">
                        <Button onClick={() => handleGetProductByCategory(category.cateId)} className="category-icon">
                            <img src={category.img} alt={category.name} />
                        </Button>
                        <p>{category.name}</p>
                    </div>
                ))}
            </div>
            <h1>Explore our menu</h1>
            <div className="wrapper-product">
                {filteredProducts.map((product, index) => (
                    <ProductCard key={index} product={product} onAddToCart={() => handleAddToCart(product)} />
                ))}
            </div>
        </div>
    );
}