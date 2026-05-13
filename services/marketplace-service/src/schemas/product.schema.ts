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

export const GetProductsSchema = z.object({
  category: z.string().optional(),
  location_province: z.string().optional(),
  location_city: z.string().optional(),
  min_price: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v) : undefined)),
  max_price: z
    .string()
    .optional()
    .transform((v) => (v ? parseFloat(v) : undefined)),
  search: z.string().optional(),
  page: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 1)),
  limit: z
    .string()
    .optional()
    .transform((v) => (v ? parseInt(v, 10) : 20)),
});

export type GetProductsInput = z.infer<typeof GetProductsSchema>;

export const UpdateProductSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter').optional(),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter').optional(),
  category: z.string().min(1, 'Kategori wajib diisi').optional(),
  price_per_unit: z.number().positive('Harga harus lebih dari 0').optional(),
  unit: z.string().min(1, 'Satuan wajib diisi').optional(),
  stock: z.number().min(0, 'Stok tidak boleh negatif').optional(),
  min_order: z.number().min(1, 'Minimal order adalah 1').optional(),
  location: z
    .object({
      province: z.string().min(1, 'Provinsi wajib diisi').optional(),
      city: z.string().min(1, 'Kota/Kabupaten wajib diisi').optional(),
    })
    .optional(),
  images: z.array(z.string().url()).optional(),
  status: z.enum(['active', 'inactive', 'pending']).optional(),
});

export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
