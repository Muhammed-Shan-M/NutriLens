import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../shared/ApiError';

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
          `Unsupported file type: ${file.mimetype}. Only JPEG, PNG, and WEBP images are accepted.`
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
        return next(ApiError.badRequest('Image file is too large. Maximum allowed size is 10MB.'));
      }
      return next(ApiError.badRequest(`Upload error: ${err.message}`));
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
    return next(ApiError.badRequest('No image was uploaded. Please include an image file in your request.'));
  }
  next();
};
