import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue, ZodTypeAny } from 'zod';
import { ApiError } from '../shared/ApiError';

export const validate = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate body, query, and params
      const parsed = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      }) as { body?: Record<string, unknown>; query?: Record<string, unknown>; params?: Record<string, string> };

      // Assign back validated parsed values
      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) req.query = parsed.query as typeof req.query;
      if (parsed.params !== undefined) req.params = parsed.params as typeof req.params;

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const validationErrors = error.issues.map((issue: ZodIssue) => ({
          field: issue.path.slice(1).join('.'), // Remove top level 'body', 'query', or 'params'
          message: issue.message,
        }));

        next(new ApiError(400, 'Validation failure', validationErrors));
      } else {
        next(error);
      }
    }
  };
};

export default validate;
