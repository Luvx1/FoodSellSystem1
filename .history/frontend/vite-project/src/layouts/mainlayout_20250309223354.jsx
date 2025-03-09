import { Outlet } from 'react-router-dom';
import MainFooter from '../components/footer/MainFooter';
import MainHeader from '../components/header/MainHeader';
import { Flex, Layout } from 'antd';

export default function MainLayout() {
    return (
        <Flex gap="middle" wrap>
            <Layout style={layoutStyle}>
                <Header style={headerStyle}>Header</Header>
                <Content style={contentStyle}>Content</Content>
                <Footer style={footerStyle}>Footer</Footer>
            </Layout>
            <MainHeader />
            <div className="main-content">
                <Outlet />
            </div>
            <MainFooter />
        </Flex>
    );
}
