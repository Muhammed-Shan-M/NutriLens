import { Request, Response, NextFunction } from 'express';
import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken';
import { config } from '../config';
import { ApiError } from '../shared/ApiError';
import { UserRole } from '../shared/enums';
import { ERROR_MESSAGES } from '../shared/errorMessages.constants';

interface DecodedToken {
  id: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    let token = '';

    // 1. Read token from Authorization Header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }

    // 2. Fallback to cookie
    if (!token && req.cookies) {
      token = req.cookies.accessToken;
    }

    // 3. Reject if no token is found
    if (!token) {
      return next(ApiError.unauthorized(ERROR_MESSAGES.AUTH.TOKEN_MISSING));
    }

    // 4. Verify token
    jwt.verify(token, config.jwtAccessSecret, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          return next(new ApiError(401, ERROR_MESSAGES.AUTH.SESSION_EXPIRED));
        }
        return next(ApiError.unauthorized(ERROR_MESSAGES.AUTH.TOKEN_INVALID));
      }

      // 5. Attach decoded user payload to request
      const payload = decoded as DecodedToken;
      req.user = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };

      next();
    });
  } catch (error) {
    next(error);
  }
};

export default authMiddleware;
