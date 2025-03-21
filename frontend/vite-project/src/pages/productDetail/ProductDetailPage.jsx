import React, { useEffect, useState } from 'react';
import { Rate, Collapse, Button, Row, Col, Spin } from 'antd';
import { BorderTopOutlined, HeartOutlined } from '@ant-design/icons';
import './ProductDetailPage.css';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, increaseQuantity, selectCartItems } from '../../redux/feature/cartSlice';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import api from '../../utils/api';
const { Panel } = Collapse;

export default function ProductDetailPage() {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const userAuth = Cookies.get('user');
    const navigate = useNavigate();

    const handleCheckLogin = () => {
        if (!userAuth) {
            toast.error('Vui lòng đăng nhập để mua hàng');
            navigate('/login');
            return false;
        }
        return true;
    };

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await api.get(`products/${id}`);
                if (response.data && response.data) {
                    const processedItems = response.data;
                    // Xử lý dữ liệu ảnh
                    // processedItems.images = processedItems.images?.split(',').map((img) => img.trim());
                    // const productData = response.data.data;
                    setProduct(processedItems);
                }
            } catch (error) {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
            }
        };

        if (id) {
            fetchProductDetail();
        }
    }, [id]);
    const handleBuyNow = () => {
        if (!handleCheckLogin()) return;
        handleAddToCart();
        navigate('/cart'); // Navigate to cart page
    };

    if (!product)
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                <Spin size="large" tip="Đang tải..." />
            </div>
        );

    const handleAddToCart = () => {
        if (!handleCheckLogin()) return;

        // Convert ID to string before adding to cart
        const productToAdd = {
            ...product,
            productId: product._id ? product._id.toString() : product._id,
            quantity, // Thêm số lượng đã chọn
        };

        // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
        const existingProduct = cartItems.find(
            (item) => item.productId && product._id && item.productId.toString() === product._id.toString()
        );

        if (existingProduct) {
            // Nếu sản phẩm đã có trong giỏ hàng, chỉ cập nhật số lượng
            dispatch(
                increaseQuantity({
                    productId: product._id.toString(),
                    quantity,
                })
            );
        } else {
            // Nếu sản phẩm chưa có, thêm sản phẩm mới vào giỏ
            dispatch(addToCart(productToAdd));
        }

        // Lưu giỏ hàng vào localStorage
        const updatedCartItems = [...cartItems];
        if (!existingProduct) {
            updatedCartItems.push(productToAdd);
        }
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

        toast.success(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
    };

    return (
        <div>
            <div style={{ maxWidth: '1100px', margin: 'auto', padding: '20px 40px', fontFamily: 'Nunito, sans-serif' }}>
                <div style={{ display: 'flex', gap: '50px' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {/* Single image display since we don't have multiple images */}
                        <div
                            style={{
                                width: '400px',
                                height: '400px',
                                minWidth: '400px',
                                minHeight: '400px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '1px solid #ddd',
                                borderRadius: '15px',
                                overflow: 'hidden',
                            }}>
                            <img
                                src={product.image}
                                alt="Product Main"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'opacity 0.3s ease-in-out',
                                    display: 'block',
                                }}
                            />
                        </div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div style={{ flex: 1 }}>
                        {/* Breadcrumb */}
                        <p style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>
                            Sản phẩm &gt; {product.category || 'Danh mục'}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h1
                                style={{
                                    fontSize: '30px',
                                    fontWeight: 'bold',
                                    marginBottom: '8px',
                                    lineHeight: '1.4',
                                    fontFamily: 'Nunito',
                                }}>
                                {product.name}
                            </h1>
                            {/* Icon yêu thích */}
                            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <HeartOutlined style={{ fontSize: '25px', color: '#333', cursor: 'pointer' }} />
                                <span style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
                                    Best seller
                                </span>
                            </div>
                        </div>

                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px', lineHeight: '1.6' }}>
                            {product.description}
                        </p>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px', lineHeight: '1.6' }}>
                            Còn {product.stocks || 10} sản phẩm
                        </p>

                        {/* Đánh giá */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Rate defaultValue={4} disabled style={{ color: '#D8959A' }} />
                            <span style={{ fontSize: '14px', color: '#666' }}>(0 đánh giá)</span>
                        </div>

                        {/* Hiển thị giá tiền */}
                        <div style={{ marginBottom: '15px' }}>
                            <div>
                                <span style={{ color: '#888', fontSize: '14px', marginRight: '4px' }}>
                                    Giá niêm yết:
                                </span>
                                <span style={{ color: '#D8959A', fontWeight: 'bold', fontSize: '26px' }}>
                                    {product.price ? `${product.price.toLocaleString()} đ` : 'Liên hệ'}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {/* Nút chọn số lượng */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    width: '120px',
                                    height: '45px',
                                    justifyContent: 'space-between',
                                }}>
                                <button
                                    onClick={() => {
                                        setQuantity((prev) => Math.max(1, prev - 1));
                                    }}
                                    style={quantityButtonStyle}>
                                    −
                                </button>
                                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>{quantity}</span>
                                <button
                                    onClick={() => {
                                        setQuantity((prev) => Math.min(product.stocks || 10, prev + 1));
                                    }}
                                    style={quantityButtonStyle}>
                                    +
                                </button>
                            </div>

                            <Button
                                type="default"
                                style={{
                                    backgroundColor: 'white',
                                    borderColor: '#D8959A',
                                    color: '#D8959A',
                                    width: '40%',
                                    height: '45px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                }}
                                onClick={handleAddToCart}>
                                Thêm vào giỏ
                            </Button>

                            <Button
                                type="primary"
                                style={{
                                    backgroundColor: '#D8959A',
                                    borderColor: '#D8959A',
                                    width: '40%',
                                    height: '45px',
                                    fontSize: '16px',
                                    cursor: 'pointer',
                                }}
                                onClick={handleBuyNow}>
                                Mua ngay
                            </Button>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            {/* Thông tin sản phẩm (Collapse) */}
                            <Collapse expandIconPosition="end" style={{ border: 'none', background: 'transparent' }}>
                                <Panel
                                    header={
                                        <span style={{ fontWeight: 'bold', color: '#a06f6f', fontSize: '20px' }}>
                                            Chi tiết
                                        </span>
                                    }
                                    key="1">
                                    <p style={{ lineHeight: '1.6' }}>{product.description}</p>
                                </Panel>
                            </Collapse>
                        </div>
                    </div>
                </div>

                {/* Phần công dụng */}
                <div style={{ marginTop: '50px' }}>
                    <div style={{ backgroundColor: '#F6EEF0', borderRadius: '30px', padding: '20px' }}>
                        <Row gutter={[20, 20]} style={{ marginLeft: '0', marginRight: '0' }}>
                            <Col
                                xs={24}
                                md={12}
                                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img
                                    src={product.image}
                                    alt="Product"
                                    style={{ width: '100%', height: '350px', borderRadius: '20px', objectFit: 'cover' }}
                                />
                            </Col>
                            <Col
                                xs={24}
                                md={12}
                                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <div style={{ width: '80%', padding: '0 50px' }}>
                                    <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
                                        Thông tin sản phẩm
                                    </h2>
                                    <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                        {product.description || 'Không có thông tin mô tả.'}
                                    </p>
                                    <p style={{ fontSize: '16px', lineHeight: '1.6', marginTop: '10px' }}>
                                        <strong>Danh mục:</strong> {product.category}
                                    </p>
                                    <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                        <strong>Ngày thêm:</strong> {new Date(product.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Style cho nút chọn số lượng
const quantityButtonStyle = {
    width: '35px',
    height: '35px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '18px',
    backgroundColor: 'transparent',
    color: '#777',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
};
