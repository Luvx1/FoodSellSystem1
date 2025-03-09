
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

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
    }

  ]);
  return (
    <>
      
    </>
  )
}

export default App
