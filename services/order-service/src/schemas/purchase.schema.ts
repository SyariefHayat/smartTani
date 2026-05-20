import { z } from 'zod';

export const CreatePurchaseSchema = z.object({
  supplier_name: z.string().min(2, 'Nama pemasok minimal 2 karakter'),
  item_name: z.string().min(2, 'Nama barang minimal 2 karakter'),
  quantity: z.number().positive('Kuantitas harus positif'),
  unit: z.string().min(1, 'Satuan wajib diisi'),
  total_cost: z.number().positive('Total biaya harus positif'),
  purchase_date: z.string().transform((str) => new Date(str)),
  notes: z.string().optional(),
  receipt_url: z.string().url('URL bukti tidak valid').optional().or(z.literal('')),
});

export const UpdatePurchaseSchema = z.object({
  supplier_name: z.string().min(2, 'Nama pemasok minimal 2 karakter').optional(),
  item_name: z.string().min(2, 'Nama barang minimal 2 karakter').optional(),
  quantity: z.number().positive('Kuantitas harus positif').optional(),
  unit: z.string().min(1, 'Satuan wajib diisi').optional(),
  total_cost: z.number().positive('Total biaya harus positif').optional(),
  purchase_date: z
    .string()
    .transform((str) => new Date(str))
    .optional(),
  notes: z.string().optional(),
  receipt_url: z.string().url('URL bukti tidak valid').optional().or(z.literal('')),
});

export type CreatePurchaseInput = z.infer<typeof CreatePurchaseSchema>;
export type UpdatePurchaseInput = z.infer<typeof UpdatePurchaseSchema>;
