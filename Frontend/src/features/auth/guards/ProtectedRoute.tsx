import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Loader from '@/components/ui/Loader';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Prevent flashing of protected content by rendering full screen loader
  if (isLoading) {
    return <Loader fullscreen message="Verifying session..." />;
  }

  // Redirect to login page and replace navigation history stack
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect users who are not onboarded to /onboarding
  const isOnboardingOrPlanPath =
    location.pathname === '/onboarding' ||
    location.pathname === '/nutrition-plan';

  if (!user?.isOnboarded && !isOnboardingOrPlanPath) {
    return <Navigate to="/onboarding" replace />;
  }

  // Prevent onboarded users from revisiting onboarding pages
  if (user?.isOnboarded && isOnboardingOrPlanPath) {
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
