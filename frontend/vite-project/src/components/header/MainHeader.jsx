import { Menu, Input, Badge, Avatar, Dropdown } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';
import './MainHeader.css';
import logo from '/src/assets/image/Logo.png';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { selectCartItems } from '../../redux/feature/cartSlice';
import { routes } from '../../routes';

export default function MainHeader() {
    const navigate = useNavigate();
    const cartItems = useSelector(selectCartItems);
    const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const [user, setUser] = useState(null);
    const prevUserCookieRef = useRef(null);

    // Add logout handler function
    const handleLogout = async () => {
        try {
            const response = await api.post('/auth/logout', {
                refreshToken: Cookies.get('refreshToken'),
            });
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('user');
            toast.success(response.data.message);
            setUser(null);
            navigate('/');
        } catch (error) {
            console.error('Failed to log out', error);
        }
    };

    // Then define items that use the handleLogout function
    const items = [
        {
            key: '1',
            label: <Link to={routes.profile}>Profile</Link>,
        },
        {
            key: '2',
            label: <a onClick={handleLogout}>Log out</a>,
        },
    ];
    useEffect(() => {
        // Explicitly bind prevUserCookieRef to avoid scope issues
        function updateUserFromCookies() {
            const userCookie = Cookies.get('user');
            // Only update if the cookie has changed
            if (userCookie !== prevUserCookieRef.current) {
                prevUserCookieRef.current = userCookie;
                try {
                    setUser(userCookie ? JSON.parse(userCookie) : null);
                } catch (error) {
                    console.error('failed to parse user', error);
                    setUser(null);
                }
            }
        }

        // Initial update
        updateUserFromCookies();

        // Check for cookie changes periodically
        const cookieCheckInterval = setInterval(updateUserFromCookies, 1000);

        return () => clearInterval(cookieCheckInterval);
    }, []);

    return (
        <>
            {/* Header chính */}
            <div className="main-header">
                {/* Logo */}
                <div className="logo">
                    <Link to="/">
                        <img src={logo} alt="FastFood Logo" />
                    </Link>
                </div>

                {/* Menu chính */}
                <div className="menu-container">
                    <Menu
                        mode="horizontal"
                        defaultSelectedKeys={['1']}
                        items={[
                            { key: '1', label: <Link to="/">Home</Link> },
                            { key: '2', label: <Link to="/product">Menu</Link> },
                            { key: '3', label: <Link to="/promotions">Promotions</Link> },
                            { key: '4', label: <Link to="/about-us">About Us</Link> },
                        ]}
                    />
                </div>

                {/* Ô tìm kiếm + Giỏ hàng + Tài khoản */}
                {/* Ô tìm kiếm + Giỏ hàng + Tài khoản */}
                <div className="right-icons">
                    <Input.Search placeholder="Search..." allowClear enterButton={<SearchOutlined />} />

                    {/* Hiển thị số lượng giỏ hàng */}
                    <Link to="/cart">
                        <Badge count={totalCartItems} showZero>
                            <ShoppingCartOutlined className="icon" />
                        </Badge>
                    </Link>

                    {user ? (
                        <Dropdown menu={{ items }} placement="bottomRight" arrow>
                            <Avatar
                                src={
                                    user.avatar ||
                                    'https://cloud.appwrite.io/v1/storage/buckets/67dbb6420032d8a2ee8f/files/67dbcb3d26027f2e8bc1/view?project=67dbb339000bfac45e0d'
                                }
                                style={{ cursor: 'pointer' }}
                                onError={() => {
                                    return true;
                                }}
                            />
                        </Dropdown>
                    ) : (
                        <Link to={routes.login}>
                            <UserOutlined className="icon" />
                        </Link>
                    )}
                </div>
            </div>
        </>
    );
}
