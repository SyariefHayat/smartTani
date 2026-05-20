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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { landService } from '@/services/land';
import { toast } from 'sonner';
import { FarmerLand } from './types';

const landSchema = z.object({
  name: z.string().min(2, 'Nama lahan minimal 2 karakter'),
  location_province: z.string().min(1, 'Provinsi wajib diisi'),
  location_city: z.string().min(1, 'Kota/Kabupaten wajib diisi'),
  location_district: z.string().min(1, 'Kecamatan wajib diisi'),
  full_address: z.string().min(5, 'Alamat lengkap minimal 5 karakter'),
  area_ha: z.coerce.number().positive('Luas lahan harus positif'),
  soil_type: z.string().optional(),
  status: z.enum(['active', 'fallow', 'rented']),
  current_crop: z.string().optional(),
  notes: z.string().optional(),
});

type LandFormValues = z.infer<typeof landSchema>;

interface LandFormProps {
  initialData?: FarmerLand;
  onSuccess: () => void;
}

export function LandForm({ initialData, onSuccess }: LandFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<LandFormValues>({
    resolver: zodResolver(landSchema),
    defaultValues: {
      name: initialData?.name || '',
      location_province: initialData?.location_province || '',
      location_city: initialData?.location_city || '',
      location_district: initialData?.location_district || '',
      full_address: initialData?.full_address || '',
      area_ha: initialData?.area_ha || 0,
      soil_type: initialData?.soil_type || '',
      status: initialData?.status || 'active',
      current_crop: initialData?.current_crop || '',
      notes: initialData?.notes || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: LandFormValues) => {
      if (initialData) {
        return landService.updateLand(initialData.id, data);
      }
      return landService.createLand(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-lands'] });
      toast.success(initialData ? 'Lahan diperbarui' : 'Lahan berhasil ditambah');
      onSuccess();
    },
    onError: () => {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    },
  });

  function onSubmit(data: LandFormValues) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Lahan</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Sawah Utama Blok A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="area_ha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Luas (Ha)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
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
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="fallow">Bera/Kosong</SelectItem>
                    <SelectItem value="rented">Disewakan</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="location_province"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provinsi</FormLabel>
                <FormControl>
                  <Input placeholder="Jawa Barat" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location_city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kota/Kab</FormLabel>
                <FormControl>
                  <Input placeholder="Cianjur" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location_district"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kecamatan</FormLabel>
                <FormControl>
                  <Input placeholder="Cugenang" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="full_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alamat Lengkap</FormLabel>
              <FormControl>
                <Input placeholder="Jl. Raya Cugenang No. 123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="soil_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipe Tanah (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Lempung, Berpasir, dll" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="current_crop"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Komoditas (Opsional)</FormLabel>
                <FormControl>
                  <Input placeholder="Padi, Jagung, dll" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan (Opsional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Keterangan tambahan..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onSuccess}>
            Batal
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? 'Menyimpan...'
              : initialData
                ? 'Simpan Perubahan'
                : 'Tambah Lahan'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
