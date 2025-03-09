import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import MainFooter from '../components/footer/MainFooter';
import MainHeader from '../components/header/MainHeader';

const { Header, Content, Footer } = Layout;

const menuItems = [
    { key: '1', label: <Link to="/">Home</Link> },
    { key: '2', label: <Link to="/profile">Menu</Link> },
    { key: '3', label: <Link to="/product">Promotions</Link> },
    { key: '4', label: <Link to="/promotions">Promotions</Link> },
];

export default function MainLayout() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            {/* Header */}
            <Header style={{ display: 'flex', alignItems: 'center' }}>
                <MainHeader /> {/* Thêm dòng này */}
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['1']}
                    items={menuItems}
                    style={{ flex: 1, minWidth: 0 }}
                />
            </Header>

            {/* Content */}
            <Content style={{ padding: '0 48px' }}>
                <Breadcrumb
                    items={[{ title: 'Home' }, { title: 'List' }, { title: 'App' }]}
                    style={{ margin: '16px 0' }}
                />
                <div
                    style={{
                        background: colorBgContainer,
                        minHeight: 280,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                    }}>
                    <Outlet />
                </div>
            </Content>

            {/* Footer */}
            <Footer style={{ textAlign: 'center' }}>
                <MainFooter />
            </Footer>
        </Layout>
    );
}
