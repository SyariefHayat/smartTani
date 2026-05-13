import { z } from 'zod';

export const InitiatePaymentSchema = z.object({
  orderId: z.string().uuid('Order ID tidak valid'),
  paymentMethod: z.string().optional(), // Can be used for specific channels if needed
});

export type InitiatePaymentInput = z.infer<typeof InitiatePaymentSchema>;
