import React from 'react';
import './CategoryMenu.css'; // Thêm CSS cho phần này
import newFoodImg from '../../assets/image/new.jpg';
import Burger from '../../assets/image/burger.jpg';
import Beef from '../../assets/image/B1.png';
import friedChickenImg from '../../assets/image/chicken.jpg';
import sideDishesImg from '../../assets/image/side_dishes.jpg';
const categories = [
    { name: 'New Food', img: newFoodImg },
    { name: 'Burger', img: Burger },
    { name: 'Beef', img: Beef },
    { name: 'Fried Chicken', img: friedChickenImg },
    { name: 'Side Dishes', img: sideDishesImg },
];

const CategoryMenu = () => {
    return (
        <div className="category-menu">
            {categories.map((category, index) => (
                <div key={index} className="category-item">
                    <div className="category-icon">
                        <img src={category.img} alt={category.name} />
                    </div>
                    <p>{category.name}</p>
                </div>
            ))}
        </div>
    );
};

export default CategoryMenu;
