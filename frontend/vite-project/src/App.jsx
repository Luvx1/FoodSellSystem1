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
import Cart from './pages/cart/Cart';
import PlaceOrder from './pages/place-order/PlaceOrder'; // Import trang PlaceOrder
import UserProfile from './pages/user-profile/UserProfile';
import { ToastContainer } from 'react-toastify';
import ProductDetailPage from './pages/productDetail/ProductDetailPage';

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
                { path: routes.cart, element: <Cart /> },
                { path: routes.placeOrder, element: <PlaceOrder /> }, // Thêm route PlaceOrder
                { path: routes.profile, element: <UserProfile /> }, // Thêm route UserProfile
                { path: routes.productDetail, element: <ProductDetailPage /> },
            ],
        },
    ]);

    return (
        <>
            <ToastContainer position="top-right" reverseOrder={false} />
            <RouterProvider router={router} />
        </>
    );
}

export default App;
