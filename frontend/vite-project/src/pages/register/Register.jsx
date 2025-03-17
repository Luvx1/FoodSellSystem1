import React from "react";
import { Button, Form, Input, message, Checkbox } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
    const navigate = useNavigate(); // Hook điều hướng

    const onFinish = async (values) => {
        console.log("Success:", values);
        try {
            const response = await fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values), // Gửi toàn bộ giá trị form
            });

            const data = await response.json();

            if (response.ok) {
                message.success("Registration successful!");
                navigate("/profile"); // Điều hướng đến trang Login
            } else {
                message.error(data.message || "Registration failed");
            }
        } catch (error) {
            console.error("Registration Error:", error);
            message.error("Something went wrong. Please try again.");
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Sign up</h2>
                <Form
                    name="registerForm"
                    layout="vertical"
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                >
                    <Form.Item
                        label="Your Name"
                        name="username"
                        rules={[{ required: true, message: "Please input your name!" }]}
                    >
                        <Input placeholder="Enter your name" />
                    </Form.Item>

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, message: "Please input your email!" }]}
                    >
                        <Input placeholder="Enter your email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: "Please input your password!" }]}
                    >
                        <Input.Password placeholder="Enter your password" />
                    </Form.Item>

                    <Form.Item
                        name="agree"
                        valuePropName="checked"
                        rules={[{ validator:(_, value) => value ? Promise.resolve() : Promise.reject('You must agree to the terms') }]}
                    >
                        <Checkbox>By continuing, I agree to the terms of use & privacy policy</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="register-button">
                            Create account
                        </Button>
                    </Form.Item>
                </Form>

                <Button type="default" onClick={() => navigate("/")} className="back-button">
                    Back to Home
                </Button>

                <p className="login-link">
                    Already have an account? <Link to="/profile">Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;