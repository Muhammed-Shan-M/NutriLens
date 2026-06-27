import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import compression from 'compression';

import { config } from './config';
import { connectDatabase } from './database/connection';
import { errorMiddleware } from './middlewares/error.middleware';
import authRoutes from './modules/auth/routes/Auth.routes';
import mealRoutes from './modules/meal/routes/Meal.routes';
import ROUTES from './shared/routes.constants';

const app = express();

// Set trust proxy if running behind load balancers
app.set('trust proxy', 1);

// Global Middlewares
app.use(helmet()); // Security headers
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);
app.use(morgan(config.nodeEnv === 'development' ? 'dev' : 'combined')); // Log requests
app.use(express.json({ limit: '10mb' })); // Parse incoming JSON body
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded data
app.use(cookieParser()); // Parse cookies
app.use(compression()); // Compress responses

import dashboardRoutes from './modules/dashboard/routes/Dashboard.routes';
import historyRoutes from './modules/history/routes/History.routes';
import analyticsRoutes from './modules/analytics/routes/Analytics.routes';
import profileRoutes from './modules/profile/routes/Profile.routes';

// API Base Routes mapping
app.use(ROUTES.BASE.AUTH, authRoutes);
app.use(ROUTES.BASE.MEALS, mealRoutes);
app.use(ROUTES.BASE.DASHBOARD, dashboardRoutes);
app.use(ROUTES.BASE.HISTORY, historyRoutes);
app.use(ROUTES.BASE.ANALYTICS, analyticsRoutes);
app.use(ROUTES.BASE.PROFILE, profileRoutes);

// Health check endpoint
app.get(ROUTES.BASE.HEALTH, (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler Middleware
app.use(errorMiddleware);

// Boot server
const startServer = async () => {
  // 1. Connect database
  await connectDatabase();

  // 2. Listen on Port
  app.listen(config.port, () => {
    console.log(`[Server]: NutriLens running in ${config.nodeEnv} mode at http://localhost:${config.port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
