import { z } from 'zod';

export const AddToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID wajib diisi'),
  quantity: z.number().positive('Quantity harus lebih dari 0'),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;
