import { Router } from 'express';
import { DashboardController } from '../controllers/Dashboard.controller';
import { DashboardService } from '../services/Dashboard.service';
import { UserRepository } from '../../auth/repositories/User.repository';
import { MealRepository } from '../../meal/repositories/Meal.repository';
import { authMiddleware } from '../../../middlewares/auth.middleware';

const router = Router();

// Dependency Injection
const userRepository = new UserRepository();
const mealRepository = new MealRepository();
const dashboardService = new DashboardService(userRepository, mealRepository);
const dashboardController = new DashboardController(dashboardService);

// GET /api/dashboard/summary
router.get(
  '/summary',
  authMiddleware,
  dashboardController.getSummary
);

export default router;
