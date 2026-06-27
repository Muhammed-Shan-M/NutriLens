import { ActivityLevel, FitnessGoal, UserRole } from '../../../shared/enums';

// Signup Request Payload DTO
export interface SignupRequestDto {
  fullName: string;
  email: string;
  password?: string;
}

// Login Request Payload DTO
export interface LoginRequestDto {
  email: string;
  password?: string;
}

// Profile Metrics Update Payload DTO
export interface UpdateMetricsInputDto {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  activityLevel?: ActivityLevel;
  fitnessGoal?: FitnessGoal;
  goal?: string;
}

// User Profile Safe Response DTO
export interface UserResponseDto {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  isOnboarded: boolean;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  activityLevel?: ActivityLevel;
  fitnessGoal?: FitnessGoal;
  goal?: string;
  bmi?: number;
  bmiCategory?: string;
  bmr?: number;
  tdee?: number;
  dailyCalories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  createdAt: Date;
}

// Signup Response DTO
export interface SignupResponseDto {
  user: UserResponseDto;
  accessToken: string;
  refreshToken?: string;
}

// Login Response DTO
export interface LoginResponseDto {
  user: UserResponseDto;
  accessToken: string;
  refreshToken?: string;
}

// Refresh Token Response DTO
export interface RefreshTokenResponseDto {
  accessToken: string;
}

// Current User Response DTO
export type CurrentUserResponseDto = UserResponseDto;

// Aliases for backward compatibility with Step 1
export type RegisterInputDto = SignupRequestDto;
export type LoginInputDto = LoginRequestDto;
export type AuthResponseDto = SignupResponseDto;
