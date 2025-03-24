/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import api from '../../utils/api';
import { Table, Input, Button, Space, Image, Typography, Tag, Popconfirm, message, Select, Modal } from 'antd';
import { SearchOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import { routes } from '../../routes';

const { Title } = Typography;
const { Option } = Select;
export default function ManageProduct() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 5,
    });
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [filteredInfo, setFilteredInfo] = useState({});
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isNewCategory, setIsNewCategory] = useState(false);


    const handleFetchAllProducts = async () => {
        setLoading(true);
        try {
            const response = await api.get('products');
            setProducts(response.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
            message.error('Failed to fetch products');
        }
    };

    useEffect(() => {
        handleFetchAllProducts();
    }, []);

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
        onFilter: (value, record) =>
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
        render: (text) => (searchedColumn === dataIndex ? <span style={{ fontWeight: 'bold' }}>{text}</span> : text),
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

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination(pagination);
        setFilteredInfo(filters);
    };

    const handleEdit = async (record) => {
        setLoading(true);
        try {
            // Fetch product details
            const response = await api.get(`products/${record._id}`);
            const productData = response.data;

            // Set current product
            setCurrentProduct(productData);

            // Show modal
            setIsModalVisible(true);
        } catch (error) {
            console.error('Error fetching product details:', error);
            message.error('Failed to fetch product details');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        message.success(`Product with ID: ${id} deleted`);
        const response = await api.delete(`products/${id}`);
        handleFetchAllProducts();
    };

    const handleUpdateSubmit = async (values) => {
        try {
            // Create a new object with only the fields needed for the update
            const updateData = {
                name: values.name,
                description: values.description,
                price: values.price,
                category: values.category || '', // Handle empty category
                image: values.image || '', // Handle empty image
            };

            await api.put(`products/${currentProduct._id}`, updateData);
            message.success('Product updated successfully');
            setIsModalVisible(false);
            handleFetchAllProducts();
        } catch (error) {
            console.error('Error updating product:', error);
            message.error('Failed to update product');
        }
    };

    const handleCreateSubmit = async (values, { resetForm }) => {
        try {
            const productData = {
                ...values,
                category: values.category === 'new' ? values.newCategory : values.category,
            };
            await api.post('products', values);
            message.success('Product created successfully');
            setIsCreateModalVisible(false);
            resetForm();
            handleFetchAllProducts();
        } catch (error) {
            console.error('Error creating product:', error);
            message.error('Failed to create product');
        }
    };

    const handleCreateModalOpen = () => {
        setIsCreateModalVisible(true);
    };

    const handleCreateModalCancel = () => {
        setIsCreateModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const ProductSchema = Yup.object().shape({
        name: Yup.string().required('Product name is required'),
        description: Yup.string().required('Description is required'),
        price: Yup.number().required('Price is required').positive('Price must be positive'),
        category: Yup.string().required('Category is required'),
        newCategory: Yup.string().when('category', {
            is: 'new',
            then: Yup.string().required('New category name is required'),
        }),
        image: Yup.string(),
    });

    // Get unique categories for filters
    const getCategoryFilters = () => {
        const categories = [...new Set(products.map((item) => item.category))];
        return categories.map((category) => ({ text: category, value: category }));
    };
    const columns = [
        {
            title: 'Image',
            dataIndex: 'image',
            key: 'image',
            render: (text) =>
                text ? <Image src={text} alt="Product" width={60} preview={{ mask: 'View' }} /> : 'No image',
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            ...getColumnSearchProps('description'),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
            sorter: (a, b) => a.price - b.price,
            render: (price) => `${price.toLocaleString()} đ`,
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            filters: getCategoryFilters(),
            filteredValue: filteredInfo.category || null,
            onFilter: (value, record) => record.category === value,
            render: (category) => {
                let color = 'green';
                if (category === 'Seafood') color = 'blue';
                else if (category === 'Meat') color = 'red';

                return <Tag color={color}>{category}</Tag>;
            },
        },
        {
            title: 'Created Date',
            dataIndex: 'createdAt',
            key: 'createdAt',
            sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
            render: (date) => new Date(date).toLocaleDateString(),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
                        Edit
                    </Button>
                    <Popconfirm
                        title="Are you sure you want to delete this product?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Yes"
                        cancelText="No">
                        <Button danger icon={<DeleteOutlined />}>
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];
    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                <Title level={2}>Manage Products</Title>
                <Button type="primary" onClick={handleCreateModalOpen} style={{ marginBottom: '16px' }}>
                    Create Product
                </Button>
                <Link to={routes.manageOrders}>
                    <Button type="primary">Manage Orders</Button>
                </Link>
            </div>

            <Table
                columns={columns}
                dataSource={products.map((product) => ({ ...product, key: product._id }))}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{ x: 1200 }}
                bordered
            />

            {/* Product Edit Modal with Formik - Existing code */}
            <Modal title="Edit Product" open={isModalVisible} onCancel={handleCancel} footer={null} width={800}>
                {currentProduct && (
                    <Formik
                        initialValues={{
                            name: currentProduct.name || '',
                            description: currentProduct.description || '',
                            price: currentProduct.price || 0,
                            category: currentProduct.category || '',
                            image: currentProduct.image || '',
                        }}
                        validationSchema={ProductSchema}
                        onSubmit={handleUpdateSubmit}>
                        {({ isSubmitting, errors, touched, handleSubmit }) => (
                            <Form>
                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="name">Product Name</label>
                                    <Field name="name" className="ant-input" style={{ width: '100%' }} />
                                    <ErrorMessage
                                        name="name"
                                        component="div"
                                        className="text-danger"
                                        style={{ color: 'red' }}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="description">Description</label>
                                    <Field
                                        as="textarea"
                                        name="description"
                                        className="ant-input"
                                        style={{ width: '100%', minHeight: '100px' }}
                                    />
                                    <ErrorMessage
                                        name="description"
                                        component="div"
                                        className="text-danger"
                                        style={{ color: 'red' }}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="price">Price (đ)</label>
                                    <Field type="number" name="price" className="ant-input" style={{ width: '100%' }} />
                                    <ErrorMessage
                                        name="price"
                                        component="div"
                                        className="text-danger"
                                        style={{ color: 'red' }}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="category">Category</label>
                                    <Field
                                        name="category"
                                        as="select"
                                        className="ant-select"
                                        style={{ width: '100%', height: '32px' }}>
                                        <option value="">Select Category</option>
                                        {getCategoryFilters().map((category) => (
                                            <option key={category.value} value={category.value}>
                                                {category.text}
                                            </option>
                                        ))}
                                    </Field>
                                    <ErrorMessage
                                        name="category"
                                        component="div"
                                        className="text-danger"
                                        style={{ color: 'red' }}
                                    />
                                </div>

                                <div className="form-group" style={{ marginBottom: '15px' }}>
                                    <label htmlFor="image">Image URL</label>
                                    <Field name="image" className="ant-input" style={{ width: '100%' }} />
                                    <ErrorMessage
                                        name="image"
                                        component="div"
                                        className="text-danger"
                                        style={{ color: 'red' }}
                                    />
                                </div>

                                <div
                                    className="form-group"
                                    style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button onClick={handleCancel} style={{ marginRight: '10px' }}>
                                        Cancel
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        loading={isSubmitting}>
                                        Update Product
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                )}
            </Modal>

            {/* Product Create Modal with Formik */}
            <Modal
                title="Create New Product"
                open={isCreateModalVisible}
                onCancel={handleCreateModalCancel}
                footer={null}
                width={800}>
                <Formik
                    initialValues={{
                        name: '',
                        description: '',
                        price: 0,
                        category: '',
                        image: '',
                    }}
                    validationSchema={ProductSchema}
                    onSubmit={handleCreateSubmit}>
                    {({ isSubmitting, errors, touched, handleSubmit }) => (
                        <Form>
                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label htmlFor="name">Product Name</label>
                                <Field name="name" className="ant-input" style={{ width: '100%' }} />
                                <ErrorMessage
                                    name="name"
                                    component="div"
                                    className="text-danger"
                                    style={{ color: 'red' }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label htmlFor="description">Description</label>
                                <Field
                                    as="textarea"
                                    name="description"
                                    className="ant-input"
                                    style={{ width: '100%', minHeight: '100px' }}
                                />
                                <ErrorMessage
                                    name="description"
                                    component="div"
                                    className="text-danger"
                                    style={{ color: 'red' }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label htmlFor="price">Price (đ)</label>
                                <Field type="number" name="price" className="ant-input" style={{ width: '100%' }} />
                                <ErrorMessage
                                    name="price"
                                    component="div"
                                    className="text-danger"
                                    style={{ color: 'red' }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label htmlFor="category">Category</label>
                                <Field
                                    name="category"
                                    as="select"
                                    className="ant-select"
                                    style={{ width: '100%', height: '32px' }}>
                                    <option value="">Select Category</option>
                                    {getCategoryFilters().map((category) => (
                                        <option key={category.value} value={category.value}>
                                            {category.text}
                                        </option>
                                    ))}
                                </Field>
                                <ErrorMessage
                                    name="category"
                                    component="div"
                                    className="text-danger"
                                    style={{ color: 'red' }}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: '15px' }}>
                                <label htmlFor="image">Image URL</label>
                                <Field name="image" className="ant-input" style={{ width: '100%' }} />
                                <ErrorMessage
                                    name="image"
                                    component="div"
                                    className="text-danger"
                                    style={{ color: 'red' }}
                                />
                            </div>

                            <div
                                className="form-group"
                                style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                <Button onClick={handleCreateModalCancel} style={{ marginRight: '10px' }}>
                                    Cancel
                                </Button>
                                <Button
                                    type="primary"
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    loading={isSubmitting}>
                                    Create Product
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </div>
    );
}
