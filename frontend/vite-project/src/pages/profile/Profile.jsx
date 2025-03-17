import React from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
    const navigate = useNavigate(); // Hook điều hướng

    const onFinish = async (values) => {
        console.log("Success:", values);
        try {
            // Chỉ lấy email và password để gửi lên server
            const { email, password } = values;
            const response = await fetch("http://localhost:5000/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }), // Chỉ gửi email và password
            });

            const data = await response.json();

            if (response.ok) {
                message.success("Login successful!");
                localStorage.setItem("user", JSON.stringify(data.user)); // Lưu thông tin người dùng vào localStorage
                navigate("/"); // Điều hướng đến trang chủ chính
            } else {
                message.error(data.message || "Invalid email or password");
            }
        } catch (error) {
            console.error("Login Error:", error);
            message.error("Something went wrong. Please try again.");
        }
    };

    const onFinishFailed = (errorInfo) => {
        console.log("Failed:", errorInfo);
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
                    onFinishFailed={onFinishFailed}
                >
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

                    <Form.Item name="remember" valuePropName="checked">
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="submit-button">
                            Login
                        </Button>
                    </Form.Item>
                </Form>

                <Button type="default" onClick={() => navigate("/")} className="back-button">
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