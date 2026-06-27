import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAuthService } from '../interfaces/IAuthService.interface';
import { IUserRepository } from '../interfaces/IUserRepository.interface';
import { RegisterInputDto, LoginInputDto, UpdateMetricsInputDto, AuthResponseDto } from '../dtos/Auth.dto';
import { IUserDocument } from '../models/User.model';
import { ApiError } from '../../../shared/ApiError';
import { config } from '../../../config';
import { UserMapper } from '../mappers/User.mapper';
import { NutritionCalculator } from '../../../shared/utils/NutritionCalculator';

export class AuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  private generateAccessToken(user: IUserDocument): string {
    const payload = {
      id: user.id || user._id.toString(),
      email: user.email,
      role: user.role,
    };
    return jwt.sign(payload, config.jwtAccessSecret, { expiresIn: '15m' });
  }

  private generateRefreshToken(user: IUserDocument): string {
    const payload = {
      id: user.id || user._id.toString(),
    };
    return jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: '7d' });
  }

  async register(dto: RegisterInputDto): Promise<AuthResponseDto> {
    const existing = await this.userRepository.findByEmail(dto.email);
    if (existing) {
      throw ApiError.badRequest('A user with this email address already exists.');
    }

    if (!dto.password) {
      throw ApiError.badRequest('Password is required.');
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    // Save user with initial onboarding state set to false
    const newUser = await this.userRepository.create({
      fullName: dto.fullName,
      email: dto.email,
      password: hashedPassword,
      isOnboarded: false,
    });

    const accessToken = this.generateAccessToken(newUser);
    const refreshToken = this.generateRefreshToken(newUser);

    return {
      user: UserMapper.toResponseDto(newUser),
      accessToken,
      refreshToken,
    };
  }

  async login(dto: LoginInputDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user || !user.password) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    if (!dto.password) {
      throw ApiError.badRequest('Password is required.');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken(user);

    return {
      user: UserMapper.toResponseDto(user),
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(token: string): Promise<{ accessToken: string }> {
    if (!token) {
      throw ApiError.unauthorized('Refresh token is missing. Please sign in again.');
    }

    try {
      const decoded = jwt.verify(token, config.jwtRefreshSecret) as { id: string };
      const user = await this.userRepository.findById(decoded.id);
      
      if (!user) {
        throw ApiError.unauthorized('User associated with this token was not found.');
      }

      const accessToken = this.generateAccessToken(user);
      return { accessToken };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'TokenExpiredError') {
        throw new ApiError(401, 'Your refresh session has expired. Please sign in again.');
      }
      throw ApiError.unauthorized('Invalid refresh session. Please sign in again.');
    }
  }

  async updateMetrics(id: string, dto: UpdateMetricsInputDto): Promise<IUserDocument> {
    const { age, gender, height, weight, activityLevel, goal } = dto;

    if (!age || !gender || !height || !weight || !activityLevel || !goal) {
      throw ApiError.badRequest('All onboarding metrics are required.');
    }

    // Calculate all metrics using the shared utility
    const metrics = NutritionCalculator.calculateMetrics({
      age,
      gender,
      height,
      weight,
      activityLevel,
      goal,
    });

    const updateData = {
      age,
      gender,
      height,
      weight,
      activityLevel,
      goal,
      ...metrics,
      isOnboarded: false, // Keep false until Start Tracking is clicked
    };

    const updatedUser = await this.userRepository.update(id, updateData);
    if (!updatedUser) {
      throw ApiError.notFound('User profile not found.');
    }

    return updatedUser;
  }

  async completeOnboarding(id: string): Promise<IUserDocument> {
    const updatedUser = await this.userRepository.update(id, { isOnboarded: true });
    if (!updatedUser) {
      throw ApiError.notFound('User profile not found.');
    }
    return updatedUser;
  }

  async getCurrentUser(id: string): Promise<IUserDocument> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw ApiError.unauthorized('User session is invalid. User not found.');
    }
    return user;
  }
}

export default AuthService;
