import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { AppError } from '../../../../shared/types/express';

// Use memory storage to process files before S3 upload
const storage = multer.memoryStorage();

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Format file tidak valid. Hanya JPEG, PNG, dan WebP yang diizinkan.'));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  fileFilter,
});

export const handleMulterError = (
  err: Error | multer.MulterError,
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const error = new Error('Ukuran file terlalu besar. Maksimal 2MB.') as AppError;
      error.statusCode = 400;
      error.code = 'MARKET_002';
      return next(error);
    }
  }

  if (err.message && err.message.includes('Format file tidak valid')) {
    const error = err as AppError;
    error.statusCode = 400;
    error.code = 'MARKET_003';
    return next(error);
  }

  next(err);
};
