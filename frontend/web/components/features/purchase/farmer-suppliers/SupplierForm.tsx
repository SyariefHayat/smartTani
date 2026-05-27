'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Category } from '@/services/marketplace';
import { Supplier } from './types';
import { toast } from 'sonner';

const supplierSchema = z.object({
  name: z.string().min(3, 'Nama supplier minimal 3 karakter'),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  contactPerson: z.string().min(3, 'Nama kontak minimal 3 karakter'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 digit'),
  email: z.string().email('Email tidak valid').or(z.literal('')),
  location: z.string().min(5, 'Lokasi minimal 5 karakter'),
  status: z.enum(['active', 'inactive']),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

interface SupplierFormProps {
  initialData?: Supplier | null;
  categories: Category[];
  onSuccess: (data: SupplierFormValues) => void;
}

export function SupplierForm({ initialData, categories, onSuccess }: SupplierFormProps) {
  const form = useForm<SupplierFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(supplierSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      category: initialData?.category || '',
      contactPerson: initialData?.contactPerson || '',
      phone: initialData?.phone || '',
      email: initialData?.email || '',
      location: initialData?.location || '',
      status: initialData?.status || 'active',
    },
  });

  function onSubmit(data: SupplierFormValues) {
    onSuccess(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Supplier</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Distributor Pupuk Nasional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kategori</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.name}>
                        {c.name}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Nonaktif</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="contactPerson"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Kontak Person</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Budi Santoso" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Telepon</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: 081234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email (Opsional)</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Contoh: supplier@tani.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi / Alamat</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Surabaya, Jawa Timur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="submit" className="w-full sm:w-auto">
            {initialData ? 'Simpan Perubahan' : 'Tambah Supplier'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
