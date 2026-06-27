import { IUserDocument } from '../models/User.model';
import { UserResponseDto } from '../dtos/Auth.dto';

export class UserMapper {
  static toResponseDto(user: IUserDocument): UserResponseDto {
    return {
      id: user.id || user._id.toString(),
      fullName: user.fullName || user.name,
      email: user.email,
      role: user.role,
      isOnboarded: user.isOnboarded || false,
      age: user.age,
      gender: user.gender,
      weight: user.weight,
      height: user.height,
      activityLevel: user.activityLevel,
      fitnessGoal: user.fitnessGoal,
      goal: user.goal,
      bmi: user.bmi,
      bmiCategory: user.bmiCategory,
      bmr: user.bmr,
      tdee: user.tdee,
      dailyCalories: user.dailyCalories,
      protein: user.protein,
      carbs: user.carbs,
      fat: user.fat,
      createdAt: user.createdAt,
    };
  }
}

export default UserMapper;
