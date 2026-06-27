import { Router } from 'express';
import { HistoryController } from '../controllers/History.controller';
import { HistoryService } from '../services/History.service';
import { HistoryRepository } from '../repositories/History.repository';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validation.middleware';
import { getHistoryQuerySchema } from '../validators/History.validator';
import ROUTES from '../../../shared/routes.constants';

const router = Router();

// Dependency Injection
const historyRepository = new HistoryRepository();
const historyService = new HistoryService(historyRepository);
const historyController = new HistoryController(historyService);

// GET /api/history
router.get(
  ROUTES.HISTORY.BASE,
  authMiddleware,
  validate(getHistoryQuerySchema),
  historyController.getHistory
);

export default router;
