import React from 'react';
import { useSearchParams } from 'react-router-dom';
import './CategoryMenu.css';

import newFoodImg from '../../assets/image/new.jpg';
import Burger from '../../assets/image/burger.jpg';
import Beef from '../../assets/image/B1.png';
import friedChickenImg from '../../assets/image/chicken.jpg';
import sideDishesImg from '../../assets/image/side_dishes.jpg';

const categories = [
    { name: 'New Food', img: newFoodImg, slug: 'new-food' },
    { name: 'Burger', img: Burger, slug: 'burger' },
    { name: 'Beef', img: Beef, slug: 'beef' },
    { name: 'Fried Chicken', img: friedChickenImg, slug: 'fried-chicken' },
    { name: 'Side Dishes', img: sideDishesImg, slug: 'side-dishes' },
];

const CategoryMenu = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const selectedCategory = searchParams.get('category') || 'new-food';

    const handleCategoryClick = (category) => {
        setSearchParams({ category });
    };

    return (
        <div className="category-menu">
            {categories.map((category, index) => (
                <div
                    key={index}
                    className={`category-item ${selectedCategory === category.slug ? 'active' : ''}`}
                    onClick={() => handleCategoryClick(category.slug)}>
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
