import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '@/features/auth/guards/ProtectedRoute';
import PublicRoute from '@/features/auth/guards/PublicRoute';

// Page placeholders
import LandingPage from '@/pages/LandingPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import OnboardingPage from '@/pages/OnboardingPage';
import NutritionPlanPage from '@/pages/NutritionPlanPage';
import MealsPage from '@/pages/MealsPage';
import DashboardPage from '@/pages/DashboardPage';
import HistoryPage from '@/pages/HistoryPage';
import AnalyticsPage from '@/pages/AnalyticsPage';
import ProfilePage from '@/pages/ProfilePage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      // Base landing page route
      {
        index: true,
        element: <PublicRoute><LandingPage /></PublicRoute>,
      },
      // Auth routes using AuthLayout wrapped in PublicRoute
      {
        element: <PublicRoute><AuthLayout /></PublicRoute>,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'signup', element: <SignupPage /> },
        ],
      },
      // Standalone setup pages wrapped in ProtectedRoute (No sidebar/MainLayout)
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'onboarding', element: <OnboardingPage /> },
          { path: 'nutrition-plan', element: <NutritionPlanPage /> },
        ],
      },
      // App routes using MainLayout wrapped in ProtectedRoute
      {
        element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'meals', element: <MealsPage /> },
          { path: 'history', element: <HistoryPage /> },
          { path: 'analytics', element: <AnalyticsPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
      // 404 Fallback page
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;
