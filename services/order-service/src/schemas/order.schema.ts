import { z } from 'zod';

export const GetOrdersQuerySchema = z.object({
  status: z.string().optional(),
  from_date: z.string().datetime().optional(),
  to_date: z.string().datetime().optional(),
  page: z.string().optional().default('1').transform(Number),
  limit: z.string().optional().default('20').transform(Number),
});

export type GetOrdersQuery = z.infer<typeof GetOrdersQuerySchema>;
