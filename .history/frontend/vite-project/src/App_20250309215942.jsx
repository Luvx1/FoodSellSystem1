
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
  ]);
  return (
    <>
      
    </>
  )
}

export default App
