import { RouterProvider } from 'react-router-dom';
import QueryProvider from '@/app/providers/QueryProvider';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import router from '@/app/router';

function App() {
  return (
    <QueryProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryProvider>
  );
}

export default App;
