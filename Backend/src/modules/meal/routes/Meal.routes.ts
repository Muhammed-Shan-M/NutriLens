import { Router } from 'express';
import { MealController } from '../controllers/Meal.controller';
import { MealService } from '../services/Meal.service';
import { MealRepository } from '../repositories/Meal.repository';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validation.middleware';
import { multerUpload, imageValidationMiddleware } from '../../../middlewares/imageUpload.middleware';
import { createMealSchema, updateMealSchema } from '../validators/Meal.validator';
import ROUTES from '../../../shared/routes.constants';

const router = Router();

// Dependency injection
const mealRepository = new MealRepository();
const mealService = new MealService(mealRepository);
const mealController = new MealController(mealService);

// GET /api/meals/today
router.get(
  ROUTES.MEALS.TODAY,
  authMiddleware,
  mealController.getToday
);

// GET /api/meals/history
router.get(
  ROUTES.MEALS.HISTORY,
  authMiddleware,
  mealController.getHistory
);

// GET /api/meals/:id
router.get(
  ROUTES.MEALS.BY_ID,
  authMiddleware,
  mealController.getById
);

// POST /api/meals (manual log)
router.post(
  ROUTES.MEALS.BASE,
  authMiddleware,
  validate(createMealSchema),
  mealController.create
);

// PUT /api/meals/:id
router.put(
  ROUTES.MEALS.BY_ID,
  authMiddleware,
  validate(updateMealSchema),
  mealController.update
);

// DELETE /api/meals/:id
router.delete(
  ROUTES.MEALS.BY_ID,
  authMiddleware,
  mealController.delete
);

// POST /api/meals/analyze
// Auth → Multer (memory) → File validation → Controller
router.post(
  ROUTES.MEALS.ANALYZE,
  authMiddleware,
  multerUpload,
  imageValidationMiddleware,
  mealController.analyze
);

export default router;
