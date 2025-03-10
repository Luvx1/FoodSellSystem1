import React from 'react';
import { Breadcrumb } from 'antd';
import CarouselHome from '../../components/carousel/CarouselHome';
import './Homepage.css'; // Import CSS riêng

export default function Homepage() {


    return (
        <div className="homepage">
            {/* Breadcrumb */}
            <Breadcrumb items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]} className="breadcrumb" />

            <h1 className="homepage-title"></h1>

            {/* Carousel */}
            <CarouselHome />
            
        </div>
    );
}
