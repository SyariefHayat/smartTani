import * as z from 'zod';

export const productSchema = z.object({
  name: z.string().min(5, 'Nama produk minimal 5 karakter').max(150),
  sku: z.string().min(1, 'SKU wajib diisi'),
  category: z.string().min(1, 'Kategori wajib diisi'),
  brand: z.string().optional(),
  unit: z.string().min(1, 'Satuan wajib diisi'),
  type: z.enum(['physical', 'digital', 'service']),
  shortDescription: z.string().max(200, 'Maksimal 200 karakter'),
  fullDescription: z.string().min(20, 'Deskripsi lengkap minimal 20 karakter'),
  features: z.array(z.string()).min(1, 'Minimal 1 fitur'),
  tags: z.array(z.string()),
  status: z.string(),
  availableDate: z.string(),
  storeName: z.string(),
  sellerType: z.string(),
  warehouseLocation: z.string(),
  // Step 2: Detail & Spesifikasi
  origin: z.string().min(1, 'Asal produk wajib diisi'),
  shelfLife: z.string().min(1, 'Masa simpan wajib diisi'),
  composition: z.string().optional(),
  usageInstructions: z.string().min(10, 'Petunjuk penggunaan minimal 10 karakter'),
  certification: z.string().optional(),
  // Step 3: Harga & Stok
  pricePerUnit: z
    .number({ message: 'Harga wajib diisi' })
    .positive('Harga harus lebih besar dari 0'),
  stock: z.number({ message: 'Stok wajib diisi' }).min(0, 'Stok tidak boleh kurang dari 0'),
  minStock: z
    .number({ message: 'Stok minimum wajib diisi' })
    .min(0, 'Stok minimum tidak boleh kurang dari 0'),
  minOrder: z
    .number({ message: 'Minimum pemesanan wajib diisi' })
    .min(1, 'Minimum pemesanan minimal 1'),
  // Step 4: Media Produk
  images: z.array(z.string()).min(1, 'Minimal unggah 1 foto produk'),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const STEPS = [
  { id: 1, title: 'Informasi Produk' },
  { id: 2, title: 'Detail & Spesifikasi' },
  { id: 3, title: 'Harga & Stok' },
  { id: 4, title: 'Media Produk' },
  { id: 5, title: 'Ringkasan & Terbitkan' },
];
