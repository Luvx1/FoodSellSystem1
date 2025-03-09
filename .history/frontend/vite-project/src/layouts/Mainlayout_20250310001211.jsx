import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import MainFooter from '../components/footer/MainFooter';
import MainHeader from '../components/header/MainHeader';
import './MainLayout.css';

const { Header, Content, Footer } = Layout;

const menuItems = [
    { key: '1', label: <Link to="/">Home</Link> },
    { key: '2', label: <Link to="/menu">Menu</Link> },
    { key: '3', label: <Link to="/promotions">Promotions</Link> },
    { key: '4', label: <Link to="/about-us">About Us</Link> },
];

export default function MainLayout() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout className="main-layout">
            {/* Header */}
            <Header className="main-header">
                <MainHeader />
                <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['1']} items={menuItems} />
            </Header>

            {/* Content */}
            <Content className="main-content">
                <Breadcrumb items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]} className="breadcrumb" />
                <div
                    className="content-container"
                    style={{ background: colorBgContainer, borderRadius: borderRadiusLG }}>
                    <Outlet />
                </div>
            </Content>

            {/* Footer */}
            <Footer className="main-footer">
                <MainFooter />
            </Footer>
        </Layout>
    );
}
