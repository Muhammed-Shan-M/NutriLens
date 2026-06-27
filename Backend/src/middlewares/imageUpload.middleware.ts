import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../shared/ApiError';
import { ERROR_MESSAGES } from '../shared/errorMessages.constants';

// ─── Allowed MIME types ────────────────────────────────────────────────────────
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

// ─── Multer config: memory storage, size limit, file type filter ──────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          ERROR_MESSAGES.FILE.UNSUPPORTED_TYPE(file.mimetype)
        )
      );
    }
  },
});

// ─── Single field upload middleware (field name: "image") ─────────────────────
export const multerUpload = (req: Request, res: Response, next: NextFunction): void => {
  const singleUpload = upload.single('image');
  singleUpload(req, res, (err: unknown) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return next(ApiError.badRequest(ERROR_MESSAGES.FILE.LIMIT_EXCEEDED));
      }
      return next(ApiError.badRequest(ERROR_MESSAGES.FILE.UPLOAD_ERROR(err.message)));
    }
    if (err instanceof Error) {
      return next(ApiError.badRequest(err.message));
    }
    next();
  });
};

// ─── Post-multer validation: ensure file is present ──────────────────────────
export const imageValidationMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.file) {
    return next(ApiError.badRequest(ERROR_MESSAGES.FILE.NO_IMAGE_UPLOADED));
  }
  next();
};
