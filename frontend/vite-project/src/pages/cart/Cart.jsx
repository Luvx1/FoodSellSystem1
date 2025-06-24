import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';
import { routes } from '../../routes';
import { decreaseQuantity, increaseQuantity, removeFromCart, selectCartItems } from '../../redux/feature/cartSlice';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';
import { Button, ConfigProvider, Table, Typography, Empty } from 'antd';
const { Text } = Typography;

const Cart = () => {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const navigate = useNavigate();

    console.log('Cart Items:', cartItems);

    const totalAmount =
        cartItems.length > 0
            ? cartItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0)
            : 0;

    const columns = [
        {
            title: 'Sản phẩm',
            dataIndex: 'image',
            key: 'image',
            render: (_, record) => (
                <div className="table-col-name">
                    <div className="table-col-name-img">
                        <img
                            src={record.image || 'https://via.placeholder.com/100'}
                            alt={record.name || 'Product Image'}
                            onError={(e) => {
                                console.error(`Failed to load image: ${record.image}`);
                                e.target.src = 'https://via.placeholder.com/100';
                            }}
                            style={{
                                width: '100%',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                            }}
                        />
                    </div>
                    <div className="table-col-name-content">
                        <div style={{ color: '#888', fontSize: '14px', marginBottom: '4px' }}>{record.category}</div>
                        <Text strong style={{ fontSize: '16px' }}>
                            {record.name || 'Unnamed Product'}
                        </Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: '13px', lineHeight: '1.4', marginTop: '4px' }}>
                            {record.description}
                        </Text>
                    </div>
                </div>
            ),
            width: '40%',
        },
        {
            title: 'Giá tiền',
            dataIndex: 'price',
            key: 'price',
            render: (price) => (
                <Text className="font-bold" style={{ color: '#d8959a' }}>
                    {(price || 0).toLocaleString()} đ
                </Text>
            ),
            width: '20%',
            align: 'center',
        },
        {
            title: 'Số lượng',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (quantity, record) => (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                    <Button
                        size="small"
                        onClick={() => dispatch(decreaseQuantity({ productId: record.productId }))}
                        disabled={quantity <= 1}
                        style={{ borderColor: '#d8959a', color: '#d8959a' }}>
                        -
                    </Button>
                    <Text style={{ margin: '0 8px', fontWeight: 500 }}>{quantity || 0}</Text>
                    <Button
                        size="small"
                        onClick={() => dispatch(increaseQuantity({ productId: record.productId }))}
                        style={{ borderColor: '#d8959a', color: '#d8959a' }}>
                        +
                    </Button>
                </div>
            ),
            width: '15%',
            align: 'center',
        },
        {
            title: 'Thành tiền',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            render: (_, record) => (
                <Text className="font-bold" style={{ color: '#d8959a', fontSize: '16px' }}>
                    {((record.price || 0) * (record.quantity || 0)).toLocaleString()} đ
                </Text>
            ),
            width: '20%',
            align: 'center',
        },
        {
            title: 'Xoá',
            render: (_, record) => (
                <RiDeleteBinLine
                    onClick={() => dispatch(removeFromCart({ productId: record.productId }))}
                    size={22}
                    color="#D8959A"
                    className="button-delete"
                    style={{ transition: 'transform 0.2s', cursor: 'pointer' }}
                    onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
                    onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
            ),
            width: '5%',
            align: 'center',
        },
    ];

    const customEmpty = () => (
        <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
                <div style={{ padding: '20px 0' }}>
                    <p style={{ fontSize: '16px', color: '#888' }}>Giỏ hàng trống</p>
                    <Button
                        type="primary"
                        style={{ backgroundColor: '#d8959a', borderColor: '#d8959a', marginTop: '10px' }}
                        onClick={() => navigate(routes.product)}>
                        Tiếp tục mua sắm
                    </Button>
                </div>
            }
        />
    );

    return (
        <Container>
            <div style={{ marginBottom: '5%', marginTop: '30px' }}>
                <div className="cart-title" style={{ marginBottom: '20px' }}>
                    <h3 className="font-bold" style={{ margin: 0 }}>
                        Giỏ hàng
                    </h3>
                    <span style={{ color: '#888', alignSelf: 'center' }}>({cartItems.length} sản phẩm)</span>
                </div>
                <div className="cart-div">
                    <Row>
                        <Col lg={8} md={12} sm={12} style={{ marginBottom: '30px' }}>
                            <ConfigProvider
                                theme={{
                                    components: {
                                        Table: {
                                            headerBg: '#f8f0f1',
                                            headerColor: '#333',
                                            borderColor: '#f0d0d3',
                                            rowHoverBg: '#faf6f6',
                                        },
                                    },
                                }}>
                                <Table
                                    className="table-cart"
                                    dataSource={cartItems}
                                    columns={columns}
                                    pagination={false}
                                    locale={{ emptyText: customEmpty() }}
                                    style={{
                                        borderRadius: '8px',
                                        overflow: 'hidden',
                                        boxShadow: '0 0 15px rgba(0,0,0,0.05)',
                                    }}
                                />
                            </ConfigProvider>
                        </Col>
                        <Col lg={4} md={12} sm={12}>
                            <div
                                className="cart-receipt"
                                style={{
                                    borderRadius: '10px',
                                    padding: '20px',
                                    boxShadow: '0 0 15px rgba(0,0,0,0.05)',
                                    backgroundColor: '#fff',
                                }}>
                                <div className="cart-receipt-main">
                                    <div className="cart-receipt-main-title" style={{ marginBottom: '20px' }}>
                                        <p style={{ fontWeight: 600, fontSize: '22px', color: '#333' }}>
                                            Hoá đơn của bạn
                                        </p>
                                    </div>
                                    <div className="cart-receipt-main-content">
                                        <div
                                            className="cart-receipt-main-content-part"
                                            style={{ marginBottom: '12px' }}>
                                            <p style={{ color: '#555' }}>Tạm tính: </p>
                                            <span className="font-bold" style={{ fontSize: '18px', color: '#333' }}>
                                                {totalAmount.toLocaleString()} đ
                                            </span>
                                        </div>
                                        <div
                                            className="cart-receipt-main-content-part"
                                            style={{ marginBottom: '12px' }}>
                                            <p style={{ color: '#555' }}>Giảm giá </p>
                                            <span className="font-bold" style={{ fontSize: '18px', color: '#0caa0c' }}>
                                                -0 đ
                                            </span>
                                        </div>
                                        <div
                                            className="cart-receipt-main-content-part"
                                            style={{ marginBottom: '15px' }}>
                                            <p style={{ fontSize: '13px', color: '#888', fontStyle: 'italic' }}>
                                                Vui lòng kiểm tra giỏ hàng trước khi thanh toán
                                            </p>
                                        </div>
                                        <div
                                            className="cart-receipt-main-content-part-total"
                                            style={{ padding: '15px 0' }}>
                                            <p style={{ fontSize: '18px', fontWeight: 500, color: '#333' }}>
                                                Tổng cộng:{' '}
                                            </p>
                                            <span className="font-bold" style={{ fontSize: '20px', color: '#d8959a' }}>
                                                {totalAmount.toLocaleString()} đ
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <Link to={routes.checkout}>
                                    <button
                                        className="cart-receipt-button"
                                        onClick={() => navigate(routes.checkout)}
                                        disabled={cartItems.length === 0}
                                        style={{
                                            marginTop: '20px',
                                            borderRadius: '8px',
                                            padding: '12px',
                                            fontSize: '18px',
                                            fontWeight: 600,
                                            transition: 'all 0.3s',
                                            boxShadow: '0 4px 8px rgba(216, 149, 154, 0.3)',
                                            cursor: cartItems.length === 0 ? 'not-allowed' : 'pointer',
                                            opacity: cartItems.length === 0 ? 0.6 : 1,
                                        }}
                                        onMouseOver={(e) => {
                                            if (cartItems.length > 0) {
                                                e.currentTarget.style.backgroundColor = '#c27e82';
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 6px 12px rgba(216, 149, 154, 0.4)';
                                            }
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = '#d8959a';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(216, 149, 154, 0.3)';
                                        }}>
                                        Tiến hành đặt hàng
                                    </button>
                                </Link>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </Container>
    );
};

export default Cart;
