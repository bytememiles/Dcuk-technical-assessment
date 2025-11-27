/**
 * Public Route Component
 * Redirects to home if user is already authenticated
 */

import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // If authenticated, redirect to home
  // This prevents authenticated users from accessing login/register pages
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

export default PublicRoute;
