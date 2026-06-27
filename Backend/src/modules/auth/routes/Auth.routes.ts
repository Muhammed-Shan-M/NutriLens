import { Router } from 'express';
import { AuthController } from '../controllers/Auth.controller';
import { AuthService } from '../services/Auth.service';
import { UserRepository } from '../repositories/User.repository';
import { validate } from '../../../middlewares/validation.middleware';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { signupSchema, loginSchema, updateMetricsSchema } from '../validators/Auth.validator';
import ROUTES from '../../../shared/routes.constants';

const router = Router();

// Instantiate the component dependencies (Dependency Injection)
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Authentication Endpoints
router.post(ROUTES.AUTH.SIGNUP, validate(signupSchema), authController.register);
router.post(ROUTES.AUTH.REGISTER, validate(signupSchema), authController.register); // Alias for compatibility
router.post(ROUTES.AUTH.LOGIN, validate(loginSchema), authController.login);
router.post(ROUTES.AUTH.REFRESH_TOKEN, authController.refresh);
router.post(ROUTES.AUTH.REFRESH, authController.refresh); // Alias for compatibility
router.post(ROUTES.AUTH.LOGOUT, authController.logout);

// Protected Endpoints
router.get(ROUTES.AUTH.ME, authMiddleware, authController.me);
router.put(ROUTES.AUTH.METRICS, authMiddleware, validate(updateMetricsSchema), authController.updateMetrics);
router.put(ROUTES.AUTH.COMPLETE_ONBOARDING, authMiddleware, authController.completeOnboarding);

export default router;
