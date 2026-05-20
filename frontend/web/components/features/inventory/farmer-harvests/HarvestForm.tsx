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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { harvestService } from '@/services/harvest';
import { landService } from '@/services/land';
import { toast } from 'sonner';
import { FarmerHarvest } from './types';

const harvestSchema = z.object({
  land_id: z.string().uuid('Pilih lahan yang valid'),
  crop_name: z.string().min(2, 'Nama tanaman minimal 2 karakter'),
  quantity: z.coerce.number().positive('Hasil panen harus positif'),
  unit: z.string().min(1, 'Satuan wajib diisi'),
  harvest_date: z.string().min(1, 'Tanggal panen wajib diisi'),
  quality_grade: z.enum(['A', 'B', 'C']),
  notes: z.string().optional(),
});

type HarvestFormValues = z.infer<typeof harvestSchema>;

interface HarvestFormProps {
  initialData?: FarmerHarvest;
  onSuccess: () => void;
}

export function HarvestForm({ initialData, onSuccess }: HarvestFormProps) {
  const queryClient = useQueryClient();

  const { data: lands = [] } = useQuery({
    queryKey: ['farmer-lands-select'],
    queryFn: () => landService.getLands(),
  });

  const formattedDate = initialData?.harvest_date
    ? new Date(initialData.harvest_date).toISOString().split('T')[0]
    : '';

  const form = useForm<HarvestFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(harvestSchema) as any,
    defaultValues: {
      land_id: initialData?.land_id || '',
      crop_name: initialData?.crop_name || '',
      quantity: initialData?.quantity || 0,
      unit: initialData?.unit || 'kg',
      harvest_date: formattedDate,
      quality_grade: initialData?.quality_grade || 'A',
      notes: initialData?.notes || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: HarvestFormValues) => {
      if (initialData) {
        return harvestService.updateHarvest(initialData.id, data);
      }
      return harvestService.createHarvest(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-harvests'] });
      toast.success(initialData ? 'Catatan panen diperbarui' : 'Catatan panen berhasil dibuat');
      onSuccess();
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errMsg = axiosError?.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';
      toast.error(errMsg);
    },
  });

  function onSubmit(data: HarvestFormValues) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 text-slate-900">
        <FormField
          control={form.control}
          name="land_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pilih Lahan Tani</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih lokasi lahan" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {lands.map((land) => (
                    <SelectItem key={land.id} value={land.id}>
                      {land.name} ({land.location_city})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="crop_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Komoditas / Tanaman</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Padi Ciherang" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quality_grade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Kualitas Panen</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih Grade" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="A">Grade A (Sangat Baik)</SelectItem>
                    <SelectItem value="B">Grade B (Baik)</SelectItem>
                    <SelectItem value="C">Grade C (Cukup)</SelectItem>
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
            name="quantity"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Jumlah Hasil Panen</FormLabel>
                <FormControl>
                  <Input type="number" step="any" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input placeholder="kg, ton, ikat" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="harvest_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tanggal Panen</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan Tambahan (Opsional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Keterangan kondisi panen, cuaca, dll..." {...field} />
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
                : 'Catat Hasil Panen'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
