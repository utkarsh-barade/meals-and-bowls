import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

/**
 * Guards a route by auth state and optional role requirement.
 * Unauthenticated → redirects to login.
 * Wrong role → redirects to their own portal.
 */
export default function ProtectedRoute({ children, requiredRole }) {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to appropriate login, preserving intended destination
    const loginPath = requiredRole === 'ADMIN' ? '/admin/login' : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    // Redirect to the user's own portal
    const homePath = user?.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard';
    return <Navigate to={homePath} replace />;
  }

  return children;
}
