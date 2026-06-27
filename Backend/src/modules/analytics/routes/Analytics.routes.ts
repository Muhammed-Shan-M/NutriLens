import { Router } from 'express';
import { AnalyticsController } from '../controllers/Analytics.controller';
import { AnalyticsService } from '../services/Analytics.service';
import { AnalyticsRepository } from '../repositories/Analytics.repository';
import { UserRepository } from '../../auth/repositories/User.repository';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import ROUTES from '../../../shared/routes.constants';

const router = Router();

const analyticsRepository = new AnalyticsRepository();
const userRepository = new UserRepository();
const analyticsService = new AnalyticsService(analyticsRepository, userRepository);
const analyticsController = new AnalyticsController(analyticsService);

router.get(ROUTES.ANALYTICS.BASE, authMiddleware, analyticsController.getAnalytics);
router.get(ROUTES.ANALYTICS.INSIGHT, authMiddleware, analyticsController.getAnalyticsInsight);

export default router;
