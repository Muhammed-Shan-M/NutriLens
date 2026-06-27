import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../shared/ApiError';
import { ApiResponse } from '../shared/ApiResponse';
import { ERROR_MESSAGES } from '../shared/errorMessages.constants';

interface ValidationErrorField {
  field: string;
  message: string;
}

interface MongooseDuplicateKeyError extends Error {
  code: number;
  keyValue?: Record<string, unknown>;
}

interface MongooseValidationError extends Error {
  errors?: Record<string, { path: string; message: string }>;
}

interface ZodValidationError extends Error {
  errors: ValidationErrorField[];
}

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = ERROR_MESSAGES.AUTH.INTERNAL_SERVER_ERROR_FALLBACK;
  let errors: ValidationErrorField[] | null = null;

  // Handle custom ApiError instances
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors as ValidationErrorField[] | null;
  }
  // Handle Mongo / Mongoose duplicate key errors
  else if (
    typeof err === 'object' &&
    err !== null &&
    (err as MongooseDuplicateKeyError).code === 11000
  ) {
    const dupErr = err as MongooseDuplicateKeyError;
    statusCode = 409;
    const field = Object.keys(dupErr.keyValue || {})[0] || 'field';
    message = ERROR_MESSAGES.DATABASE.DUPLICATE_VALUE(field);
  }
  // Handle generic validation errors (like Mongoose validation)
  else if (err instanceof Error && err.name === 'ValidationError') {
    const validationErr = err as MongooseValidationError;
    statusCode = 400;
    message = validationErr.message;
    errors = Object.values(validationErr.errors || {}).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }
  // Handle Zod validation errors
  else if (err instanceof Error && err.name === 'ZodError') {
    const zodErr = err as ZodValidationError;
    statusCode = 400;
    message = ERROR_MESSAGES.VALIDATION.ERROR_OCCURRED;
    errors = zodErr.errors;
  }
  // Default fallback for general errors
  else if (err instanceof Error) {
    message = err.message;
  }

  // Log server errors for diagnostics in development
  if (process.env.NODE_ENV !== 'production' && statusCode === 500) {
    console.error('Unhandled Server Error Trace:', err);
  }

  ApiResponse.error(res, statusCode, message, errors ?? undefined);
};

export default errorMiddleware;
