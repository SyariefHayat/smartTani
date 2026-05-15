import { z } from 'zod';

export const CreateProposalSchema = z.object({
  title: z.string().min(5, 'Judul proposal minimal 5 karakter').max(255),
  commodity: z.string().min(3, 'Komoditas minimal 3 karakter').max(100),
  land_area_ha: z.number().positive('Luas lahan harus positif'),
  location: z.object({
    province: z.string().min(1, 'Provinsi wajib diisi'),
    city: z.string().min(1, 'Kota/Kabupaten wajib diisi'),
    district: z.string().min(1, 'Kecamatan wajib diisi'),
    full_address: z.string().min(5, 'Alamat lengkap wajib diisi'),
  }),
  funding_needed: z.number().positive('Dana yang dibutuhkan harus positif'),
  projected_roi_percent: z.number().min(0, 'Proyeksi ROI tidak boleh negatif'),
  duration_days: z.number().int().positive('Durasi harus berupa angka positif'),
  harvest_date_estimated: z.string().datetime('Format tanggal panen tidak valid'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  use_of_funds: z.string().min(10, 'Penggunaan dana minimal 10 karakter'),
  risk_notes: z.string().min(10, 'Catatan risiko minimal 10 karakter'),
});

export const GetProposalsQuerySchema = z.object({
  status: z.string().optional(),
  category: z.string().optional(), // Maps to commodity
  location_province: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

export const RejectProposalSchema = z.object({
  reason: z.string().min(10, 'Alasan penolakan minimal 10 karakter').max(1000),
});

export const ProposalIdSchema = z.object({
  id: z.string().uuid('Format ID proposal tidak valid'),
});

export const UpdateProposalSchema = CreateProposalSchema.partial();

export type CreateProposalInput = z.infer<typeof CreateProposalSchema>;
export type UpdateProposalInput = z.infer<typeof UpdateProposalSchema>;
export type GetProposalsQuery = z.infer<typeof GetProposalsQuerySchema>;
