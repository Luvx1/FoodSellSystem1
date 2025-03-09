import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import Login from './pages/login/Login';
import Profile from './pages/profile/profile';

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
          
        }
    ]);
    return (
        <>
            <RouterProvider router={router} />
        </>
    );
}

export default App;
