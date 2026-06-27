import { Router } from 'express';
import { AuthController } from '../controllers/Auth.controller';
import { AuthService } from '../services/Auth.service';
import { UserRepository } from '../repositories/User.repository';
import { validate } from '../../../middlewares/validation.middleware';
import { authMiddleware } from '../../../middlewares/auth.middleware';
import { signupSchema, loginSchema, updateMetricsSchema } from '../validators/Auth.validator';

const router = Router();

// Instantiate the component dependencies (Dependency Injection)
const userRepository = new UserRepository();
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

// Authentication Endpoints
router.post('/signup', validate(signupSchema), authController.register);
router.post('/register', validate(signupSchema), authController.register); // Alias for compatibility
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refresh);
router.post('/refresh', authController.refresh); // Alias for compatibility
router.post('/logout', authController.logout);

// Protected Endpoints
router.get('/me', authMiddleware, authController.me);
router.put('/metrics', authMiddleware, validate(updateMetricsSchema), authController.updateMetrics);
router.put('/complete-onboarding', authMiddleware, authController.completeOnboarding);

export default router;
