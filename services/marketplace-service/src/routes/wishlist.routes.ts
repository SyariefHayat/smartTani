import { Router } from 'express';
import wishlistController from '../controllers/wishlist.controller';
import { AddToWishlistSchema } from '../schemas/wishlist.schema';
import { validate } from '../../../../shared/middleware/validate';
import { gatewayAuthMiddleware } from '../middleware/auth.middleware';
import { authorize } from '../middleware/authorize.middleware';

const router = Router();

// Semua route wishlist memerlukan autentikasi dan otorisasi sebagai buyer
router.use(gatewayAuthMiddleware);
router.use(authorize(['buyer']));

router.get('/', wishlistController.getWishlist);
router.post('/', validate(AddToWishlistSchema), wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

export default router;
