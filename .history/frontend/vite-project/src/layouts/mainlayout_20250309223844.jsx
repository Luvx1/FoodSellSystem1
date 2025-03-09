import { Outlet } from 'react-router-dom';
import MainFooter from '../components/footer/MainFooter';
import MainHeader from '../components/header/MainHeader';
import { Flex, Layout } from 'antd';
const { Header, Footer, Content } = Layout;
import React from 'react';

const headerStyle = {
    textAlign: 'center',
    color: '#fff',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff',
};

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

export default function MainLayout() {
    return (
        <Flex gap="middle" style={{ width: '100%', fe }} wrap>
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
