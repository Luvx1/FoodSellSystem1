import React from 'react';
import './Profile.css';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    return (
        <div className="profile-container">
            <button className="submit-button" style={{marginTop: '20px'}} onClick={() => navigate('/history-order')}>
                History Order
            </button>
        </div>
    );
};

export default Profile;
