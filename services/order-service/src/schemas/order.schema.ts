import { z } from 'zod';

export const GetOrdersQuerySchema = z.object({
  status: z.string().optional(),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('20').transform(Number),
});

export const OrderIdSchema = z.object({
  id: z.string().uuid('Format ID order tidak valid'),
});

export const RefundSchema = z.object({
  reason: z.string().min(10, 'Alasan refund minimal 10 karakter'),
});

export type GetOrdersQuery = z.infer<typeof GetOrdersQuerySchema>;
export type OrderIdInput = z.infer<typeof OrderIdSchema>;
export type RefundInput = z.infer<typeof RefundSchema>;
