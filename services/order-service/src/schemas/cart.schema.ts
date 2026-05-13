import { z } from 'zod';

export const AddToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID wajib diisi'),
  quantity: z.number().positive('Quantity harus lebih dari 0'),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;

export const CheckoutSchema = z.object({
  shippingAddress: z.object({
    province: z.string().min(1, 'Provinsi wajib diisi'),
    city: z.string().min(1, 'Kota wajib diisi'),
    full_address: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
  }),
  notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;
