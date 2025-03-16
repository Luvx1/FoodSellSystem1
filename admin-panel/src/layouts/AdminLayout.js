import { Layout, Menu } from 'antd';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { key: '/admin', label: 'Dashboard', icon: <DashboardOutlined /> },
    { key: '/admin/users', label: 'Users', icon: <UserOutlined /> },
    { key: '/admin/products', label: 'Products', icon: <AppstoreOutlined /> },
    { key: '/admin/orders', label: 'Orders', icon: <ShoppingCartOutlined /> },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div className="logo" style={{ color: 'white', textAlign: 'center', padding: '16px' }}>
          Admin Panel
        </div>
        <Menu
          theme="dark"
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems.map(({ key, label, icon }) => ({
            key,
            icon,
            label,
            onClick: () => navigate(key),
          }))}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0, textAlign: 'center', fontWeight: 'bold' }}>
          Admin Dashboard
        </Header>
        <Content style={{ margin: '16px', padding: '24px', background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
