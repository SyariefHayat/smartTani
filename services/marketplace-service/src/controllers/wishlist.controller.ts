import { Response, NextFunction } from 'express';
import { AppRequest } from '../../../../shared/types/express';
import wishlistService from '../services/wishlist.service';
import { successResponse } from '../../../../shared/utils/response';

export class WishlistController {
  async getWishlist(req: AppRequest, res: Response, next: NextFunction) {
    try {
      const buyerId = req.user!.id;
      const items = await wishlistService.getWishlist(buyerId);

      const mappedItems = items
        .map((item) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const prod: any = item.product_id;
          if (!prod) return null;

          return {
            id: item._id.toString(),
            buyer_id: item.buyer_id,
            product_id: prod._id ? prod._id.toString() : prod.toString(),
            created_at: item.createdAt.toISOString(),
            product: prod._id
              ? {
                  id: prod._id.toString(),
                  _id: prod._id.toString(),
                  title: prod.title,
                  price_per_unit: prod.price_per_unit,
                  stock: prod.stock,
                  images: prod.images,
                  description: prod.description,
                }
              : undefined,
          };
        })
        .filter(Boolean);

      return res.status(200).json(successResponse(mappedItems));
    } catch (error) {
      next(error);
    }
  }

  async addToWishlist(req: AppRequest, res: Response, next: NextFunction) {
    try {
      const buyerId = req.user!.id;
      const { productId } = req.body;

      const item = await wishlistService.addToWishlist(buyerId, productId);
      
      return res.status(201).json(
        successResponse({
          id: item._id.toString(),
          buyer_id: item.buyer_id,
          product_id: productId,
          created_at: item.createdAt?.toISOString() || new Date().toISOString(),
        })
      );
    } catch (error) {
      next(error);
    }
  }

  async removeFromWishlist(req: AppRequest, res: Response, next: NextFunction) {
    try {
      const buyerId = req.user!.id;
      const productId = req.params.productId as string;

      const result = await wishlistService.removeFromWishlist(buyerId, productId);
      return res.status(200).json(successResponse(result));
    } catch (error) {
      next(error);
    }
  }
}

export default new WishlistController();
