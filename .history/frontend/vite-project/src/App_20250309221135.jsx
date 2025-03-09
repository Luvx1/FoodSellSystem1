import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import Login from './pages/login/Login';
import Profile from './pages/profile/profile';
import MainLayout from './layouts/mainlayout';

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
            path: routes.profile,
            element: <Profile />,
      },
      {
        path: routes.home,
        element: <MainLayout />,
        children: [
          { path: routes.home, element: <Home /> },
          
      }
    ]);
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
