import { Request, Response, NextFunction } from 'express';
import paymentService from '../services/payment.service';
import { successResponse } from '../../../../shared/utils/response';
import { AppRequest } from '../../../../shared/types/express';

export class PaymentController {
  async initiate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, email, full_name } = (req as AppRequest).user!;
      const result = await paymentService.initiatePayment(
        id,
        email as string,
        full_name as string,
        req.body
      );
      return res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();
