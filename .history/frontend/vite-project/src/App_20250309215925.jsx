
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';

function App() {
  const router = createBrowserRouter([
    {
      path: routes.login,
      element: <Home />
    }
  ]);
  return (
    <>
      
    </>
  )
}

export default App
