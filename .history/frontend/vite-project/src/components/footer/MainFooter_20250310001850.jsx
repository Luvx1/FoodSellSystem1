import React from 'react';
import './MainFooter.css';
import { FacebookOutlined, InstagramOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export default function MainFooter() {
    return (
        <div className="footer-container">
            <p>© 2025 Fast Food Corporation. All Rights Reserved.</p>
            <div className="footer-links">
                <Link to="/about-us">About Us</Link>
                <Link to="/contact">Contact</Link>
                <Link to="/recruit">Recruit</Link>
            </div>
            <div className="footer-icons">
                <InstagramOutlined />
                <FacebookOutlined />
                <img src="/icons/x-icon.png" alt="X" className="x-icon" />
            </div>
        </div>
    );
}
