import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';

// Get base URL from environment variables
const baseURL = import.meta.env.VITE_BACK_END_BASE_URL;
const config = {
    baseURL,
    timeout: 30000,
};
const api = axios.create(config);

const handleBefore = async (config) => {
    let accessToken = Cookies.get('accessToken')?.replaceAll('"', '');
    // Chỉ decode token nếu đúng định dạng JWT (có 3 phần)
    if (accessToken && accessToken.split('.').length === 3) {
        const tokenExpiry = jwtDecode(accessToken).exp * 1000;
        if (Date.now() >= tokenExpiry) {
            try {
                const refreshToken = Cookies.get('refreshToken')?.replaceAll('"', '');
                const response = await axios.post(`${baseURL}auth/refresh-token`, {
                    refreshToken,
                });
                Cookies.set('accessToken', response.data.data?.accessToken, {
                    expires: 1,
                    secure: true,
                });
                Cookies.set('refreshToken', response.data.data?.refreshToken, {
                    expires: 7,
                    secure: true,
                });
            } catch (error) {
                console.error('Failed to refresh token:', error);
                Cookies.remove('accessToken');
                Cookies.remove('refreshToken');
                window.location.href = '/login';
                return Promise.reject(error);
            }
        }
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
};

const handleError = (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
};

api.interceptors.request.use(handleBefore, handleError);

export default api;
