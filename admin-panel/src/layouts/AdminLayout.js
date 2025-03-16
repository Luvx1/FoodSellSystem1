import React from "react";
import { Layout, Menu } from "antd";
import { DashboardOutlined, UserOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Header, Sider, Content } = Layout;

const AdminLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <div className="logo" style={{ height: 50, color: "#fff", textAlign: "center", padding: 10 }}>
          Admin Panel
        </div>
        <Menu theme="dark" mode="inline">
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/admin">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2" icon={<UserOutlined />}>
            <Link to="/admin/users">Users</Link>
          </Menu.Item>
          <Menu.Item key="3" icon={<ShoppingCartOutlined />}>
            <Link to="/admin/products">Products</Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>Admin Dashboard</Header>
        <Content style={{ margin: "16px", padding: 24, background: "#fff" }}>{children}</Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
