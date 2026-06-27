export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly errors: ApiErrorDetail[] | null;
  public readonly success: boolean;

  constructor(statusCode: number, message: string, errors: ApiErrorDetail[] | null = null, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  // Predefined static helper factory methods
  static badRequest(message: string, errors: ApiErrorDetail[] | null = null) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message: string = 'Unauthorized access') {
    return new ApiError(401, message);
  }

  static forbidden(message: string = 'Forbidden action') {
    return new ApiError(403, message);
  }

  static notFound(message: string = 'Resource not found') {
    return new ApiError(404, message);
  }

  static internal(message: string = 'Internal server error') {
    return new ApiError(500, message);
  }

  static unprocessable(message: string = 'Unprocessable content') {
    return new ApiError(422, message);
  }
}

export default ApiError;
