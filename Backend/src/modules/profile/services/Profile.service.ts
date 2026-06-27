import { IProfileService } from '../interfaces/IProfileService.interface';
import { IUserRepository } from '../../auth/interfaces/IUserRepository.interface';
import { UpdateProfileInputDto, ProfileResponseDto } from '../dtos/Profile.dto';
import { ApiError } from '../../../shared/ApiError';
import { NutritionCalculator } from '../../../shared/utils/NutritionCalculator';
import { IUserDocument } from '../../auth/models/User.model';

export class ProfileService implements IProfileService {
  constructor(private readonly userRepository: IUserRepository) {}

  private toProfileResponseDto(user: IUserDocument): ProfileResponseDto {
    return {
      id: user.id || user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      age: user.age,
      gender: user.gender,
      height: user.height,
      weight: user.weight,
      activityLevel: user.activityLevel,
      goal: user.goal || user.fitnessGoal,
      bmi: user.bmi,
      bmiCategory: user.bmiCategory,
      bmr: user.bmr,
      tdee: user.tdee,
      dailyCalories: user.dailyCalories,
      protein: user.protein,
      carbs: user.carbs,
      fat: user.fat,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    };
  }

  async getProfile(userId: string): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User profile not found.');
    }
    return this.toProfileResponseDto(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileInputDto): Promise<ProfileResponseDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw ApiError.notFound('User profile not found.');
    }

    // Default to 'other' if gender is not set to prevent calculation crash
    const gender = user.gender || 'other';

    // Calculate new metrics
    const metrics = NutritionCalculator.calculateMetrics({
      age: dto.age,
      gender: gender,
      height: dto.height,
      weight: dto.weight,
      activityLevel: dto.activityLevel,
      goal: dto.goal,
    });

    // Update user in DB
    const updateData = {
      fullName: dto.fullName,
      age: dto.age,
      height: dto.height,
      weight: dto.weight,
      activityLevel: dto.activityLevel,
      goal: dto.goal,
      fitnessGoal: dto.goal, // Syncing both for compatibility
      ...metrics,
    };

    const updatedUser = await this.userRepository.update(userId, updateData);
    if (!updatedUser) {
      throw ApiError.internal('Failed to update profile.');
    }

    return this.toProfileResponseDto(updatedUser);
  }
}
