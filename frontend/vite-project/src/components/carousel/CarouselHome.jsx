import React from 'react';
import home1 from '../../assets/image/home7.jpg';
import home2 from '../../assets/image/home6.jpg';
import home3 from '../../assets/image/home10.jpg';
import { Carousel, Button } from 'antd';
import './CarouselHome.css';
import { useNavigate } from 'react-router-dom';

export default function CarouselHome() {
    const navigate = useNavigate();

    const images = [
        {
            src: home1,
            title: 'Order your favorite food here',
            description:
                'Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and satisfy your cravings and elevate your dining experience, one delicious meal at a time.',
        },
        {
            src: home2,
            title: 'Explore our menu',
            description:
                'Discover a variety of dishes that cater to all tastes and preferences, crafted with care and passion by our expert chefs.',
        },
        {
            src: home3,
            title: 'Delicious dishes crafted with the finest ingredients',
            description:
                'Indulge in our carefully curated menu, featuring the freshest ingredients and innovative recipes that promise a memorable dining experience.',
        },
    ];

    return (
        <div className="carousel">
            <Carousel autoplay arrows={true} dots={false} className="homepage-carousel">
                {images.map((image, index) => (
                    <div key={index} className="carousel-item">
                        <img src={image.src} alt={`slide-${index}`} className="carousel-image" />
                        <div className="carousel-text">
                            <h2>{image.title}</h2>
                            <p>{image.description}</p>
                            <Button type="primary" className="view-menu-button" onClick={() => navigate('/product')}>
                                View Menu
                            </Button>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
