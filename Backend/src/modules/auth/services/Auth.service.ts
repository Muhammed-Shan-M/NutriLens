import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { IAuthService } from '../interfaces/IAuthService.interface';
import { IUserRepository } from '../interfaces/IUserRepository.interface';
import { RegisterInputDto, LoginInputDto, UpdateMetricsInputDto, AuthResponseDto } from '../dtos/Auth.dto';
import { IUserDocument } from '../models/User.model';
import { ApiError } from '../../../shared/ApiError';
import { config } from '../../../config';
import { ERROR_MESSAGES } from '../../../shared/errorMessages.constants';
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
      throw ApiError.badRequest(ERROR_MESSAGES.AUTH.EMAIL_EXISTS);
    }

    if (!dto.password) {
      throw ApiError.badRequest(ERROR_MESSAGES.AUTH.PASSWORD_REQUIRED);
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
      throw ApiError.unauthorized(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    if (!dto.password) {
      throw ApiError.badRequest(ERROR_MESSAGES.AUTH.PASSWORD_REQUIRED);
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw ApiError.unauthorized(ERROR_MESSAGES.AUTH.INVALID_CREDENTIALS);
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
      throw ApiError.unauthorized(ERROR_MESSAGES.AUTH.REFRESH_TOKEN_MISSING);
    }

    try {
      const decoded = jwt.verify(token, config.jwtRefreshSecret) as { id: string };
      const user = await this.userRepository.findById(decoded.id);
      
      if (!user) {
        throw ApiError.unauthorized(ERROR_MESSAGES.AUTH.TOKEN_USER_NOT_FOUND);
      }

      const accessToken = this.generateAccessToken(user);
      return { accessToken };
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'TokenExpiredError') {
        throw new ApiError(401, ERROR_MESSAGES.AUTH.REFRESH_SESSION_EXPIRED);
      }
      throw ApiError.unauthorized(ERROR_MESSAGES.AUTH.INVALID_REFRESH_SESSION);
    }
  }

  async updateMetrics(id: string, dto: UpdateMetricsInputDto): Promise<IUserDocument> {
    const { age, gender, height, weight, activityLevel, goal } = dto;

    if (!age || !gender || !height || !weight || !activityLevel || !goal) {
      throw ApiError.badRequest(ERROR_MESSAGES.AUTH.METRICS_REQUIRED);
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
      throw ApiError.notFound(ERROR_MESSAGES.PROFILE.NOT_FOUND);
    }

    return updatedUser;
  }

  async completeOnboarding(id: string): Promise<IUserDocument> {
    const updatedUser = await this.userRepository.update(id, { isOnboarded: true });
    if (!updatedUser) {
      throw ApiError.notFound(ERROR_MESSAGES.PROFILE.NOT_FOUND);
    }
    return updatedUser;
  }

  async getCurrentUser(id: string): Promise<IUserDocument> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw ApiError.unauthorized(ERROR_MESSAGES.AUTH.SESSION_INVALID_USER_NOT_FOUND);
    }
    return user;
  }
}

export default AuthService;
