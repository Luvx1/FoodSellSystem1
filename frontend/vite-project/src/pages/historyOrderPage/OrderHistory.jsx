import { useEffect, useState } from 'react';
import api from '../../utils/api';
import {
    Table,
    Input,
    Card,
    Typography,
    Tag,
    Button,
    Space,
    Modal,
    List,
    Descriptions,
    Badge,
    Divider,
    Empty,
    Select,
} from 'antd';
import { SearchOutlined, EyeOutlined, FilterOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    const ORDER_STATUSES = ['pending', 'processing', 'shipping', 'delivered', 'cancelled'];

    const handleFetchOrderHistory = async () => {
        setLoading(true);
        try {
            const response = await api.get('orders/user/history');
            setOrders(response.data.orders);
            setFilteredOrders(response.data.orders);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };
    const handleFilters = () => {
        let result = [...orders];

        // Apply search text filter
        if (searchText) {
            result = result.filter(
                (order) =>
                    order._id.toLowerCase().includes(searchText.toLowerCase()) ||
                    order.shippingAddress.fullName.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        // Apply status filter
        if (statusFilter !== 'all') {
            result = result.filter((order) => order.status === statusFilter);
        }

        setFilteredOrders(result);
    };

    useEffect(() => {
        handleFetchOrderHistory();
    }, []);

    // Search functionality
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchText(value);

        // Apply both filters when search changes
        handleFilters();
    };

    const handleStatusFilter = (value) => {
        setStatusFilter(value);

        // Apply both filters when status filter changes
        handleFilters();
    };
    useEffect(() => {
        handleFilters();
    }, [searchText, statusFilter, orders]);

    // Status tag colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'default';
            case 'processing':
                return 'blue';
            case 'shipping':
                return 'orange';
            case 'delivered':
                return 'green';
            case 'cancelled':
                return 'red';
            default:
                return 'default';
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    // View order details
    const showOrderDetail = (order) => {
        setSelectedOrder(order);
        setDetailModalVisible(true);
    };

    // Generate columns for the table
    const columns = [
        {
            title: 'Order ID',
            dataIndex: '_id',
            key: '_id',
            ellipsis: true,
            render: (id) => <span style={{ fontFamily: 'monospace' }}>{id}</span>,
        },
        {
            title: 'Customer',
            dataIndex: 'shippingAddress',
            key: 'customer',
            render: (shippingAddress) => shippingAddress.fullName,
        },
        {
            title: 'Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
            defaultSortOrder: 'descend',
            render: (date) => formatDate(date),
        },
        {
            title: 'Total',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            render: (amount) => <Text strong>{amount.toLocaleString()} đ</Text>,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <Tag color={getStatusColor(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Tag>
            ),
        },
        {
            title: 'Payment',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button type="primary" icon={<EyeOutlined />} onClick={() => showOrderDetail(record)}>
                    View
                </Button>
            ),
        },
    ];

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Card>
                <Title level={2}>My Orders</Title>

                <div style={{ display: 'flex', marginBottom: '20px', gap: '10px', flexWrap: 'wrap' }}>
                    <Input
                        placeholder="Search by Order ID or Customer Name"
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={handleSearch}
                        style={{ width: 300 }}
                        allowClear
                    />

                    <Select
                        placeholder="Filter by Status"
                        style={{ width: 200 }}
                        value={statusFilter}
                        onChange={handleStatusFilter}
                        suffixIcon={<FilterOutlined />}>
                        <Option value="all">All Statuses</Option>
                        {ORDER_STATUSES.map((status) => (
                            <Option key={status} value={status}>
                                <Space>
                                    <Badge color={getStatusColor(status)} />
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Space>
                            </Option>
                        ))}
                    </Select>

                    {(searchText || statusFilter !== 'all') && (
                        <Button
                            onClick={() => {
                                setSearchText('');
                                setStatusFilter('all');
                            }}>
                            Clear Filters
                        </Button>
                    )}
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredOrders}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50'],
                    }}
                    locale={{ emptyText: <Empty description="No orders found" /> }}
                />
            </Card>

            {/* Order Detail Modal */}
            <Modal
                title={<span>Order Details</span>}
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        Close
                    </Button>,
                ]}
                width={800}>
                {selectedOrder && (
                    <>
                        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <Text strong>Order ID: </Text>
                                <Text code>{selectedOrder._id}</Text>
                            </div>
                            <div>
                                <Text strong>Date: </Text>
                                <Text>{formatDate(selectedOrder.createdAt)}</Text>
                            </div>
                        </div>

                        <Card title="Order Status" style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <Badge
                                        status={
                                            selectedOrder.status === 'delivered'
                                                ? 'success'
                                                : selectedOrder.status === 'processing'
                                                ? 'processing'
                                                : selectedOrder.status === 'shipping'
                                                ? 'warning'
                                                : selectedOrder.status === 'cancelled'
                                                ? 'error'
                                                : 'default'
                                        }
                                        text={
                                            selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)
                                        }
                                    />
                                </div>
                                <div>
                                    <Badge
                                        status={selectedOrder.paymentStatus === 'paid' ? 'success' : 'processing'}
                                        text={`Payment: ${
                                            selectedOrder.paymentStatus.charAt(0).toUpperCase() +
                                            selectedOrder.paymentStatus.slice(1)
                                        }`}
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card title="Shipping Information" style={{ marginBottom: '20px' }}>
                            <Descriptions column={1}>
                                <Descriptions.Item label="Full Name">
                                    {selectedOrder.shippingAddress.fullName}
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone">
                                    {selectedOrder.shippingAddress.phoneNumber}
                                </Descriptions.Item>
                                <Descriptions.Item label="Address">
                                    {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.district},{' '}
                                    {selectedOrder.shippingAddress.city}
                                </Descriptions.Item>
                                {selectedOrder.shippingAddress.notes && (
                                    <Descriptions.Item label="Notes">
                                        {selectedOrder.shippingAddress.notes}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        </Card>

                        <Card title="Order Items">
                            <List
                                dataSource={selectedOrder.items}
                                renderItem={(item) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={item.name}
                                            description={`${item.quantity} x ${item.price.toLocaleString()} đ`}
                                        />
                                        <div>
                                            <Text strong>{(item.quantity * item.price).toLocaleString()} đ</Text>
                                        </div>
                                    </List.Item>
                                )}
                            />

                            <Divider />

                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text>Payment Method:</Text>
                                <Text>{selectedOrder.paymentMethod}</Text>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <Title level={4}>Total:</Title>
                                <Title level={4}>{selectedOrder.totalAmount.toLocaleString()} đ</Title>
                            </div>
                        </Card>
                    </>
                )}
            </Modal>
        </div>
    );
}
