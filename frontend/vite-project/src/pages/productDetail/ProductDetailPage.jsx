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
import { useLanguage } from '../../LanguageContext';
const { Panel } = Collapse;

export default function ProductDetailPage() {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const { id } = useParams();
    const { lang } = useLanguage();

    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const userAuth = Cookies.get('user');
    const navigate = useNavigate();

    const detailText = {
        en: {
            breadcrumb: 'Product',
            category: 'Category',
            bestSeller: 'Best seller',
            inStock: (n) => `${n} in stock`,
            addToCart: 'Add to Cart',
            buyNow: 'Buy Now',
            listedPrice: 'Listed price:',
            contact: 'Contact',
            detail: 'Detail',
            info: 'Product Information',
            noDesc: 'No description available.',
            categoryLabel: 'Category:',
            createdAt: 'Created at:',
            rating: '(0 reviews)',
            loading: 'Loading...',
            loginToBuy: 'Please log in to buy',
        },
        vn: {
            breadcrumb: 'Sản phẩm',
            category: 'Danh mục',
            bestSeller: 'Bán chạy',
            inStock: (n) => `Còn ${n} sản phẩm`,
            addToCart: 'Thêm vào giỏ',
            buyNow: 'Mua ngay',
            listedPrice: 'Giá niêm yết:',
            contact: 'Liên hệ',
            detail: 'Chi tiết',
            info: 'Thông tin sản phẩm',
            noDesc: 'Không có thông tin mô tả.',
            categoryLabel: 'Danh mục:',
            createdAt: 'Ngày thêm:',
            rating: '(0 đánh giá)',
            loading: 'Đang tải...',
            loginToBuy: 'Vui lòng đăng nhập để mua hàng',
        },
    };

    const backText = {
        en: 'Back',
        vn: 'Quay lại',
    };

    const handleCheckLogin = () => {
        if (!userAuth) {
            toast.error(detailText[lang].loginToBuy);
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
                <Spin size="large" tip={detailText[lang].loading} />
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
        <div className="product-detail-container">
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <button
                    style={{ marginBottom: 24, padding: '8px 20px', borderRadius: 6, border: '1px solid #ff9800', background: '#fff3e0', color: '#d35400', fontWeight: 600, cursor: 'pointer' }}
                    onClick={() => navigate('/product')}
                >
                    &#8592; {backText[lang]}
                </button>
            </div>
            <div style={{ maxWidth: '1100px', margin: 'auto', padding: '20px 40px', fontFamily: 'Nunito, sans-serif' }}>
                <div style={{ display: 'flex', gap: '50px' }}>
                    <div style={{ display: 'flex', gap: '20px' }}>
                        {/* Single image display since we don't have multiple images */}
                        <div className="product-detail-image-box">
                            <img
                                src={product.image}
                                alt="Product Main"
                            />
                        </div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="product-detail-info" style={{ flex: 1 }}>
                        {/* Breadcrumb */}
                        <p style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>
                            {detailText[lang].breadcrumb} &gt; {product.category || detailText[lang].category}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <h1 className="product-detail-title">
                                {product.name}
                            </h1>
                            {/* Icon yêu thích */}
                            <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <HeartOutlined style={{ fontSize: '25px', color: '#333', cursor: 'pointer' }} />
                                <span className="product-detail-best-seller">
                                    {detailText[lang].bestSeller}
                                </span>
                            </div>
                        </div>

                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px', lineHeight: '1.6' }}>
                            {product.description}
                        </p>
                        <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px', lineHeight: '1.6' }}>
                            {detailText[lang].inStock(product.stocks || 10)}
                        </p>

                        {/* Đánh giá */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                            <Rate defaultValue={4} disabled style={{ color: '#D8959A' }} />
                            <span style={{ fontSize: '14px', color: '#666' }}>{detailText[lang].rating}</span>
                        </div>

                        {/* Hiển thị giá tiền */}
                        <div style={{ marginBottom: '15px' }}>
                            <div>
                                <span style={{ color: '#888', fontSize: '14px', marginRight: '4px' }}>
                                    {detailText[lang].listedPrice}
                                </span>
                                <span className="product-detail-price">
                                    {product.price ? `${product.price.toLocaleString()} đ` : detailText[lang].contact}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            {/* Nút chọn số lượng */}
                            <div className="product-detail-quantity-box">
                                <button
                                    className="product-detail-quantity-btn"
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                >
                                    -
                                </button>
                                <span style={{ fontWeight: 'bold', fontSize: '18px' }}>{quantity}</span>
                                <button
                                    className="product-detail-quantity-btn"
                                    onClick={() => setQuantity((q) => q + 1)}
                                >
                                    +
                                </button>
                            </div>
                            <Button
                                className="product-detail-add-btn"
                                onClick={handleAddToCart}
                            >
                                {detailText[lang].addToCart}
                            </Button>
                            <Button
                                className="product-detail-buy-btn"
                                onClick={handleBuyNow}
                            >
                                {detailText[lang].buyNow}
                            </Button>
                        </div>

                        <div style={{ marginTop: '20px' }}>
                            {/* Thông tin sản phẩm (Collapse) */}
                            <Collapse expandIconPosition="end" style={{ border: 'none', background: 'transparent' }}>
                                <Panel
                                    header={
                                        <span style={{ fontWeight: 'bold', color: '#a06f6f', fontSize: '20px' }}>
                                            {detailText[lang].detail}
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
                                        {detailText[lang].info}
                                    </h2>
                                    <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                        {product.description || detailText[lang].noDesc}
                                    </p>
                                    <p style={{ fontSize: '16px', lineHeight: '1.6', marginTop: '10px' }}>
                                        <strong>{detailText[lang].categoryLabel}</strong> {product.category}
                                    </p>
                                    <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                                        <strong>{detailText[lang].createdAt}</strong> {new Date(product.createdAt).toLocaleDateString()}
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
