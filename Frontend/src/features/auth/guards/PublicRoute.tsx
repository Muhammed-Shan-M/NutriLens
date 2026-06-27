import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '@/components/ui/Loader';

interface PublicRouteProps {
  children?: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  // Prevent flashing of public auth content by rendering full screen loader
  if (isLoading) {
    return <Loader fullscreen message="Verifying session..." />;
  }

  // Redirect to appropriate page if already authenticated
  if (isAuthenticated) {
    if (user?.isOnboarded) {
      return <Navigate to="/dashboard" replace />;
    } else {
      return <Navigate to="/onboarding" replace />;
    }
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;
