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
    {
        name: 'Cheese Ring Burger',
        price: '230',
        description: 'Delicious cheese-filled burger.',
        image: cheeseRingBurger,
        cateId: null,
    },
    {
        name: 'Cheese Ring Beef Burger',
        price: '230',
        description: 'A tasty beef burger with cheese.',
        image: newfood,
        cateId: null,
    },
    {
        name: 'Beef Burger',
        price: '230',
        description: 'Classic beef burger with fresh ingredients.',
        image: cheeseBeefBurger,
        cateId: 1,
    },
    {
        name: 'Beef Bacon Burger',
        price: '230',
        description: 'Juicy beef burger with crispy bacon.',
        image: cheeseBaconBurger,
        cateId: 1,
    },
    {
        name: 'Chicken Burger',
        price: '230',
        description: 'Crispy chicken burger with lettuce.',
        image: chickenburger,
        cateId: 1,
    },
    { name: 'Beefsteak', price: '230', description: 'Premium beefsteak with rich sauce.', image: Beef, cateId: 2 },
    {
        name: 'Beef Wellington',
        price: '230',
        description: 'Flaky pastry wrapped around tender beef.',
        image: beef2,
        cateId: 2,
    },
    {
        name: 'French Beef Stew',
        price: '230',
        description: 'Slow-cooked beef stew with vegetables.',
        image: beef3,
        cateId: 2,
    },
    {
        name: 'Fried Chicken',
        price: '230',
        description: 'Crispy fried chicken with spices.',
        image: friedChickenImg,
        cateId: 3,
    },
    {
        name: 'Grilled chicken with salt and chili',
        price: '230',
        description: 'Spicy grilled chicken with seasoning.',
        image: Chicken,
        cateId: 3,
    },
    {
        name: 'Chicken rice',
        price: '230',
        description: 'Steamed rice with flavorful chicken.',
        image: chickenrice,
        cateId: 3,
    },
    { name: 'Salad', price: '230', description: 'Fresh vegetables with dressing.', image: Salad, cateId: 4 },
    { name: 'Tobokki', price: '230', description: 'Spicy Korean rice cakes.', image: tobokki, cateId: 4 },
    { name: 'Kimbap', price: '230', description: 'Korean rice rolls with seaweed.', image: kimbap, cateId: 4 },
    {
        name: 'Fried Kimbap',
        price: '230',
        description: 'Deep-fried kimbap with crunchy texture.',
        image: kimbapfries,
        cateId: 4,
    },
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
