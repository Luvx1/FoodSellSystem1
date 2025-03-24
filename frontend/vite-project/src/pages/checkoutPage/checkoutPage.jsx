import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectCartItems, clearCart } from '../../redux/feature/cartSlice';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Card, Row, Col, Typography, Divider, Button, Radio, Space, Steps, message, Input } from 'antd';
import api from '../../utils/api';
import { routes } from '../../routes';

const { Title, Text } = Typography;
const { Step } = Steps;

export default function CheckoutPage() {
    const dispatch = useDispatch();
    const cartItems = useSelector(selectCartItems);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const orderSuccessful = useRef(false);

    useEffect(() => {
        // Only redirect if cart is empty AND we haven't just completed an order
        if ((!cartItems || cartItems.length === 0) && !orderSuccessful.current) {
            message.info('Your cart is empty');
            navigate('/products');
        }
    }, [cartItems, navigate]);

    // Calculate cart total
    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    // Handle checkout submission
    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            // Create order payload
            const orderData = {
                items: cartItems.map((item) => ({
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                })),
                totalAmount: calculateTotal(),
                paymentMethod: values.paymentMethod,
                shippingAddress: {
                    fullName: values.fullName,
                    address: values.address,
                    city: values.city,
                    district: values.district,
                    phoneNumber: values.phoneNumber,
                    notes: values.notes,
                },
            };

            // Call API to create order
            const createResponse = await api.post('orders', orderData);

            // Get the order ID from the response
            const orderId = createResponse.data.order._id;

            // Call API to confirm order
            await api.patch(`orders/${orderId}/confirm`);

            // Set flag that order was successful to prevent redirect
            orderSuccessful.current = true;

            // Show success message
            message.success('Order placed and confirmed successfully!');

            // Clear cart
            dispatch(clearCart());

            // Redirect to order history page
            navigate(routes.historyOrder);
        } catch (error) {
            console.error('Error processing order:', error);
            message.error('Failed to process order. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Validation schema
    const validationSchema = Yup.object({
        fullName: Yup.string().required('Full name is required'),
        phoneNumber: Yup.string()
            .required('Phone number is required')
            .matches(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
        address: Yup.string().required('Address is required'),
        city: Yup.string().required('City is required'),
        district: Yup.string().required('District is required'),
        paymentMethod: Yup.string().required('Please select a payment method'),
    });

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Title level={2}>Checkout</Title>
            <Steps
                current={1}
                items={[
                    { title: 'Shopping Cart', description: 'Review items' },
                    { title: 'Checkout', description: 'Payment & shipping' },
                    { title: 'Order Complete', description: 'Order confirmed' },
                ]}
                style={{ marginBottom: '40px' }}
            />

            <Row gutter={24}>
                {/* Order Summary - Left Side */}
                <Col xs={24} md={10}>
                    <Card title="Order Summary" bordered={true}>
                        {cartItems.map((item) => (
                            <div key={item.productId} style={{ marginBottom: '15px', display: 'flex' }}>
                                <div style={{ width: '70px', height: '70px', marginRight: '15px' }}>
                                    <img
                                        src={item.image || 'https://via.placeholder.com/70'}
                                        alt={item.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <Text strong>{item.name}</Text>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <Text type="secondary">Quantity: {item.quantity}</Text>
                                        <Text>{(item.price * item.quantity).toLocaleString()} đ</Text>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Divider />

                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text>Subtotal:</Text>
                            <Text>{calculateTotal().toLocaleString()} đ</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <Text>Shipping:</Text>
                            <Text>Free</Text>
                        </div>
                        <Divider />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Title level={4}>Total:</Title>
                            <Title level={4}>{calculateTotal().toLocaleString()} đ</Title>
                        </div>
                    </Card>
                </Col>

                {/* Shipping & Payment Form - Right Side */}
                <Col xs={24} md={14}>
                    <Card title="Shipping & Payment Information" bordered={true}>
                        <Formik
                            initialValues={{
                                fullName: '',
                                phoneNumber: '',
                                address: '',
                                city: '',
                                district: '',
                                notes: '',
                                paymentMethod: 'COD',
                            }}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}>
                            {({ errors, touched, values, handleChange, handleBlur }) => (
                                <Form layout="vertical">
                                    <div style={{ marginBottom: '15px' }}>
                                        <label htmlFor="fullName">Full Name*</label>
                                        <Input
                                            id="fullName"
                                            name="fullName"
                                            value={values.fullName}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            status={errors.fullName && touched.fullName ? 'error' : ''}
                                        />
                                        {errors.fullName && touched.fullName && (
                                            <div style={{ color: 'red', fontSize: '12px' }}>{errors.fullName}</div>
                                        )}
                                    </div>

                                    <div style={{ marginBottom: '15px' }}>
                                        <label htmlFor="phoneNumber">Phone Number*</label>
                                        <Input
                                            id="phoneNumber"
                                            name="phoneNumber"
                                            value={values.phoneNumber}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            status={errors.phoneNumber && touched.phoneNumber ? 'error' : ''}
                                        />
                                        {errors.phoneNumber && touched.phoneNumber && (
                                            <div style={{ color: 'red', fontSize: '12px' }}>{errors.phoneNumber}</div>
                                        )}
                                    </div>

                                    <Row gutter={16}>
                                        <Col span={24}>
                                            <div style={{ marginBottom: '15px' }}>
                                                <label htmlFor="address">Address*</label>
                                                <Input
                                                    id="address"
                                                    name="address"
                                                    value={values.address}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    status={errors.address && touched.address ? 'error' : ''}
                                                />
                                                {errors.address && touched.address && (
                                                    <div style={{ color: 'red', fontSize: '12px' }}>
                                                        {errors.address}
                                                    </div>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <div style={{ marginBottom: '15px' }}>
                                                <label htmlFor="district">District*</label>
                                                <Input
                                                    id="district"
                                                    name="district"
                                                    value={values.district}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    status={errors.district && touched.district ? 'error' : ''}
                                                />
                                                {errors.district && touched.district && (
                                                    <div style={{ color: 'red', fontSize: '12px' }}>
                                                        {errors.district}
                                                    </div>
                                                )}
                                            </div>
                                        </Col>
                                        <Col span={12}>
                                            <div style={{ marginBottom: '15px' }}>
                                                <label htmlFor="city">City*</label>
                                                <Input
                                                    id="city"
                                                    name="city"
                                                    value={values.city}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    status={errors.city && touched.city ? 'error' : ''}
                                                />
                                                {errors.city && touched.city && (
                                                    <div style={{ color: 'red', fontSize: '12px' }}>{errors.city}</div>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>

                                    <div style={{ marginBottom: '15px' }}>
                                        <label htmlFor="notes">Notes (Optional)</label>
                                        <Input.TextArea
                                            id="notes"
                                            name="notes"
                                            value={values.notes}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            placeholder="Special delivery instructions, etc."
                                            rows={3}
                                        />
                                    </div>

                                    <Divider orientation="left">Payment Method</Divider>

                                    <div style={{ marginBottom: '20px' }}>
                                        <Radio.Group
                                            name="paymentMethod"
                                            value={values.paymentMethod}
                                            onChange={handleChange}>
                                            <Space direction="vertical">
                                                <Radio value="COD">
                                                    <Space>Cash On Delivery (COD)</Space>
                                                </Radio>
                                                <Radio value="BANK_TRANSFER">
                                                    <Space>Bank Transfer</Space>
                                                </Radio>
                                                <Radio value="CREDIT_CARD">
                                                    <Space>Credit Card</Space>
                                                </Radio>
                                            </Space>
                                        </Radio.Group>
                                        {errors.paymentMethod && touched.paymentMethod && (
                                            <div style={{ color: 'red', fontSize: '12px' }}>{errors.paymentMethod}</div>
                                        )}
                                    </div>

                                    <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                                        Place Order - {calculateTotal().toLocaleString()} đ
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}
