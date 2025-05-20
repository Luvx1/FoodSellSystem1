/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import {
    Table,
    Input,
    Button,
    Space,
    Typography,
    Tag,
    Modal,
    Descriptions,
    List,
    Card,
    Badge,
    message,
    Popconfirm,
} from 'antd';
import { SearchOutlined, EyeOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

export default function ManageOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [filteredInfo, setFilteredInfo] = useState({});
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [processingOrder, setProcessingOrder] = useState(false);

    // Define the order status progression
    const ORDER_STATUSES = ['pending', 'processing', 'shipping', 'delivered', 'cancelled'];

    // Process order to next status
    const handleProcessOrder = async (orderId, currentStatus) => {
        const nextStatus = getNextStatus(currentStatus);

        if (!nextStatus) {
            message.info('This order cannot be processed further.');
            return;
        }

        setProcessingOrder(true);
        try {
            await api.patch(`orders/${orderId}/status`, { status: nextStatus });
            message.success(`Order updated to ${nextStatus} successfully`);

            // Update the selected order locally to reflect changes
            if (selectedOrder && selectedOrder._id === orderId) {
                setSelectedOrder({
                    ...selectedOrder,
                    status: nextStatus,
                });
            }

            // Refresh all orders
            handleFetchAllOrders();
        } catch (error) {
            console.error(error);
            message.error('Failed to update order status');
        } finally {
            setProcessingOrder(false);
        }
    };

    // Cancel order
    // const handleCancelOrder = async (orderId) => {
    //     setProcessingOrder(true);
    //     try {
    //         await api.put(`orders/${orderId}/status`, { status: 'cancelled' });
    //         message.success('Order cancelled successfully');

    //         // Update the selected order locally to reflect changes
    //         if (selectedOrder && selectedOrder._id === orderId) {
    //             setSelectedOrder({
    //                 ...selectedOrder,
    //                 status: 'cancelled',
    //             });
    //         }

    //         // Refresh all orders
    //         handleFetchAllOrders();
    //     } catch (error) {
    //         console.error(error);
    //         message.error('Failed to cancel order');
    //     } finally {
    //         setProcessingOrder(false);
    //     }
    // };
    // Get the next status in the progression
    const getNextStatus = (currentStatus) => {
        const currentIndex = ORDER_STATUSES.indexOf(currentStatus);
        // If current status is delivered or cancelled, or not found, there's no next status
        if (currentIndex === -1 || currentStatus === 'delivered' || currentStatus === 'cancelled') {
            return null;
        }
        return ORDER_STATUSES[currentIndex + 1];
    };

    const handleFetchAllOrders = async () => {
        setLoading(true);
        try {
            const response = await api.get('orders');
            setOrders(response.data.orders);
            setLoading(false);
        } catch (error) {
            console.error(error);
            message.error('Failed to fetch orders');
            setLoading(false);
        }
    };

    useEffect(() => {
        handleFetchAllOrders();
    }, []);

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
        setFilteredInfo(filters);
    };

    // Search functionality
    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}>
                        Search
                    </Button>
                    <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                        Reset
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
        onFilter: (value, record) => {
            if (dataIndex === 'orderId') {
                return record._id.toLowerCase().includes(value.toLowerCase());
            }
            if (dataIndex === 'customerName') {
                return record.userId.name.toLowerCase().includes(value.toLowerCase());
            }
            return '';
        },
        render: (text, record) => {
            if (dataIndex === 'orderId') {
                return searchedColumn === 'orderId' ? (
                    <span style={{ fontWeight: 'bold' }}>{record._id}</span>
                ) : (
                    record._id
                );
            }
            if (dataIndex === 'customerName') {
                return searchedColumn === 'customerName' ? (
                    <span style={{ fontWeight: 'bold' }}>{record.userId.name}</span>
                ) : (
                    record.userId.name
                );
            }
            return text;
        },
    });

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText('');
    };

    const showOrderDetail = (record) => {
        setSelectedOrder(record);
        setDetailModalVisible(true);
    };

    // Status tag colors
    const getStatusColor = (status) => {
        switch (status) {
            case 'processing':
                return 'blue';
            case 'shipped':
                return 'orange';
            case 'delivered':
                return 'green';
            case 'cancelled':
                return 'red';
            default:
                return 'default';
        }
    };

    const getPaymentStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'green';
            case 'pending':
                return 'orange';
            case 'failed':
                return 'red';
            default:
                return 'default';
        }
    };

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'orderId',
            key: 'orderId',
            ...getColumnSearchProps('orderId'),
            ellipsis: true,
            render: (_, record) => <span>{record._id}</span>,
        },
        {
            title: 'Customer',
            dataIndex: 'customerName',
            key: 'customerName',
            ...getColumnSearchProps('customerName'),
            render: (_, record) => <span>{record.userId?.name || 'N/A'}</span>,
        },
        {
            title: 'Total Amount',
            dataIndex: 'totalAmount',
            key: 'totalAmount',
            sorter: (a, b) => a.totalAmount - b.totalAmount,
            render: (amount) => `${amount.toLocaleString()} đ`,
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            key: 'paymentMethod',
        },
        {
            title: 'Payment Status',
            dataIndex: 'paymentStatus',
            key: 'paymentStatus',
            filters: [
                { text: 'Paid', value: 'paid' },
                { text: 'Pending', value: 'pending' },
                { text: 'Failed', value: 'failed' },
            ],
            filteredValue: filteredInfo.paymentStatus || null,
            onFilter: (value, record) => record.paymentStatus === value,
            render: (status) => (
                <Tag color={getPaymentStatusColor(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Tag>
            ),
        },
        {
            title: 'Order Status',
            dataIndex: 'status',
            key: 'status',
            filters: [
                { text: 'Processing', value: 'processing' },
                { text: 'Shipped', value: 'shipped' },
                { text: 'Delivered', value: 'delivered' },
                { text: 'Cancelled', value: 'cancelled' },
            ],
            filteredValue: filteredInfo.status || null,
            onFilter: (value, record) => record.status === value,
            render: (status) => (
                <Tag color={getStatusColor(status)}>{status.charAt(0).toUpperCase() + status.slice(1)}</Tag>
            ),
        },
        {
            title: 'Created Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (date) => new Date(date).toLocaleString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Button type="primary" icon={<EyeOutlined />} onClick={() => showOrderDetail(record)}>
                    View Details
                </Button>
            ),
        },
    ];

    // Format date for better display
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

    return (
        <div style={{ padding: '20px' }}>
            <Title level={2}>Manage Orders</Title>

            <Table
                columns={columns}
                dataSource={orders}
                rowKey="_id"
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                bordered
                scroll={{ x: 1200 }}
            />

            {/* Order Detail Modal */}
            <Modal
                title={
                    <span>
                        Order Detail <Text type="secondary">{selectedOrder?._id}</Text>
                    </span>
                }
                open={detailModalVisible}
                onCancel={() => setDetailModalVisible(false)}
                footer={[
                    <Button
                        key="process"
                        type="primary"
                        loading={processingOrder}
                        disabled={
                            !selectedOrder ||
                            selectedOrder.status === 'delivered' ||
                            selectedOrder.status === 'cancelled' ||
                            !getNextStatus(selectedOrder?.status)
                        }
                        onClick={() => handleProcessOrder(selectedOrder._id, selectedOrder.status)}>
                        {selectedOrder && getNextStatus(selectedOrder.status)
                            ? `Process to ${
                                  getNextStatus(selectedOrder.status).charAt(0).toUpperCase() +
                                  getNextStatus(selectedOrder.status).slice(1)
                              }`
                            : 'Process Order'}
                    </Button>,
                    // selectedOrder && selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                    //     <Popconfirm
                    //         key="cancel"
                    //         title="Are you sure you want to cancel this order?"
                    //         onConfirm={() => handleCancelOrder(selectedOrder._id)}
                    //         okText="Yes"
                    //         cancelText="No">
                    //         <Button danger loading={processingOrder}>
                    //             Cancel Order
                    //         </Button>
                    //     </Popconfirm>
                    // ),
                    <Button key="close" onClick={() => setDetailModalVisible(false)}>
                        Close
                    </Button>,
                ]}
                width={800}>
                {selectedOrder && (
                    <>
                        <Descriptions bordered column={1}>
                            <Descriptions.Item label="Order ID">{selectedOrder._id}</Descriptions.Item>
                            <Descriptions.Item label="Customer">
                                {selectedOrder.userId?.name || 'N/A'} ({selectedOrder.userId?.email || 'N/A'})
                            </Descriptions.Item>
                            <Descriptions.Item label="Order Date">
                                {formatDate(selectedOrder.createdAt)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Total Amount">
                                <Text strong>{selectedOrder.totalAmount.toLocaleString()} đ</Text>
                            </Descriptions.Item>
                            <Descriptions.Item label="Payment Method">{selectedOrder.paymentMethod}</Descriptions.Item>
                            <Descriptions.Item label="Payment Status">
                                <Badge
                                    status={selectedOrder.paymentStatus === 'paid' ? 'success' : 'processing'}
                                    text={
                                        selectedOrder.paymentStatus.charAt(0).toUpperCase() +
                                        selectedOrder.paymentStatus.slice(1)
                                    }
                                />
                            </Descriptions.Item>
                            <Descriptions.Item label="Order Status">
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
                                    text={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                                />
                            </Descriptions.Item>
                        </Descriptions>

                        <Title level={4} style={{ marginTop: 20 }}>
                            Shipping Information
                        </Title>
                        <Card>
                            <Descriptions column={1}>
                                <Descriptions.Item label="Full Name">
                                    {selectedOrder.shippingAddress.fullName}
                                </Descriptions.Item>
                                <Descriptions.Item label="Address">
                                    {selectedOrder.shippingAddress.address}, {selectedOrder.shippingAddress.district},{' '}
                                    {selectedOrder.shippingAddress.city}
                                </Descriptions.Item>
                                <Descriptions.Item label="Phone Number">
                                    {selectedOrder.shippingAddress.phoneNumber}
                                </Descriptions.Item>
                                {selectedOrder.shippingAddress.notes && (
                                    <Descriptions.Item label="Notes">
                                        {selectedOrder.shippingAddress.notes}
                                    </Descriptions.Item>
                                )}
                            </Descriptions>
                        </Card>

                        <Title level={4} style={{ marginTop: 20 }}>
                            Order Items
                        </Title>
                        <List
                            bordered
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
                            footer={
                                <div style={{ textAlign: 'right' }}>
                                    <Text strong style={{ fontSize: 16 }}>
                                        Total: {selectedOrder.totalAmount.toLocaleString()} đ
                                    </Text>
                                </div>
                            }
                        />
                    </>
                )}
            </Modal>
        </div>
    );
}
