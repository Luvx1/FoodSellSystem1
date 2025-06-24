import React from 'react';
import CarouselHome from '../../components/carousel/CarouselHome';
import './Homepage.css'; // Import CSS riêng
import { useLanguage } from '../../LanguageContext';

export default function Homepage() {
    const { lang } = useLanguage();
    return (
        <div className="homepage">
            {/* Carousel */}
            <CarouselHome lang={lang} />
        </div>
    );
}
