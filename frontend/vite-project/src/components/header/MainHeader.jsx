import { Menu, Input, Badge } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import './MainHeader.css';
import logo from '/src/assets/image/Logo.png';
import { getCartQuantity } from '../../utils/cartUtils';
import CategoryMenu from '../categorymenu/CategoryMenu';
import Cookies from 'js-cookie';

export default function MainHeader() {
    const [cartCount, setCartCount] = useState(0);

    // Hàm cập nhật số lượng giỏ hàng
    const updateCartCount = () => {
        setCartCount(getCartQuantity());
    };

    // Theo dõi thay đổi cookies
    useEffect(() => {
        updateCartCount(); // Cập nhật lần đầu khi render

        // Kiểm tra cookies mỗi 1 giây
        const interval = setInterval(updateCartCount, 1000);

        return () => clearInterval(interval); // Cleanup khi component unmount
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
                <div className="right-icons">
                    <Input.Search placeholder="Search..." allowClear enterButton={<SearchOutlined />} />

                    {/* Hiển thị số lượng giỏ hàng */}
                    <Link to="/cart">
                        <Badge count={cartCount} showZero>
                            <ShoppingCartOutlined className="icon" />
                        </Badge>
                    </Link>

                    <Link to="/profile">
                        <UserOutlined className="icon" />
                    </Link>
                </div>
            </div>

            {/* Danh mục món ăn nằm dưới header */}
            {/* <CategoryMenu /> */}
        </>
    );
}
