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

export const FarmerRevenueChartQuerySchema = z.object({
  from_date: z.string().optional(),
  to_date: z.string().optional(),
});

export const FarmerFinanceQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 1)),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val) : 20)),
});

export type UserGrowthQuery = z.infer<typeof UserGrowthQuerySchema>;
export type OrderAnalyticsQuery = z.infer<typeof OrderAnalyticsQuerySchema>;
