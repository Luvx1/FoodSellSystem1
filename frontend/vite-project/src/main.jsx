import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { persistor, store } from './redux/store';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Cookies from 'js-cookie';
import api from './utils/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const handleLogout = async () => {
    try {
        const accessToken = Cookies.get('accessToken');
        const response = await api.post(
            '/auth/logout',
            { refreshToken: Cookies.get('refreshToken') },
            { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
        Cookies.remove('user');
        toast.success(response.data.message);
        setUser(null);
        navigate('/');
    } catch (error) {
        console.error('Failed to log out', error);
    }
};

createRoot(document.getElementById('root')).render(
    <>
        <Provider store={store}>
            <PersistGate loading={<p>Đang tải...</p>} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
    </>
);
