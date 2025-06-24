import React from 'react';
import { Button, Input, Checkbox } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import './Register.css';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { routes } from '../../routes';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

const Register = () => {
    const navigate = useNavigate();

    // Validation schema
    const validationSchema = Yup.object({
        username: Yup.string().required('Please input your name!'),
        email: Yup.string().email('Invalid email format').required('Please input your email!'),
        password: Yup.string().min(7, 'Password must be at least 7 characters').required('Please input your password!'),
    });

    // Initial form values
    const initialValues = {
        username: '',
        email: '',
        password: '',
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await api.post('/auth/register', {
                name: values.username,
                email: values.email,
                password: values.password,
            });
            Cookies.set('accessToken', response.data?.accessToken, {
                expires: 3,
                secure: true,
            });
            Cookies.set('refreshToken', response.data?.refreshToken, {
                expires: 5,
                secure: true,
            });

            const decodedToken = jwtDecode(response.data?.accessToken);
            const userGetMe = await api.get('auth/me');
            // console.log(userGetMe.data.data);
            const user = {
                ...userGetMe.data,
                usrId: decodedToken.sub,
            };

            Cookies.set('user', JSON.stringify(user), {
                expires: 7,
                secure: true,
            });

            toast.success('Register successfully');
            navigate(routes.home);
        } catch (error) {
            console.error('Registration error:', error);

            // Check if error response contains data with a message
            if (error.response && error.response.data && error.response.data.message) {
                // Handle specific case for email already exists
                if (error.response.data.message === 'Email đã tồn tại!') {
                    toast.error('This email is already registered. Please use a different email.');
                } else {
                    // Handle other API error messages
                    toast.error(error.response.data.message);
                }
            } else {
                // Generic error fallback
                toast.error(error.message || 'Registration failed. Please try again.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2 className="register-title">Sign up</h2>

                <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="form-item">
                                <label>Your Name</label>
                                <Input
                                    name="username"
                                    placeholder="Enter your name"
                                    value={values.username}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    status={touched.username && errors.username ? 'error' : ''}
                                />
                                {touched.username && errors.username && (
                                    <div className="error-message">{errors.username}</div>
                                )}
                            </div>

                            <div className="form-item">
                                <label>Email</label>
                                <Input
                                    name="email"
                                    placeholder="Enter your email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    status={touched.email && errors.email ? 'error' : ''}
                                />
                                {touched.email && errors.email && <div className="error-message">{errors.email}</div>}
                            </div>

                            <div className="form-item">
                                <label>Password</label>
                                <Input.Password
                                    name="password"
                                    placeholder="Enter your password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    status={touched.password && errors.password ? 'error' : ''}
                                />
                                {touched.password && errors.password && (
                                    <div className="error-message">{errors.password}</div>
                                )}
                            </div>

                            <div className="form-item">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="register-button"
                                    disabled={isSubmitting}>
                                    Create account
                                </Button>
                            </div>
                        </form>
                    )}
                </Formik>

                <Button type="default" onClick={() => navigate('/')} className="back-button">
                    Back to Home
                </Button>

                <p className="login-link">
                    Already have an account? <Link to={routes.login}>Login here</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
