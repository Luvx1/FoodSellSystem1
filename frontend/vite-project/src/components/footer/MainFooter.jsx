import React from 'react';
import './MainFooter.css';
import { FacebookOutlined, InstagramOutlined, TwitterOutlined, LinkedinOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export default function MainFooter() {
    return (
        <div className="footer-container">
            <div className="footer-content">
                <p>© 2025 Fast Food Corporation. All Rights Reserved.</p>
                <div className="footer-links">
                    <Link to="/about-us">About Us</Link>
                    <Link to="/contact">Contact</Link>
                    <Link to="/recruit">Recruit</Link>
                    <Link to="/privacy-policy">Privacy Policy</Link>
                    <Link to="/terms-of-service">Terms of Service</Link>
                </div>
                <div className="footer-icons">
                    <Link to={{ pathname: 'https://www.instagram.com' }} target="_blank">
                        <InstagramOutlined />
                    </Link>
                    <Link to={{ pathname: 'https://www.facebook.com' }} target="_blank">
                        <FacebookOutlined />
                    </Link>
                    <Link to={{ pathname: 'https://www.twitter.com' }} target="_blank">
                        <TwitterOutlined />
                    </Link>
                    <Link to={{ pathname: 'https://www.linkedin.com' }} target="_blank">
                        <LinkedinOutlined />
                    </Link>
                </div>
            </div>
        </div>
    );
}
