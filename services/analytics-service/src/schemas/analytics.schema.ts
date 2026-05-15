import { z } from 'zod';

export const UserGrowthQuerySchema = z.object({
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  granularity: z.enum(['day', 'week', 'month']).default('day'),
});

export const OrderAnalyticsQuerySchema = z.object({
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  granularity: z.enum(['day', 'week', 'month']).default('day'),
});

export type UserGrowthQuery = z.infer<typeof UserGrowthQuerySchema>;
export type OrderAnalyticsQuery = z.infer<typeof OrderAnalyticsQuerySchema>;
