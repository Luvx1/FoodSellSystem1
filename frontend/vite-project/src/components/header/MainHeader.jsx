import { Menu, Input } from 'antd';
import { Link } from 'react-router-dom';
import { UserOutlined, ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import './MainHeader.css';
import logo from '/src/assets/image/Logo.png';
import CategoryMenu from '../categorymenu/CategoryMenu';

export default function MainHeader() {
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
                    <Link to="/cart">
                        <ShoppingCartOutlined className="icon" />
                    </Link>
                    <Link to="/profile">
                        <UserOutlined className="icon" />
                    </Link>
                </div>
            </div>

            {/* Danh mục món ăn nằm dưới header */}
            <CategoryMenu />
        </>
    );
}
