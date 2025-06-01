import { Menu, Input, Badge, Avatar, Dropdown } from 'antd';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { useLanguage } from '../../LanguageContext';

export default function MainHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const cartItems = useSelector(selectCartItems);
    const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0);
    const [user, setUser] = useState(null);
    const prevUserCookieRef = useRef(null);
    const { lang, setLang } = useLanguage();

    // Add logout handler function
    const handleLogout = async () => {
        try {
            const accessToken = Cookies.get('accessToken');
            if (!accessToken) {
                // Nếu không còn token, xóa hết cookie và chuyển hướng luôn
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                Cookies.remove('user');
                navigate('/login');
                return;
            }
            const response = await api.post(
                '/auth/logout',
                { refreshToken: Cookies.get('refreshToken') },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('user');
            toast.success(response.data.message);
            setUser(null);
            navigate('/');
        } catch (error) {
            // Nếu lỗi 401, vẫn xóa cookie và chuyển hướng
            Cookies.remove('accessToken');
            Cookies.remove('refreshToken');
            Cookies.remove('user');
            navigate('/login');
        }
    };

    // Define dropdown menu items with conditional dashboard option for admin
    const getMenuItems = () => {
        const menuItems = [
            {
                key: '1',
                label: <Link to={routes.profile}>Profile</Link>,
            },
            {
                key: '2',
                label: <a onClick={handleLogout}>Log out</a>,
            },
        ];

        // Check if user is an admin (handle both possible structures)
        const isAdmin = user && (user.role === 'admin' || (user.user && user.user.role === 'admin'));

        if (isAdmin) {
            menuItems.unshift({
                key: '0',
                label: <Link to={routes.manageProduct}>Dashboard</Link>,
            });
        }

        return menuItems;
    };

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
                <nav className="custom-menu-container">
                    <Link to="/" className={location.pathname === '/' ? 'menu-link active' : 'menu-link'}>
                        {lang === 'vn' ? 'Trang chủ' : 'Home'}
                    </Link>
                    <Link to="/product" className={location.pathname.startsWith('/product') ? 'menu-link active' : 'menu-link'}>
                        {lang === 'vn' ? 'Thực đơn' : 'Menu'}
                    </Link>
                    <Link to="/promotions" className={location.pathname.startsWith('/promotions') ? 'menu-link active' : 'menu-link'}>
                        {lang === 'vn' ? 'Khuyến mãi' : 'Promotions'}
                    </Link>
                    <Link to="/about-us" className={location.pathname.startsWith('/about-us') ? 'menu-link active' : 'menu-link'}>
                        {lang === 'vn' ? 'Về chúng tôi' : 'About Us'}
                    </Link>
                </nav>

                {/* Ô chuyển đổi ngôn ngữ + Giỏ hàng + Tài khoản */}
                <div className="right-icons">
                    <div className="lang-switch">
                        <button className={`lang-btn${lang === 'vn' ? ' active' : ''}`} onClick={() => setLang('vn')} style={{ marginRight: 4 }}>VN</button>
                        <span style={{ margin: '0 4px', color: '#888' }}>|</span>
                        <button className={`lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
                    </div>

                    {/* Hiển thị số lượng giỏ hàng */}
                    <Link to="/cart">
                        <Badge count={totalCartItems} showZero>
                            <ShoppingCartOutlined className="icon" />
                        </Badge>
                    </Link>

                    {user ? (
                        <Dropdown menu={{ items: getMenuItems() }} placement="bottomRight" arrow>
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
