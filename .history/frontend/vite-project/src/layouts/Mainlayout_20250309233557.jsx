import { Outlet } from 'react-router-dom';
import MainFooter from '../components/footer/MainFooter';
import MainHeader from '../components/header/MainHeader';
import { Layout } from 'antd';
import React from 'react';

const { Header, Footer, Content } = Layout;

const headerStyle = {
    textAlign: 'center',
    height: 64,
    paddingInline: 48,
    lineHeight: '64px',
    backgroundColor: '#4096ff', // Thêm màu nền nếu cần
};

const contentStyle = {
    textAlign: 'center',
    minHeight: 'calc(100vh - 128px)', // Để content chiếm phần còn lại của màn hình
    padding: '20px 50px', // Thêm padding để nội dung không bị sát lề
};

const footerStyle = {
    textAlign: 'center',
    backgroundColor: '#f0f2f5',
    padding: '10px 0',
};

const layoutStyle = {
    minHeight: '100vh', // Đảm bảo layout chiếm toàn bộ chiều cao màn hình
    overflow: 'hidden',
};

export default function MainLayout() {
    return (
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
    );
}
