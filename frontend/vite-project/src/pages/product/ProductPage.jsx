import { useEffect, useState } from 'react';
import ProductCard from '../../components/productCard/ProductCard';
import './ProductPage.css';

import { Button, Input, Slider, Select, Card, Row, Col, Typography, Empty, Space } from 'antd';
import { SearchOutlined, FilterOutlined, DollarOutlined, MenuOutlined } from '@ant-design/icons';
import api from '../../utils/api';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/feature/cartSlice';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import { useLanguage } from '../../LanguageContext';

const { Title, Text } = Typography;
const { Option } = Select;

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { lang } = useLanguage();

    // Filter states
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 500000]); // Default range in VND
    const [searchTerm, setSearchTerm] = useState('');
    const [maxPrice, setMaxPrice] = useState(500000); // Default max price

    const productPageText = {
        en: {
            search: 'Search',
            searchPlaceholder: 'Search by name or description...',
            category: 'Category',
            priceRange: 'Price Range',
            ourProducts: 'Our Products',
            itemsFound: (n) => `${n} items found`,
            noProducts: 'No products match your criteria',
            addToCartError: 'Please log in to buy products',
            all: 'All',
        },
        vn: {
            search: 'Tìm kiếm',
            searchPlaceholder: 'Tìm theo tên hoặc mô tả...',
            category: 'Danh mục',
            priceRange: 'Khoảng giá',
            ourProducts: 'Sản phẩm',
            itemsFound: (n) => `Đã tìm thấy ${n} sản phẩm`,
            noProducts: 'Không có sản phẩm phù hợp',
            addToCartError: 'Vui lòng đăng nhập tài khoản để mua sản phẩm',
            all: 'Tất cả',
        },
    };

    const handleFetchProducts = async () => {
        try {
            const response = await api.get('/products');
            console.log(response.data);

            // Set products
            setProducts(response.data);
            setFilteredProducts(response.data);

            // Extract unique categories
            extractCategories(response.data);

            // Find max price for slider
            findMaxPrice(response.data);
        } catch (error) {
            setProducts([]);
            setFilteredProducts([]);
            console.log(error);
        }
    };

    // Extract unique categories
    const extractCategories = (productData) => {
        const uniqueCategories = [productPageText[lang].all, ...new Set(productData.map((product) => product.category))];
        setCategories(uniqueCategories);
    };

    // Find maximum price for the slider
    const findMaxPrice = (productData) => {
        if (productData.length > 0) {
            const highest = Math.max(...productData.map((product) => product.price));
            // Round up to nearest 100,000 VND for a better range
            const roundedMax = Math.ceil(highest / 100000) * 100000;
            setMaxPrice(roundedMax);
            setPriceRange([0, roundedMax]);
        }
    };

    // Handle category selection
    const handleCategoryChange = (value) => {
        setSelectedCategory(value);
    };

    // Handle price range change
    const handlePriceRangeChange = (value) => {
        setPriceRange(value);
    };

    // Handle search input
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    // Apply all filters
    useEffect(() => {
        let result = [...products];

        // Apply category filter
        if (selectedCategory !== 'All') {
            result = result.filter((product) => product.category === selectedCategory);
        }

        // Apply price range filter
        result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1]);

        // Apply search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase();
            result = result.filter(
                (product) =>
                    product.name.toLowerCase().includes(searchLower) ||
                    product.description.toLowerCase().includes(searchLower)
            );
        }

        setFilteredProducts(result);
    }, [selectedCategory, priceRange, searchTerm, products]);

    // Format price display
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(price);
    };

    useEffect(() => {
        handleFetchProducts();
    }, []);

    // Handle add to cart
    const handleAddToCart = (product) => {
        const userAuth = Cookies.get('user');
        if (!userAuth) {
            toast.error(productPageText[lang].addToCartError);
            return;
        }
        dispatch(addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
        }));
    };

    return (
        <div className="product-page">
            {/* Search and Filter Row */}
            <Row gutter={[16, 24]} className="filter-section">
                <Col xs={24} md={8} lg={8}>
                    <div className="filter-label">
                        <SearchOutlined /> <span>{productPageText[lang].search}</span>
                    </div>
                    <Input
                        placeholder={productPageText[lang].searchPlaceholder}
                        prefix={<SearchOutlined />}
                        value={searchTerm}
                        onChange={handleSearch}
                        size="large"
                    />
                </Col>
                <Col xs={24} md={8} lg={8}>
                    <div className="filter-label">
                        <FilterOutlined /> <span>{productPageText[lang].category}</span>
                    </div>
                    <Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        style={{ width: '100%' }}
                        size="large"
                        dropdownMatchSelectWidth={false}>
                        {categories.map((category) => (
                            <Option key={category} value={category}>
                                {category}
                            </Option>
                        ))}
                    </Select>
                </Col>
                <Col xs={24} md={8} lg={8}>
                    <div className="filter-label">
                        <DollarOutlined /> <span>{productPageText[lang].priceRange}</span>
                    </div>
                    <Slider
                        range
                        min={0}
                        max={maxPrice}
                        step={10000}
                        value={priceRange}
                        onChange={handlePriceRangeChange}
                        tipFormatter={(value) => formatPrice(value)}
                    />
                    <div className="price-display">
                        <Text>{formatPrice(priceRange[0])}</Text>
                        <Text>{formatPrice(priceRange[1])}</Text>
                    </div>
                </Col>
            </Row>

            {/* Product Section Title */}
            <div className="section-header">
                <Title level={3}>{productPageText[lang].ourProducts}</Title>
                <Text type="secondary">{productPageText[lang].itemsFound(filteredProducts.length)}</Text>
            </div>

            {/* Product Grid */}
            {filteredProducts.length > 0 ? (
                <div className="wrapper-product">
                    {filteredProducts.map((product, index) => (
                        <ProductCard
                            key={product._id || index}
                            product={product}
                            onAddToCart={() => handleAddToCart(product)}
                            onClick={() => navigate(`/product/${product._id}`)}
                        />
                    ))}
                </div>
            ) : (
                <Empty description={productPageText[lang].noProducts} style={{ margin: '40px 0' }} />
            )}
        </div>
    );
}
