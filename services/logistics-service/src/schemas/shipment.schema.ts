import { z } from 'zod';

export const GetShipmentsQuerySchema = z.object({
  status: z.string().optional(),
  page: z.string().optional().transform(Number).default(1),
  limit: z.string().optional().transform(Number).default(20),
});

export type GetShipmentsQuery = z.infer<typeof GetShipmentsQuerySchema>;
