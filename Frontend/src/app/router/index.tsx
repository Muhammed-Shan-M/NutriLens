import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import AuthLayout from '../layouts/AuthLayout';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '@/features/auth/guards/ProtectedRoute';
import PublicRoute from '@/features/auth/guards/PublicRoute';
import FRONTEND_ROUTES from './routes.constants';

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
    path: FRONTEND_ROUTES.LANDING,
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
          { path: FRONTEND_ROUTES.LOGIN, element: <LoginPage /> },
          { path: FRONTEND_ROUTES.SIGNUP, element: <SignupPage /> },
        ],
      },
      // Standalone setup pages wrapped in ProtectedRoute (No sidebar/MainLayout)
      {
        element: <ProtectedRoute />,
        children: [
          { path: FRONTEND_ROUTES.ONBOARDING, element: <OnboardingPage /> },
          { path: FRONTEND_ROUTES.NUTRITION_PLAN, element: <NutritionPlanPage /> },
        ],
      },
      // App routes using MainLayout wrapped in ProtectedRoute
      {
        element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
        children: [
          { path: FRONTEND_ROUTES.DASHBOARD, element: <DashboardPage /> },
          { path: FRONTEND_ROUTES.MEALS, element: <MealsPage /> },
          { path: FRONTEND_ROUTES.HISTORY, element: <HistoryPage /> },
          { path: FRONTEND_ROUTES.ANALYTICS, element: <AnalyticsPage /> },
          { path: FRONTEND_ROUTES.PROFILE, element: <ProfilePage /> },
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
