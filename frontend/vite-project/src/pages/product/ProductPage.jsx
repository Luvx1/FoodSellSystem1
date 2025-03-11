import { useEffect, useState } from 'react';
import ProductCard from '../../components/productCard/ProductCard';
import './ProductPage.css';
import cheeseRingBurger from '../../assets/image/cheese-ring-burger.jpg';
import cheeseBeefBurger from '../../assets/image/burger3.jpg';
import cheeseBaconBurger from '../../assets/image/double-bbq-bacon-cheese.jpg';
import newFoodImg from '../../assets/image/new.jpg';
import Burger from '../../assets/image/burger.jpg';
import Beef from '../../assets/image/B1.png';
import friedChickenImg from '../../assets/image/chicken.jpg';
import sideDishesImg from '../../assets/image/side_dishes.jpg';
import Salad from '../../assets/image/salad.jpg';
import tobokki from '../../assets/image/tobokki.jpg';
import Chicken from '../../assets/image/chicken1.jpg';
import kimbap from '../../assets/image/kimbap.jpg';
import kimbapfries from '../../assets/image/kimbapchienxu.jpg';
import beef2 from '../../assets/image/beef-wellington.jpg';
import beef3 from '../../assets/image/beef-french.jpg';
import chickenrice from '../../assets/image/chicken-rice.jpg';
import chickenburger from '../../assets/image/burger-ga-trung.jpg';
import newfood from '../../assets/image/cheese-ring-beef-burger-jr-combo.jpg';
import { Button } from 'antd';

const productData = [
    { name: 'Cheese Ring Burger', price: '230', image: cheeseRingBurger, cateId: null },
    { name: 'Cheese Ring Beef Burger', price: '230', image: newfood, cateId: null },
    { name: 'Beef Burger', price: '230', image: cheeseBeefBurger, cateId: 1 },
    { name: 'Beef Bacon Burger', price: '230', image: cheeseBaconBurger, cateId: 1 },
    { name: 'Chicken Burger', price: '230', image: chickenburger, cateId: 1 },
    { name: 'Beefsteak', price: '230', image: Beef, cateId: 2 },
    { name: 'Beef Wellington', price: '230', image: beef2, cateId: 2 },
    { name: 'French Beef Stew', price: '230', image: beef3, cateId: 2 },
    { name: 'Fried Chicken', price: '230', image: friedChickenImg, cateId: 3 },
    { name: 'Grilled chicken with salt and chili', price: '230', image: Chicken, cateId: 3 },
    { name: 'Chicken rice', price: '230', image: chickenrice, cateId: 3 },

    { name: 'Salad', price: '230', image: Salad, cateId: 4 },
    { name: 'tobokki', price: '230', image: tobokki, cateId: 4 },
    { name: 'kimbap', price: '230', image: kimbap, cateId: 4 },
    { name: 'fried kimbap', price: '230', image: kimbapfries, cateId: 4 },
];

const categories = [
    { name: 'New Food', img: newFoodImg, link: '/product', cateId: null },
    { name: 'Burger', img: Burger, link: '/burger', cateId: 1 },
    { name: 'Beef', img: Beef, link: '/beef', cateId: 2 },
    { name: 'Fried Chicken', img: friedChickenImg, link: '/fried-chicken', cateId: 3 },
    { name: 'Side Dishes', img: sideDishesImg, link: '/side-dishes', cateId: 4 },
];

export default function ProductPage() {
    const [filteredProducts, setFilteredProducts] = useState(productData);

    useEffect(() => {
        if (filteredProducts.length === 0) {
            setFilteredProducts(productData);
        }
    }, []);

    const handleGetProductByCategory = (cateId) => {
        if (cateId === null) {
            setFilteredProducts(productData.filter((p) => !p.cateId));
        } else {
            setFilteredProducts(productData.filter((p) => p.cateId === cateId));
        }
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
            <h1>Product Page</h1>
            <div className="wrapper-product">
                {filteredProducts.map((product, index) => (
                    <ProductCard key={index} product={product} />
                ))}
            </div>
        </div>
    );
}
