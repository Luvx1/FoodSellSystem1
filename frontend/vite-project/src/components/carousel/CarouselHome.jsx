import React from 'react';
import home1 from '../../assets/image/home1.jpg';
import home2 from '../../assets/image/home2.png';
import home3 from '../../assets/image/home3.jpg';
import { Carousel } from 'antd';

export default function CarouselHome() {
    const images = [home1, home2, home3];
    return (
        // <div className="carousel">
        <Carousel autoplay className="homepage-carousel">
            {images.map((src, index) => (
                <div key={index} className="carousel-item">
                    <img src={src} alt={`slide-${index}`} className="carousel-image" />
                </div>
            ))}
        </Carousel>
        // </div>
    );
}
