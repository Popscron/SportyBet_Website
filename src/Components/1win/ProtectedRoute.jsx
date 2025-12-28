import { Navigate } from 'react-router-dom';
import { useAuth } from '../../Context/1win/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/1win/login" replace />;
};

export default ProtectedRoute;













