import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Promotions.css';
import event1 from '../../assets/image/event1.png';
import event2 from '../../assets/image/event2.jpg';
import event3 from '../../assets/image/event3.jpg';
import event4 from '../../assets/image/event6.jpg';

const promotionsData = [
    { id: 1, image: event1, title: 'KING DELIVERY - EXCLUSIVE COMBO' },
    { id: 2, image: event2, title: "KING'S DAY FRIDAY - 50% PRICE COMBO" },
    { id: 3, image: event3, title: 'BUY ONE GET ONE FREE!' },
    { id: 4, image: event4, title: 'WHOPPER DEAL' },
];

const Promotions = () => {
    const navigate = useNavigate();

    return (
        <div className="promotions-container">
            {promotionsData.map((promo, index) =>
                index % 2 === 0 && promotionsData[index + 1] ? (
                    <div className="promo-row" key={promo.id}>
                        <div className="promotion-card" onClick={() => navigate(`/promotion/${promo.id}`)}>
                            <img src={promo.image} alt={promo.title} className="img-fluid" />
                            <p className="promo-title">{promo.title}</p>
                        </div>
                        <div
                            className="promotion-card"
                            onClick={() => navigate(`/promotion/${promotionsData[index + 1].id}`)}>
                            <img
                                src={promotionsData[index + 1].image}
                                alt={promotionsData[index + 1].title}
                                className="img-fluid"
                            />
                            <p className="promo-title">{promotionsData[index + 1].title}</p>
                        </div>
                    </div>
                ) : null
            )}
        </div>
    );
};

export default Promotions;
