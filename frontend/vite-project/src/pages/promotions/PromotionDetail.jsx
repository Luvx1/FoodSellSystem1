import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PromotionDetail.css';
import event1 from '../../assets/image/event1.png';
import event2 from '../../assets/image/event2.jpg';
import event3 from '../../assets/image/event3.jpg';
import event4 from '../../assets/image/event6.jpg';
import { useLanguage } from '../../LanguageContext';

const promotionsData = [
    {
        id: 1,
        image: event1,
        title: 'KING DELIVERY - EXCLUSIVE COMBO',
        description: 'Details about KING DELIVERY - EXCLUSIVE COMBO.',
    },
    {
        id: 2,
        image: event2,
        title: "KING'S DAY FRIDAY - 50% PRICE COMBO",
        description: " Details about KING'S DAY FRIDAY - 50% PRICE COMBO.",
    },
    {
        id: 3,
        image: event3,
        title: 'BUY ONE GET ONE FREE!',
        description: 'Details about BUY ONE GET ONE FREE!',
    },
    { id: 4, image: event4, title: 'WHOPPER DEAL', description: 'WHOPPER DEAL details.' },
];

const PromotionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { lang } = useLanguage();
    const promo = promotionsData.find((item) => item.id === parseInt(id));

    const backText = {
        en: 'Back',
        vn: 'Quay lại',
    };

    if (!promo) {
        return <h2>Không tìm thấy chương trình khuyến mãi</h2>;
    }

    return (
        <div className="promotion-detail-container">
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button
                    style={{ marginBottom: 24, padding: '8px 20px', borderRadius: 6, border: '1px solid #ff9800', background: '#fff3e0', color: '#d35400', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => navigate('/promotions')}
                >
                    &#8592; {backText[lang]}
                </button>
            </div>
            <h1>{promo.title}</h1>
            <img src={promo.image} alt={promo.title} className="promo-detail-image" />
            <p>{promo.description}</p>
        </div>
    );
};

export default PromotionDetail;
