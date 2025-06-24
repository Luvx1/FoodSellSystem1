import { useEffect, useState } from 'react';
import { Table, Input, Button, Space, Typography, Popconfirm, message, Tag, Card } from 'antd';
import { SearchOutlined, DeleteOutlined, UserOutlined, MailOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredUsers, setFilteredUsers] = useState([]);
    const navigate = useNavigate();

    // Fetch all users
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await api.get('auth/all-users');
            setUsers(res.data.users || []);
            setFilteredUsers(res.data.users || []);
        } catch (err) {
            setUsers([]);
            setFilteredUsers([]);
            message.error('Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Search handler
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);
        setFilteredUsers(
            users.filter(
                (u) =>
                    u.name?.toLowerCase().includes(value) ||
                    u.email?.toLowerCase().includes(value) ||
                    u.username?.toLowerCase().includes(value)
            )
        );
    };

    // Delete user
    const handleDelete = async (id) => {
        try {
            await api.delete(`auth/${id}`);
            message.success('User deleted');
            fetchUsers();
        } catch (err) {
            message.error('Failed to delete user');
        }
    };

    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            width: 60,
            render: (_, __, idx) => idx + 1,
        },
        {
            title: 'Full Name',
            dataIndex: 'name',
            key: 'name',
            render: (name) => (
                <span><UserOutlined style={{ color: '#ff9800', marginRight: 6 }} />{name}</span>
            ),
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
            render: (username) => username || <Tag color="gray">N/A</Tag>,
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            render: (email) => (
                <span><MailOutlined style={{ color: '#00bcd4', marginRight: 6 }} />{email}</span>
            ),
        },
        {
            title: 'Joined Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date) => new Date(date).toLocaleString('vi-VN'),
        },
        {
            title: 'Delete',
            key: 'delete',
            width: 80,
            render: (_, record) => (
                <Popconfirm
                    title="Are you sure to delete this user?"
                    onConfirm={() => handleDelete(record._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button danger icon={<DeleteOutlined />} size="small" />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{ padding: 24, background: '#f8fafc', minHeight: '100vh' }}>
            <Button
                onClick={() => navigate('/manage-product')}
                style={{
                    marginBottom: 16,
                    borderRadius: 8,
                    fontWeight: 600,
                    background: '#fff3e0',
                    color: '#d35400',
                    border: '1px solid #ff9800',
                }}
                icon={<ArrowLeftOutlined />}
            >
                Back
            </Button>
            <Title level={2} style={{ marginBottom: 24, color: '#222', fontWeight: 800 }}>Manage Users</Title>
            <Card style={{ borderRadius: 16, boxShadow: '0 2px 12px #e0e7ef' }}>
                <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-end' }}>
                    <Input
                        placeholder="Search by name, email, username..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={handleSearch}
                        style={{ width: 320 }}
                        allowClear
                    />
                </div>
                <Table
                    columns={columns}
                    dataSource={filteredUsers.map((u, idx) => ({ ...u, key: u._id, stt: idx + 1 }))}
                    loading={loading}
                    bordered
                    pagination={{ pageSize: 10 }}
                    scroll={{ x: 900 }}
                />
            </Card>
        </div>
    );
} 