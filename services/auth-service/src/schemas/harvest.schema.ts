import { z } from 'zod';

export const CreateHarvestSchema = z.object({
  land_id: z.string().uuid('ID lahan tidak valid'),
  crop_name: z.string().min(2, 'Nama tanaman minimal 2 karakter'),
  quantity: z.number().positive('Kuantitas harus positif'),
  unit: z.string().min(1, 'Satuan wajib diisi'),
  harvest_date: z.string().min(1, 'Tanggal panen wajib diisi'),
  quality_grade: z.enum(['A', 'B', 'C']),
  notes: z.string().optional(),
});

export const UpdateHarvestSchema = z.object({
  land_id: z.string().uuid('ID lahan tidak valid').optional(),
  crop_name: z.string().min(2, 'Nama tanaman minimal 2 karakter').optional(),
  quantity: z.number().positive('Kuantitas harus positif').optional(),
  unit: z.string().min(1, 'Satuan wajib diisi').optional(),
  harvest_date: z.string().min(1, 'Tanggal panen wajib diisi').optional(),
  quality_grade: z.enum(['A', 'B', 'C']).optional(),
  notes: z.string().optional(),
});

export type CreateHarvestInput = z.infer<typeof CreateHarvestSchema>;
export type UpdateHarvestInput = z.infer<typeof UpdateHarvestSchema>;
