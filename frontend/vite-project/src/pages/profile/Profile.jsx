import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate(); // Hook điều hướng

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="profile-container">
            <div className="profile-box">
                <h2 className="profile-title">Login</h2>
                <Form
                    name="profileForm"
                    layout="vertical"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}>
                    <Form.Item
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}>
                        <Input placeholder="Enter your username" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}>
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="submit-button">
                            Login
                        </Button>
                    </Form.Item>
                </Form>

                {/* Thêm nút Back */}
                <Button type="default" onClick={() => navigate('/')} className="back-button">
                    Back to Home
                </Button>

                <p className="register-link">
                    Create a new account? <Link to="/register">Click here</Link>
                </p>
            </div>
        </div>
    );
};

export default Profile;
