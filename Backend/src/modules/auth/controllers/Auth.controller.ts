import { Request, Response, NextFunction } from 'express';
import { IAuthService } from '../interfaces/IAuthService.interface';
import { ApiResponse } from '../../../shared/ApiResponse';
import { UserMapper } from '../mappers/User.mapper';
import { config } from '../../../config';

export class AuthController {
  constructor(private authService: IAuthService) {}

  private setAuthCookies(res: Response, accessToken: string, refreshToken?: string): void {
    const isProduction = config.nodeEnv === 'production';
    
    // 1. Set Access Token Cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // 2. Set Refresh Token Cookie
    if (refreshToken) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
    }
  }

  public register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      
      // Set secure authentication cookies
      this.setAuthCookies(res, result.accessToken, result.refreshToken);

      ApiResponse.success(res, 201, 'User registered successfully', {
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.authService.login(req.body);
      
      // Set secure authentication cookies
      this.setAuthCookies(res, result.accessToken, result.refreshToken);

      ApiResponse.success(res, 200, 'User logged in successfully', {
        user: result.user,
        accessToken: result.accessToken,
      });
    } catch (error) {
      next(error);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Read refresh token from cookie or request body
      const token = req.cookies?.refreshToken || req.body?.refreshToken;
      const result = await this.authService.refreshToken(token);
      
      // Update the access token cookie
      this.setAuthCookies(res, result.accessToken);

      ApiResponse.success(res, 200, 'Token refreshed successfully', result);
    } catch (error) {
      next(error);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isProduction = config.nodeEnv === 'production';
      
      // Clear HTTP-only authentication cookies
      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
      });
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        path: '/',
      });

      ApiResponse.success(res, 200, 'User logged out successfully');
    } catch (error) {
      next(error);
    }
  };

  public me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const user = await this.authService.getCurrentUser(userId);
      
      ApiResponse.success(
        res,
        200,
        'Current user profile retrieved successfully',
        UserMapper.toResponseDto(user)
      );
    } catch (error) {
      next(error);
    }
  };

  public updateMetrics = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const user = await this.authService.updateMetrics(userId, req.body);
      
      ApiResponse.success(
        res,
        200,
        'Physical metrics updated successfully',
        UserMapper.toResponseDto(user)
      );
    } catch (error) {
      next(error);
    }
  };

  public completeOnboarding = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id;
      const user = await this.authService.completeOnboarding(userId);
      
      ApiResponse.success(
        res,
        200,
        'Onboarding completed successfully',
        UserMapper.toResponseDto(user)
      );
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
