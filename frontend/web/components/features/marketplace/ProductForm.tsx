'use client';

import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceService, Product, Category } from '@/services/marketplace';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { X, Upload, Loader2 } from 'lucide-react';

const PRODUCT_UNITS = [
  'kg', 'gram', 'liter', 'ml', 'ikat', 'karung', 'box', 'pcs', 'ton', 'kwintal'
];

const productSchema = z.object({
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
});

type ProductFormValues = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product;
  categories: Category[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FileWithPreview extends File {
  preview: string;
}

export function ProductForm({ product, categories, open, onOpenChange }: ProductFormProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: '',
      description: '',
      category: '',
      price_per_unit: 0,
      unit: '',
      stock: 0,
      min_order: 1,
      location: {
        province: '',
        city: '',
      },
    },
  });

  // Sync state with product when dialog opens
  useEffect(() => {
    if (open) {
      // Use a small delay to avoid "cascading renders" error in Next 16/React 19 lint
      const timer = setTimeout(() => {
        setExistingImages(product?.images || []);
        setFiles([]);
        form.reset({
          title: product?.title || '',
          description: product?.description || '',
          category: product?.category || '',
          price_per_unit: product?.price_per_unit || 0,
          unit: product?.unit || '',
          stock: product?.stock || 0,
          min_order: product?.min_order || 1,
          location: {
            province: product?.location?.province || '',
            city: product?.location?.city || '',
          },
        });
      }, 0);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const remainingSlots = 5 - existingImages.length - files.length;
    if (remainingSlots <= 0) {
      toast.error('Maksimal 5 foto per produk');
      return;
    }

    const newFiles = acceptedFiles.slice(0, remainingSlots).map(file => Object.assign(file, {
      preview: URL.createObjectURL(file)
    }));

    setFiles(prev => [...prev, ...newFiles]);
  }, [existingImages, files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 5242880, // 5MB
  });

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      URL.revokeObjectURL(newFiles[index].preview);
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const createMutation = useMutation({
    mutationFn: (data: ProductFormValues) => marketplaceService.createProduct(data),
    onSuccess: async (response) => {
      const newProduct = response.data;
      const productId = newProduct.id || newProduct._id;
      
      if (files.length > 0) {
        try {
          await Promise.all(files.map(file => marketplaceService.uploadImage(productId, file)));
        } catch {
          toast.error('Beberapa foto gagal diupload');
        }
      }
      
      toast.success('Berhasil', { description: 'Produk berhasil dibuat.' });
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<{ error: { message: string } }>;
      const message = axiosError.response?.data?.error?.message || 'Terjadi kesalahan saat membuat produk';
      toast.error('Gagal', { description: message });
    },
    onSettled: () => setIsSubmitting(false),
  });

  const updateMutation = useMutation({
    mutationFn: (data: ProductFormValues & { images: string[] }) => 
      marketplaceService.updateProduct(product?.id || product?._id || '', data),
    onSuccess: async () => {
      const productId = product?.id || product?._id;
      if (files.length > 0 && productId) {
        try {
          await Promise.all(files.map(file => marketplaceService.uploadImage(productId, file)));
        } catch {
          toast.error('Beberapa foto baru gagal diupload');
        }
      }
      toast.success('Berhasil', { description: 'Produk berhasil diperbarui.' });
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
      onOpenChange(false);
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<{ error: { message: string } }>;
      const message = axiosError.response?.data?.error?.message || 'Terjadi kesalahan saat memperbarui produk';
      toast.error('Gagal', { description: message });
    },
    onSettled: () => setIsSubmitting(false),
  });

  async function onSubmit(values: ProductFormValues) {
    setIsSubmitting(true);
    if (product) {
      updateMutation.mutate({ ...values, images: existingImages });
    } else {
      createMutation.mutate(values);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto text-foreground">
        <DialogHeader>
          <DialogTitle>{product ? 'Edit Produk' : 'Tambah Produk Baru'}</DialogTitle>
          <DialogDescription>
            Isi detail produk Anda di bawah ini. Maksimal 5 foto per produk.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Nama Produk</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Pupuk Organik Cair" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kategori</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Kategori" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id || cat.name}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Satuan</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Satuan" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PRODUCT_UNITS.map((unit) => (
                          <SelectItem key={unit} value={unit}>
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price_per_unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga per Satuan (Rp)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="stock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stok</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="min_order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimal Order</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="1" 
                        {...field} 
                        onChange={(e) => field.onChange(Number(e.target.value))} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 col-span-full">
                <FormLabel>Lokasi</FormLabel>
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="location.city"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Kota/Kabupaten" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location.province"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input placeholder="Provinsi" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Jelaskan detail produk Anda (kualitas, cara penggunaan, dll)..." 
                        className="min-h-[120px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Multiple Image Upload with Preview */}
              <div className="col-span-full space-y-4">
                <FormLabel>Foto Produk (Maks 5)</FormLabel>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {/* Existing Images */}
                  {existingImages.map((img, idx) => (
                    <div key={`existing-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border">
                      <Image src={img} alt="preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  
                  {/* New File Previews */}
                  {files.map((file, idx) => (
                    <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border">
                      <Image src={file.preview} alt="preview" fill className="object-cover" />
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors z-10"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}

                  {/* Dropzone Area */}
                  {(existingImages.length + files.length) < 5 && (
                    <div
                      {...getRootProps()}
                      className={`aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-green-500 hover:bg-gray-50'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <span className="text-[10px] text-center px-2 text-gray-500">
                        Klik atau seret foto ke sini
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500 italic">Format: JPG, PNG, WebP (Maks 5MB per foto).</p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Batal
              </Button>
              <Button type="submit" className="bg-green-600 hover:bg-green-700 min-w-[120px]" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  product ? 'Simpan Perubahan' : 'Tambah Produk'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
