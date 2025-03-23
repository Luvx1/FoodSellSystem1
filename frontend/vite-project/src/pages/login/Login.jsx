import { useNavigate, Link } from 'react-router-dom';
import { Button, Input, Checkbox, Form } from 'antd';
import { Formik, Form as FormikForm, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { routes } from '../../routes';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import './Login.css';

// Validation schema
const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export default function Login() {
    const navigate = useNavigate();

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            const response = await api.post('/auth/login', {
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

            const user = {
                ...userGetMe.data,
                usrId: decodedToken.sub,
            };

            Cookies.set('user', JSON.stringify(user), {
                expires: values.remember ? 7 : 1,
                secure: true,
            });

            toast.success('Login successfully');
            if (user.user.role === 'admin') {
                navigate(routes.manageProduct);
            } else {
                navigate(routes.home);
            }
        } catch (error) {
            console.error('Login error:', error);
            toast.error(error.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-box">
                <h2 className="profile-title">Login</h2>

                <Formik
                    initialValues={{ email: '', password: '', remember: false }}
                    validationSchema={LoginSchema}
                    onSubmit={handleSubmit}>
                    {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
                        <FormikForm className="login-form">
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <Input
                                    id="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={values.email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    status={touched.email && errors.email ? 'error' : null}
                                />
                                {touched.email && errors.email && <div className="error-message">{errors.email}</div>}
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Input.Password
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    status={touched.password && errors.password ? 'error' : null}
                                />
                                {touched.password && errors.password && (
                                    <div className="error-message">{errors.password}</div>
                                )}
                            </div>

                            <div className="form-group">
                                <Checkbox name="remember" checked={values.remember} onChange={handleChange}>
                                    Remember me
                                </Checkbox>
                            </div>

                            <div className="form-actions">
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="submit-button"
                                    loading={isSubmitting}
                                    disabled={isSubmitting}>
                                    Login
                                </Button>
                            </div>
                        </FormikForm>
                    )}
                </Formik>

                <Button type="default" onClick={() => navigate('/')} className="back-button">
                    Back to Home
                </Button>

                <p className="register-link">
                    Create a new account? <Link to="/register">Click here</Link>
                </p>
            </div>
        </div>
    );
}
