import { Router } from 'express';
import { ProfileController } from '../controllers/Profile.controller';
import { ProfileService } from '../services/Profile.service';
import { UserRepository } from '../../auth/repositories/User.repository';
import authMiddleware from '../../../middlewares/auth.middleware';
import ROUTES from '../../../shared/routes.constants';

const router = Router();

const userRepository = new UserRepository();
const profileService = new ProfileService(userRepository);
const profileController = new ProfileController(profileService);

router.get(ROUTES.PROFILE.BASE, authMiddleware, profileController.getProfile);
router.patch(ROUTES.PROFILE.BASE, authMiddleware, profileController.updateProfile);

export default router;
