import { z } from 'zod';

export const CreatePromotionSchema = z
  .object({
    title: z.string().min(3, 'Judul minimal 3 karakter'),
    type: z.enum(['discount_percent', 'discount_amount']),
    value: z.number().positive('Nilai harus lebih besar dari 0'),
    product_ids: z.array(z.string()).min(1, 'Minimal pilih satu produk'),
    start_date: z.string().transform((str) => new Date(str)),
    end_date: z.string().transform((str) => new Date(str)),
    status: z.enum(['active', 'inactive', 'scheduled']).optional(),
  })
  .refine((data) => data.end_date > data.start_date, {
    message: 'Tanggal selesai harus setelah tanggal mulai',
    path: ['end_date'],
  });

export const UpdatePromotionSchema = z
  .object({
    title: z.string().min(3, 'Judul minimal 3 karakter').optional(),
    type: z.enum(['discount_percent', 'discount_amount']).optional(),
    value: z.number().positive('Nilai harus lebih besar dari 0').optional(),
    product_ids: z.array(z.string()).min(1, 'Minimal pilih satu produk').optional(),
    start_date: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    end_date: z
      .string()
      .transform((str) => new Date(str))
      .optional(),
    status: z.enum(['active', 'inactive', 'scheduled', 'expired']).optional(),
  })
  .refine(
    (data) => {
      if (data.start_date && data.end_date) {
        return data.end_date > data.start_date;
      }
      return true;
    },
    {
      message: 'Tanggal selesai harus setelah tanggal mulai',
      path: ['end_date'],
    }
  );

export type CreatePromotionInput = z.infer<typeof CreatePromotionSchema>;
export type UpdatePromotionInput = z.infer<typeof UpdatePromotionSchema>;
