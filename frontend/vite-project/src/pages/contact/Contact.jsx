import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Card } from 'antd';
import { MailOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function Contact() {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('Your message has been sent!');
    }, 1000);
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto' }}>
      <Card bordered>
        <Title level={2} style={{ textAlign: 'center' }}>Contact Us</Title>
        <Paragraph style={{ textAlign: 'center' }}>
          If you have any questions or feedback, please fill out the form below.
        </Paragraph>
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="name"
            label="Your Name"
            rules={[{ required: true, message: 'Please enter your name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Enter your name" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please enter your email' },
              { type: 'email', message: 'Please enter a valid email' },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Enter your email" />
          </Form.Item>
          <Form.Item
            name="message"
            label="Message"
            rules={[{ required: true, message: 'Please enter your message' }]}
          >
            <Input.TextArea rows={5} prefix={<MessageOutlined />} placeholder="Type your message..." />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Send Message
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
} 