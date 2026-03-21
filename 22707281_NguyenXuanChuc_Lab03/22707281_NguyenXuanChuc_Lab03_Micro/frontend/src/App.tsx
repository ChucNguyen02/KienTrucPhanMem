import { RouterProvider } from 'react-router-dom';
import { appRouter } from './routers/AppRouter';

function App() {
  return <RouterProvider router={appRouter} />;
}

export default App;
