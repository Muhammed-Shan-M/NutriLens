import { Request, Response, NextFunction } from 'express';
import { IProfileService } from '../interfaces/IProfileService.interface';
import { ApiResponse } from '../../../shared/ApiResponse';
import { ApiError } from '../../../shared/ApiError';
import { updateProfileSchema } from '../validators/Profile.validator';
import { UpdateProfileInputDto } from '../dtos/Profile.dto';
import { SUCCESS_MESSAGES } from '../../../shared/successMessages.constants';
import { ERROR_MESSAGES } from '../../../shared/errorMessages.constants';

export class ProfileController {
  constructor(private readonly profileService: IProfileService) {
    this.getProfile = this.getProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized(ERROR_MESSAGES.AUTH.REQUIRED));
      }

      const profile = await this.profileService.getProfile(userId);
      ApiResponse.success(res, 200, SUCCESS_MESSAGES.PROFILE.RETRIEVED, profile);
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return next(ApiError.unauthorized(ERROR_MESSAGES.AUTH.REQUIRED));
      }

      const validatedData = updateProfileSchema.parse(req.body) as UpdateProfileInputDto;
      
      const updatedProfile = await this.profileService.updateProfile(userId, validatedData);
      ApiResponse.success(res, 200, SUCCESS_MESSAGES.PROFILE.UPDATED, updatedProfile);
    } catch (error) {
      next(error);
    }
  }
}
