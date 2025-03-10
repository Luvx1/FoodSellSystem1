import React from 'react';
import { Button, Checkbox, Form, Input } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';

export default function Register() {
    const navigate = useNavigate(); // Hook điều hướng

    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h1 className="register-title">Sign up</h1>
                <Form name="registerForm" layout="vertical" onFinish={onFinish} onFinishFailed={onFinishFailed}>
                    <Form.Item
                        label="Your Name"
                        name="name"
                        rules={[{ required: true, message: 'Please enter your name!' }]}>
                        <Input placeholder="Enter your name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}>
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please enter your password!' }]}>
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item name="agree" valuePropName="checked">
                        <Checkbox>By continuing, I agree to the terms of use & privacy policy</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="register-button">
                            Create account
                        </Button>
                    </Form.Item>
                </Form>

                {/* Thêm nút Back */}
                <Button type="default" onClick={() => navigate('/')} className="back-button">
                    Back to Home
                </Button>

                <p className="login-link">
                    Already have an account? <Link to="/profile">Login here</Link>
                </p>
            </div>
        </div>
    );
}
