import React from 'react';
import { useParams } from 'react-router-dom';
import './PromotionDetail.css';
import event1 from '../../assets/image/event1.png';
import event2 from '../../assets/image/event2.jpg';
import event3 from '../../assets/image/event3.jpg';
import event4 from '../../assets/image/event6.jpg';

const promotionsData = [
    {
        id: 1,
        image: event1,
        title: 'KING DELIVERY - EXCLUSIVE COMBO',
        description: 'Thông tin chi tiết về KING DELIVERY - EXCLUSIVE COMBO.',
    },
    {
        id: 2,
        image: event2,
        title: "KING'S DAY FRIDAY - 50% PRICE COMBO",
        description: "Thông tin chi tiết về KING'S DAY FRIDAY - 50% PRICE COMBO.",
    },
    {
        id: 3,
        image: event3,
        title: 'BUY ONE GET ONE FREE!',
        description: 'Thông tin chi tiết về BUY ONE GET ONE FREE!',
    },
    { id: 4, image: event4, title: 'WHOPPER DEAL', description: 'Thông tin chi tiết về WHOPPER DEAL.' },
];

const PromotionDetail = () => {
    const { id } = useParams();
    const promo = promotionsData.find((item) => item.id === parseInt(id));

    if (!promo) {
        return <h2>Không tìm thấy chương trình khuyến mãi</h2>;
    }

    return (
        <div className="promotion-detail-container">
            <h1>{promo.title}</h1>
            <img src={promo.image} alt={promo.title} className="promo-detail-image" />
            <p>{promo.description}</p>
        </div>
    );
};

export default PromotionDetail;
