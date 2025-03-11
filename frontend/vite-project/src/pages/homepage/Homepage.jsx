import React from 'react';
import CarouselHome from '../../components/carousel/CarouselHome';
import './Homepage.css'; // Import CSS riêng

export default function Homepage() {
    return (
        <div className="homepage">
            <h1 className="homepage-title"></h1>

            {/* Carousel */}
            <CarouselHome />
        </div>
    );
}
