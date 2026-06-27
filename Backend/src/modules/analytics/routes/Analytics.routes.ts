import { Router } from 'express';
import { AnalyticsController } from '../controllers/Analytics.controller';
import { AnalyticsService } from '../services/Analytics.service';
import { AnalyticsRepository } from '../repositories/Analytics.repository';
import { UserRepository } from '../../auth/repositories/User.repository';
import { authMiddleware } from '../../../middlewares/auth.middleware';

const router = Router();

const analyticsRepository = new AnalyticsRepository();
const userRepository = new UserRepository();
const analyticsService = new AnalyticsService(analyticsRepository, userRepository);
const analyticsController = new AnalyticsController(analyticsService);

router.get('/', authMiddleware, analyticsController.getAnalytics);
router.get('/insight', authMiddleware, analyticsController.getAnalyticsInsight);

export default router;
