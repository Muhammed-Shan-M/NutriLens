import { Router } from 'express';
import { MealController } from '../controllers/Meal.controller';
import { MealService } from '../services/Meal.service';
import { MealRepository } from '../repositories/Meal.repository';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { validate } from '../../../middlewares/validation.middleware';
import { multerUpload, imageValidationMiddleware } from '../../../middlewares/imageUpload.middleware';
import { createMealSchema, updateMealSchema } from '../validators/Meal.validator';

const router = Router();

// Dependency injection
const mealRepository = new MealRepository();
const mealService = new MealService(mealRepository);
const mealController = new MealController(mealService);

// GET /api/meals/today
router.get(
  '/today',
  authMiddleware,
  mealController.getToday
);

// GET /api/meals/history
router.get(
  '/history',
  authMiddleware,
  mealController.getHistory
);

// GET /api/meals/:id
router.get(
  '/:id',
  authMiddleware,
  mealController.getById
);

// POST /api/meals (manual log)
router.post(
  '/',
  authMiddleware,
  validate(createMealSchema),
  mealController.create
);

// PUT /api/meals/:id
router.put(
  '/:id',
  authMiddleware,
  validate(updateMealSchema),
  mealController.update
);

// DELETE /api/meals/:id
router.delete(
  '/:id',
  authMiddleware,
  mealController.delete
);

// POST /api/meals/analyze
// Auth → Multer (memory) → File validation → Controller
router.post(
  '/analyze',
  authMiddleware,
  multerUpload,
  imageValidationMiddleware,
  mealController.analyze
);

export default router;
