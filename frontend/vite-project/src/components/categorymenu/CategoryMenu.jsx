import React from 'react';
import { Link } from 'react-router-dom'; // Import Link từ react-router-dom
import './CategoryMenu.css';
import newFoodImg from '../../assets/image/new.jpg';
import Burger from '../../assets/image/burger.jpg';
import Beef from '../../assets/image/B1.png';
import friedChickenImg from '../../assets/image/chicken.jpg';
import sideDishesImg from '../../assets/image/side_dishes.jpg';

const categories = [
    { name: 'New Food', img: newFoodImg, link: '/product' }, // Thêm link cho New Food
    { name: 'Burger', img: Burger, link: '/burger' },
    { name: 'Beef', img: Beef, link: '/beef' },
    { name: 'Fried Chicken', img: friedChickenImg, link: '/fried-chicken' },
    { name: 'Side Dishes', img: sideDishesImg, link: '/side-dishes' },
];

const CategoryMenu = () => {
    return (
        <div className="category-menu">
            {categories.map((category, index) => (
                <div key={index} className="category-item">
                    {category.link ? ( // Kiểm tra nếu có link thì bọc trong Link
                        <Link to={category.link}>
                            <div className="category-icon">
                                <img src={category.img} alt={category.name} />
                            </div>
                            <p>{category.name}</p>
                        </Link>
                    ) : (
                        <>
                            <div className="category-icon">
                                <img src={category.img} alt={category.name} />
                            </div>
                            <p>{category.name}</p>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CategoryMenu;
