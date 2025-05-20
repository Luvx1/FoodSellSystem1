import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import Login from './pages/login/Login';
import Profile from './pages/profile/Profile';
import MainLayout from './layouts/Mainlayout';
import Register from './pages/register/Register';
import Homepage from './pages/homepage/Homepage';
import ProductPage from './pages/product/ProductPage';
import Promotions from './pages/promotions/Promotions';
import PromotionDetail from './pages/promotions/PromotionDetail';
import AboutUs from './pages/about-us/AboutUs';
import Contact from './pages/contact/Contact';
import Cart from './pages/cart/Cart';
import PlaceOrder from './pages/place-order/PlaceOrder'; // Import trang PlaceOrder
import UserProfile from './pages/user-profile/UserProfile';
import { ToastContainer } from 'react-toastify';
import ProductDetailPage from './pages/productDetail/ProductDetailPage';
import ProtectedRoute from './routes/ProtectedRoute';
import ManageProduct from './pages/dashboard/ManageProduct';
import RestrictedPage from './pages/errorPage/RestrictedPage';
import ManageOrders from './pages/dashboard/ManageOrders';
import CheckoutPage from './pages/checkoutPage/checkoutPage';
import OrderHistory from './pages/historyOrderPage/OrderHistory';
import { LanguageProvider } from './LanguageContext';

function App() {
    const router = createBrowserRouter([
        {
            path: routes.login,
            element: <Login />,
        },
        {
            path: routes.register,
            element: <Register />,
        },
        {
            path: routes.home,
            element: <MainLayout />,
            children: [
                { path: routes.home, element: <Homepage /> },
                { path: routes.product, element: <ProductPage /> },
                { path: routes.promotions, element: <Promotions /> },
                { path: '/promotion/:id', element: <PromotionDetail /> },
                { path: routes.aboutUs, element: <AboutUs /> },
                { path: routes.contact, element: <Contact /> },
                { path: routes.cart, element: <Cart /> },
                { path: routes.placeOrder, element: <PlaceOrder /> },
                { path: routes.profile, element: <UserProfile /> },
                { path: routes.productDetail, element: <ProductDetailPage /> },
                {
                    path: routes.manageProduct,
                    element: (
                        <ProtectedRoute roles={['admin']}>
                            <ManageProduct />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: routes.manageOrders,
                    element: (
                        <ProtectedRoute roles={['admin']}>
                            <ManageOrders />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: routes.checkout,
                    element: (
                        <ProtectedRoute roles={['customer']}>
                            <CheckoutPage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: routes.historyOrder,
                    element: (
                        <ProtectedRoute roles={['customer']}>
                            <OrderHistory />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: routes.restricted,
                    element: <RestrictedPage />,
                },
            ],
        },
    ]);

    return (
        <LanguageProvider>
            <ToastContainer position="top-right" reverseOrder={false} />
            <RouterProvider router={router} />
        </LanguageProvider>
    );
}

export default App;
