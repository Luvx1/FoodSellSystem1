import React from 'react';
import { Outlet } from 'react-router-dom';
import { Breadcrumb, Layout, theme } from 'antd';
import MainFooter from '../components/footer/MainFooter';
import MainHeader from '../components/header/MainHeader';
import './MainLayout.css';

const { Content, Footer } = Layout;

export default function MainLayout() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout className="main-layout">
            {/* Header */}
            <MainHeader />

            {/* Content */}
            <Content className="main-content">
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
