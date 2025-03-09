import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Layout, Menu, Input, Badge } from 'antd';
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import MainFooter from '../components/footer/MainFooter';
import MainHeader from '../components/header/MainHeader';
import './MainLayout.css';

const { Header, Content, Footer } = Layout;

const menuItems = [
    { key: '1', label: <Link to="/">Home</Link> },
    { key: '2', label: <Link to="/profile">Menu</Link> },
    { key: '3', label: <Link to="/product">Promotions</Link> },
    { key: '4', label: <Link to="/about-us">About Us</Link> },
];

export default function MainLayout() {
    return (
        <Layout>
            {/* Header */}
            <Header style={{ backgroundColor: '#FFD700', display: 'flex', alignItems: 'center', padding: '0 20px' }}>
                <MainHeader />
                <Menu
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={menuItems}
                    style={{ flex: 1, justifyContent: 'center', backgroundColor: 'transparent', borderBottom: 'none' }}
                />
                <Input placeholder="Search..." prefix={<SearchOutlined />} style={{ width: 200, marginRight: 20 }} />
                <Badge count={2}>
                    <ShoppingCartOutlined style={{ fontSize: '24px', cursor: 'pointer' }} />
                </Badge>
            </Header>

            {/* Content */}
            <Content style={{ padding: '20px 48px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
                    <Outlet />
                </div>
            </Content>

            {/* Footer */}
            <Footer style={{ textAlign: 'center', backgroundColor: '#f8f8f8', padding: '20px' }}>
                <MainFooter />
                <p style={{ marginTop: 10 }}>© 2025 Your Company. All rights reserved.</p>
            </Footer>
        </Layout>
    );
}
