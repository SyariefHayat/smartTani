import { z } from 'zod';

export const CreateInvestmentSchema = z.object({
  proposalId: z.string().uuid('Format ID proposal tidak valid'),
  amount: z.number().positive('Jumlah investasi harus positif'),
});

export const CompleteInvestmentSchema = z.object({
  actualReturnPercent: z.number().min(-100, 'Persentase pengembalian tidak valid'),
});

export type CreateInvestmentInput = z.infer<typeof CreateInvestmentSchema>;
export type CompleteInvestmentInput = z.infer<typeof CompleteInvestmentSchema>;
