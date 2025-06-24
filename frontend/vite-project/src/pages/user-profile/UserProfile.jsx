import React, { useEffect, useState } from 'react';
import {
    Card,
    Avatar,
    Typography,
    Descriptions,
    Row,
    Col,
    Divider,
    Tag,
    Skeleton,
    Tabs,
    Form,
    Input,
    Button,
} from 'antd';
import {
    UserOutlined,
    MailOutlined,
    PhoneOutlined,
    HomeOutlined,
    CalendarOutlined,
    LockOutlined,
    EyeInvisibleOutlined,
    EyeTwoTone,
} from '@ant-design/icons';
import { Formik } from 'formik';
import * as Yup from 'yup';
import './UserProfile.css';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting] = useState(false);
    const navigate = useNavigate();

    const handleFetchUser = async () => {
        try {
            // Fetch user data
            const response = await api.get('/auth/me');
            console.log(response.data.user);
            setUser(response.data.user);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (values, { resetForm, setFieldError, setSubmitting }) => {
        try {
            setSubmitting(true);
            // Change password
            const response = await api.put('/auth/change-password', {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            });
            toast.success(response.data.message || 'Password changed successfully');
            resetForm();
        } catch (error) {
            console.error('Failed to change password:', error);

            // Handle the specific Vietnamese error message
            if (error.response?.data?.message === 'Mật khẩu hiện tại không chính xác') {
                // Set field-specific error for current password
                setFieldError('currentPassword', 'Current password is incorrect');
                // Show toast with original message
                toast.error('Mật khẩu hiện tại không chính xác');
            } else {
                // Handle other errors
                toast.error(error.response?.data?.message || 'Failed to change password');
            }
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        handleFetchUser();
    }, []);

    if (loading) {
        return <Skeleton active avatar paragraph={{ rows: 6 }} />;
    }

    if (!user) {
        return (
            <Card>
                <Text type="warning">User not found. Please log in again.</Text>
            </Card>
        );
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const hasAddress = Object.values(user.address || {}).some((val) => val);

    const passwordValidationSchema = Yup.object().shape({
        currentPassword: Yup.string().required('Current password is required'),
        newPassword: Yup.string().required('New password is required').min(7, 'Password must be at least 7 characters'),

        confirmPassword: Yup.string()
            .required('Confirm password is required')
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match'),
    });

    // User profile information component
    const UserInfoComponent = () => (
        <div className="user-profile-container">
            <Row gutter={[24, 24]}>
                <Col xs={24} md={8}>
                    <Card hoverable className="user-card">
                        <div style={{ textAlign: 'center', marginBottom: 20 }}>
                            <Avatar size={120} src={user.avatar} icon={!user.avatar && <UserOutlined />} />
                            <Title level={3} style={{ marginTop: 16, marginBottom: 4 }}>
                                {user.name}
                            </Title>
                            <Tag color="blue">{user.role}</Tag>
                            {user.email && (
                                <div
                                    style={{
                                        marginTop: 8,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}>
                                    <MailOutlined style={{ marginRight: 8 }} />
                                    <Text>{user.email}</Text>
                                </div>
                            )}
                        </div>

                        {/* Nút History Order */}
                        <Button type="primary" block style={{ marginTop: 16 }} onClick={() => navigate('/history-order')}>
                            History Order
                        </Button>

                        {user.bio && (
                            <>
                                <Divider>Bio</Divider>
                                <Text>{user.bio || 'No bio provided'}</Text>
                            </>
                        )}

                        <Divider>Member Since</Divider>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <CalendarOutlined style={{ marginRight: 8 }} />
                            <Text>{formatDate(user.createdAt)}</Text>
                        </div>
                    </Card>
                </Col>

                <Col xs={24} md={16}>
                    <Card title="Account Details" className="details-card">
                        <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                            <Descriptions.Item label="Full Name">{user.name}</Descriptions.Item>
                            <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                            <Descriptions.Item label="Phone Number">
                                {user.phoneNumber ? (
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <PhoneOutlined style={{ marginRight: 8 }} />
                                        {user.phoneNumber}
                                    </div>
                                ) : (
                                    <Text type="secondary">Not provided</Text>
                                )}
                            </Descriptions.Item>
                            <Descriptions.Item label="User ID">
                                <Text code copyable>
                                    {user.id}
                                </Text>
                            </Descriptions.Item>
                        </Descriptions>

                        <Divider orientation="left">Address Information</Divider>
                        {hasAddress ? (
                            <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                                <Descriptions.Item label="Street">
                                    {user.address.street || <Text type="secondary">Not provided</Text>}
                                </Descriptions.Item>
                                <Descriptions.Item label="City">
                                    {user.address.city || <Text type="secondary">Not provided</Text>}
                                </Descriptions.Item>
                                <Descriptions.Item label="State">
                                    {user.address.state || <Text type="secondary">Not provided</Text>}
                                </Descriptions.Item>
                                <Descriptions.Item label="ZIP Code">
                                    {user.address.zipCode || <Text type="secondary">Not provided</Text>}
                                </Descriptions.Item>
                                <Descriptions.Item label="Country">
                                    {user.address.country || <Text type="secondary">Not provided</Text>}
                                </Descriptions.Item>
                            </Descriptions>
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <HomeOutlined style={{ marginRight: 8 }} />
                                <Text type="secondary">No address information provided</Text>
                            </div>
                        )}

                        <div style={{ marginTop: 20, textAlign: 'right' }}>
                            <Text type="secondary">Last updated: {formatDate(user.updatedAt)}</Text>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
    );

    // Change password component
    const ChangePasswordComponent = () => (
        <div className="change-password-container">
            <Card title="Change Password" className="password-card">
                <Formik
                    initialValues={{
                        currentPassword: '',
                        newPassword: '',
                        confirmPassword: '',
                    }}
                    validationSchema={passwordValidationSchema}
                    onSubmit={handleChangePassword}>
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <Form layout="vertical" onFinish={handleSubmit}>
                            <Form.Item
                                label="Current Password"
                                validateStatus={errors.currentPassword && touched.currentPassword ? 'error' : ''}
                                help={touched.currentPassword && errors.currentPassword}
                                className={errors.currentPassword ? 'password-error-field' : ''}>
                                <Input.Password
                                    name="currentPassword"
                                    prefix={<LockOutlined />}
                                    placeholder="Enter your current password"
                                    value={values.currentPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>

                            <Form.Item
                                label="New Password"
                                validateStatus={errors.newPassword && touched.newPassword ? 'error' : ''}
                                help={touched.newPassword && errors.newPassword}>
                                <Input.Password
                                    name="newPassword"
                                    prefix={<LockOutlined />}
                                    placeholder="Enter new password"
                                    value={values.newPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Confirm New Password"
                                validateStatus={errors.confirmPassword && touched.confirmPassword ? 'error' : ''}
                                help={touched.confirmPassword && errors.confirmPassword}>
                                <Input.Password
                                    name="confirmPassword"
                                    prefix={<LockOutlined />}
                                    placeholder="Confirm your new password"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={submitting} block>
                                    Change Password
                                </Button>
                            </Form.Item>
                        </Form>
                    )}
                </Formik>
            </Card>
        </div>
    );

    return (
        <div className="profile-tabs-container">
            <Tabs defaultActiveKey="profile">
                <TabPane tab="Profile" key="profile">
                    <UserInfoComponent />
                </TabPane>
                <TabPane tab="Change Password" key="changePassword">
                    <ChangePasswordComponent />
                </TabPane>
            </Tabs>
        </div>
    );
};

export default UserProfile;
