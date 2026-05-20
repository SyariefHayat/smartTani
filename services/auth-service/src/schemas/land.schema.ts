import { z } from 'zod';

export const CreateLandSchema = z.object({
  name: z.string().min(2, 'Nama lahan minimal 2 karakter'),
  location_province: z.string().min(1, 'Provinsi wajib diisi'),
  location_city: z.string().min(1, 'Kota/Kabupaten wajib diisi'),
  location_district: z.string().min(1, 'Kecamatan wajib diisi'),
  full_address: z.string().min(5, 'Alamat lengkap minimal 5 karakter'),
  area_ha: z.number().positive('Luas lahan harus positif'),
  soil_type: z.string().optional(),
  status: z.enum(['active', 'fallow', 'rented']).default('active'),
  current_crop: z.string().optional(),
  notes: z.string().optional(),
});

export const UpdateLandSchema = z.object({
  name: z.string().min(2, 'Nama lahan minimal 2 karakter').optional(),
  location_province: z.string().min(1, 'Provinsi wajib diisi').optional(),
  location_city: z.string().min(1, 'Kota/Kabupaten wajib diisi').optional(),
  location_district: z.string().min(1, 'Kecamatan wajib diisi').optional(),
  full_address: z.string().min(5, 'Alamat lengkap minimal 5 karakter').optional(),
  area_ha: z.number().positive('Luas lahan harus positif').optional(),
  soil_type: z.string().optional(),
  status: z.enum(['active', 'fallow', 'rented']).optional(),
  current_crop: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateLandInput = z.infer<typeof CreateLandSchema>;
export type UpdateLandInput = z.infer<typeof UpdateLandSchema>;
