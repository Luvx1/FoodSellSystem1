import { Outlet } from 'react-router-dom';
import MainFooter from '../components/footer/MainFooter';
import MainHeader from '../components/header/MainHeader';
import { Flex, Layout } from 'antd';
const { Header, Footer, Content } = Layout;
import React from 'react';



export default function MainLayout() {
    const contentStyle = {
        textAlign: 'center',
        minHeight: 120,
        lineHeight: '120px',
        color: '#fff',
        backgroundColor: '#0958d9',
    };
    const footerStyle = {
        textAlign: 'center',
        color: '#fff',
        backgroundColor: '#4096ff',
    };

    const layoutStyle = {
        borderRadius: 8,
        overflow: 'hidden',
        width: 'calc(50% - 8px)',
        maxWidth: 'calc(50% - 8px)',
    };

    return (
        <Flex gap="middle" wrap>
            <Layout style={layoutStyle}>
                <Header style={headerStyle}>
                    <MainHeader />
                </Header>
                <Content style={contentStyle}>
                    <div className="main-content">
                        <Outlet />
                    </div>
                </Content>
                <Footer style={footerStyle}>
                    <MainFooter />
                </Footer>
            </Layout>
        </Flex>
    );
}
