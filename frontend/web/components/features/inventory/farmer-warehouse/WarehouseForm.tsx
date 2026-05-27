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
import { Warehouse, WarehouseType, WarehouseStatus } from './types';

const warehouseSchema = z.object({
  name: z.string().min(3, 'Nama gudang minimal 3 karakter'),
  location: z.string().min(5, 'Lokasi / Alamat minimal 5 karakter'),
  type: z.enum(['Cold Storage', 'Dry Storage', 'Silo', 'Open Yard'] as const),
  capacity: z.coerce.number().min(0, 'Kapasitas minimal 0%').max(100, 'Kapasitas maksimal 100%'),
  status: z.enum(['active', 'full', 'maintenance', 'inactive'] as const),
});

type WarehouseFormValues = z.infer<typeof warehouseSchema>;

interface WarehouseFormProps {
  initialData?: Warehouse | null;
  onSuccess: (data: WarehouseFormValues) => void;
}

export function WarehouseForm({ initialData, onSuccess }: WarehouseFormProps) {
  const form = useForm<WarehouseFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(warehouseSchema) as any,
    defaultValues: {
      name: initialData?.name || '',
      location: initialData?.location || '',
      type: initialData?.type || 'Dry Storage',
      capacity: initialData?.capacity || 0,
      status: initialData?.status || 'active',
    },
  });

  function onSubmit(data: WarehouseFormValues) {
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
              <FormLabel>Nama Gudang</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Silo Jagung Utara" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Storage</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Tipe" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Dry Storage">Dry Storage (Kering)</SelectItem>
                    <SelectItem value="Cold Storage">Cold Storage (Pendingin)</SelectItem>
                    <SelectItem value="Silo">Silo</SelectItem>
                    <SelectItem value="Open Yard">Open Yard</SelectItem>
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
                    <SelectItem value="full">Penuh</SelectItem>
                    <SelectItem value="maintenance">Perbaikan</SelectItem>
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
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterisian Kapasitas (%)</FormLabel>
              <FormControl>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Keterisian awal (0-100)"
                    {...field}
                  />
                  <span className="text-sm font-semibold text-slate-500">%</span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lokasi Gudang</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Sidoarjo, Jawa Timur" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="submit"
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-semibold cursor-pointer"
          >
            {initialData ? 'Simpan Perubahan' : 'Tambah Gudang'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
