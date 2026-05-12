import { Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { errorResponse } from '../utils/response';
import { ErrorCode } from '../constants/errorCodes';
import { AppRequest } from '../types/express';

/**
 * Higher-order middleware to validate request body using Zod
 */
export const validate = (schema: ZodSchema) => {
  return (req: AppRequest, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res
        .status(422)
        .json(errorResponse(ErrorCode.VALIDATION_ERROR, JSON.stringify(result.error.format())));
    }

    // Replace req.body with the parsed and potentially transformed data
    req.body = result.data;
    next();
  };
};
