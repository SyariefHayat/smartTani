import { z } from 'zod';

export const CreateAddressSchema = z.object({
  label: z.string().min(2, 'Label minimal 2 karakter'),
  recipient_name: z.string().min(2, 'Nama penerima minimal 2 karakter'),
  phone_number: z.string().min(5, 'Nomor telepon minimal 5 karakter'),
  province: z.string().min(1, 'Provinsi wajib diisi'),
  city: z.string().min(1, 'Kota/Kabupaten wajib diisi'),
  district: z.string().min(1, 'Kecamatan wajib diisi'),
  full_address: z.string().min(5, 'Alamat lengkap minimal 5 karakter'),
  postal_code: z.string().min(3, 'Kode pos minimal 3 karakter'),
});

export const UpdateAddressSchema = z.object({
  label: z.string().min(2, 'Label minimal 2 karakter').optional(),
  recipient_name: z.string().min(2, 'Nama penerima minimal 2 karakter').optional(),
  phone_number: z.string().min(5, 'Nomor telepon minimal 5 karakter').optional(),
  province: z.string().min(1, 'Provinsi wajib diisi').optional(),
  city: z.string().min(1, 'Kota/Kabupaten wajib diisi').optional(),
  district: z.string().min(1, 'Kecamatan wajib diisi').optional(),
  full_address: z.string().min(5, 'Alamat lengkap minimal 5 karakter').optional(),
  postal_code: z.string().min(3, 'Kode pos minimal 3 karakter').optional(),
});

export type CreateAddressInput = z.infer<typeof CreateAddressSchema>;
export type UpdateAddressInput = z.infer<typeof UpdateAddressSchema>;
