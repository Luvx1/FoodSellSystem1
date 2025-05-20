import React from 'react';
import home1 from '../../assets/image/home7.jpg';
import home2 from '../../assets/image/home6.jpg';
import home3 from '../../assets/image/home10.jpg';
import { Carousel, Button } from 'antd';
import './CarouselHome.css';
import { useNavigate } from 'react-router-dom';

const images = [
    {
        src: home1,
        title: {
            en: 'Order your favorite food here',
            vn: 'Đặt món ăn yêu thích của bạn tại đây',
        },
        description: {
            en: 'Choose from a diverse menu featuring a delectable array of dishes crafted with the finest ingredients and satisfy your cravings and elevate your dining experience, one delicious meal at a time.',
            vn: 'Chọn từ thực đơn đa dạng với nhiều món ăn hấp dẫn được chế biến từ nguyên liệu tươi ngon nhất, thoả mãn vị giác và nâng tầm trải nghiệm ẩm thực của bạn từng bữa ăn.',
        },
        button: {
            en: 'View Menu',
            vn: 'Xem Thực Đơn',
        },
    },
    {
        src: home2,
        title: {
            en: 'Explore our menu',
            vn: 'Khám phá thực đơn của chúng tôi',
        },
        description: {
            en: 'Discover a variety of dishes that cater to all tastes and preferences, crafted with care and passion by our expert chefs.',
            vn: 'Khám phá nhiều món ăn phù hợp với mọi khẩu vị, được chế biến tận tâm bởi các đầu bếp chuyên nghiệp.',
        },
        button: {
            en: 'View Menu',
            vn: 'Xem Thực Đơn',
        },
    },
    {
        src: home3,
        title: {
            en: 'Delicious dishes crafted with the finest ingredients',
            vn: 'Món ngon được chế biến từ nguyên liệu tươi ngon nhất',
        },
        description: {
            en: 'Indulge in our carefully curated menu, featuring the freshest ingredients and innovative recipes that promise a memorable dining experience.',
            vn: 'Thưởng thức thực đơn được chọn lọc kỹ lưỡng, kết hợp nguyên liệu tươi ngon và công thức sáng tạo, mang đến trải nghiệm ẩm thực khó quên.',
        },
        button: {
            en: 'View Menu',
            vn: 'Xem Thực Đơn',
        },
    },
];

export default function CarouselHome({ lang = 'en' }) {
    const navigate = useNavigate();

    return (
        <div className="carousel">
            <Carousel autoplay arrows={true} dots={false} className="homepage-carousel">
                {images.map((image, index) => (
                    <div key={index} className="carousel-item">
                        <img src={image.src} alt={`slide-${index}`} className="carousel-image" />
                        <div className="carousel-text">
                            <h2>{image.title[lang]}</h2>
                            <p>{image.description[lang]}</p>
                            <Button type="primary" className="view-menu-button" onClick={() => navigate('/product')}>
                                {image.button[lang]}
                            </Button>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
