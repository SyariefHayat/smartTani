import { z } from 'zod';

export const AddToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID wajib diisi'),
  quantity: z.number().positive('Quantity harus lebih dari 0'),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;

export const UpdateCartItemSchema = z.object({
  quantity: z.number().positive('Quantity harus lebih dari 0'),
});

export type UpdateCartItemInput = z.infer<typeof UpdateCartItemSchema>;

export const CheckoutSchema = z.object({
  shippingAddress: z.object({
    recipient_name: z.string().min(2, 'Nama penerima minimal 2 karakter'),
    phone_number: z.string().min(10, 'Nomor telepon minimal 10 digit'),
    province: z.string().min(1, 'Provinsi wajib diisi'),
    city: z.string().min(1, 'Kota wajib diisi'),
    full_address: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
    postal_code: z.string().min(5, 'Kode pos minimal 5 digit'),
  }),
  notes: z.string().optional(),
});

export type CheckoutInput = z.infer<typeof CheckoutSchema>;
