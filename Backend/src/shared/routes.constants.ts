export const ROUTES = {
  BASE: {
    AUTH: '/api/auth',
    MEALS: '/api/meals',
    DASHBOARD: '/api/dashboard',
    HISTORY: '/api/history',
    ANALYTICS: '/api/analytics',
    PROFILE: '/api/profile',
    HEALTH: '/health',
  },
  AUTH: {
    SIGNUP: '/signup',
    REGISTER: '/register',
    LOGIN: '/login',
    REFRESH_TOKEN: '/refresh-token',
    REFRESH: '/refresh',
    LOGOUT: '/logout',
    ME: '/me',
    METRICS: '/metrics',
    COMPLETE_ONBOARDING: '/complete-onboarding',
  },
  MEALS: {
    BASE: '/',
    TODAY: '/today',
    HISTORY: '/history',
    BY_ID: '/:id',
    ANALYZE: '/analyze',
  },
  HISTORY: {
    BASE: '/',
  },
  DASHBOARD: {
    SUMMARY: '/summary',
  },
  ANALYTICS: {
    BASE: '/',
    INSIGHT: '/insight',
  },
  PROFILE: {
    BASE: '/',
  },
};

export default ROUTES;
