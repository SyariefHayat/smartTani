import { z } from 'zod';

export const CreateProductSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  category: z.string().min(1, 'Kategori wajib diisi'),
  price_per_unit: z.number().positive('Harga harus lebih dari 0'),
  unit: z.string().min(1, 'Satuan wajib diisi'),
  stock: z.number().min(0, 'Stok tidak boleh negatif'),
  min_order: z.number().min(1, 'Minimal order adalah 1'),
  location: z.object({
    province: z.string().min(1, 'Provinsi wajib diisi'),
    city: z.string().min(1, 'Kota/Kabupaten wajib diisi'),
  }),
  images: z.array(z.string().url()).optional().default([]),
});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;
