import { Response } from 'express';
import { ApiErrorDetail } from './ApiError';

export interface ApiResponsePayload<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ApiErrorDetail[] | null;
}

export class ApiResponse {
  static success<T = unknown>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T
  ): Response {
    const payload: ApiResponsePayload<T> = {
      success: true,
      message,
    };

    if (data !== undefined) {
      payload.data = data;
    }

    return res.status(statusCode).json(payload);
  }

  static error(
    res: Response,
    statusCode: number,
    message: string,
    errors?: ApiErrorDetail[] | null
  ): Response {
    const payload: ApiResponsePayload = {
      success: false,
      message,
    };

    if (errors !== undefined) {
      payload.errors = errors;
    }

    return res.status(statusCode).json(payload);
  }
}

export default ApiResponse;
