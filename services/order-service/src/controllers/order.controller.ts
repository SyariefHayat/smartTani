import { Request, Response, NextFunction } from 'express';
import orderService from '../services/order.service';
import { successResponse } from '../../../../shared/utils/response';
import { AppRequest } from '../../../../shared/types/express';

export class OrderController {
  async checkout(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AppRequest).user!.id;
      const order = await orderService.checkout(userId, req.body);
      return res.status(201).json(successResponse(order));
    } catch (error) {
      next(error);
    }
  }
}

export default new OrderController();
