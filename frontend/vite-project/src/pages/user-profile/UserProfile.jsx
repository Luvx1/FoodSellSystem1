import React, { useEffect, useState } from 'react';
import './UserProfile.css';

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div className="user-profile">
            <div className="profile-header">
                <img src="/path/to/avatar.png" alt="User Avatar" className="avatar" />
                <h2>{user.username}</h2>
                <p>{user.email}</p>
            </div>
            <div className="profile-details">
                <h3>Profile Details</h3>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                {/* Thêm các thông tin khác của người dùng nếu cần */}
            </div>
        </div>
    );
};

export default UserProfile;