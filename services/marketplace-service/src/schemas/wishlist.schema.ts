import { z } from 'zod';

export const AddToWishlistSchema = z.object({
  productId: z.string().min(1, 'Product ID wajib diisi'),
});

export type AddToWishlistInput = z.infer<typeof AddToWishlistSchema>;
