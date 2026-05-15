import { Request, Response, NextFunction } from 'express';
import cartService from '../services/cart.service';
import { successResponse } from '../../../../shared/utils/response';
import { AppRequest } from '../../../../shared/types/express';

export class CartController {
  async addToCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AppRequest).user!.id;
      const cart = await cartService.addToCart(userId, req.body);
      return res.status(200).json(successResponse(cart));
    } catch (error) {
      next(error);
    }
  }

  async updateCartItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const userId = (req as AppRequest).user!.id;
      const cart = await cartService.updateCartItem(userId, id as string, quantity);
      return res.status(200).json(successResponse(cart));
    } catch (error) {
      next(error);
    }
  }

  async getCart(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as AppRequest).user!.id;
      const cart = await cartService.getCart(userId);
      return res.status(200).json(successResponse(cart));
    } catch (error) {
      next(error);
    }
  }

  async removeFromCart(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as AppRequest).user!.id;
      const cart = await cartService.removeFromCart(userId, id as string);
      return res.status(200).json(successResponse(cart));
    } catch (error) {
      next(error);
    }
  }
}

export default new CartController();
