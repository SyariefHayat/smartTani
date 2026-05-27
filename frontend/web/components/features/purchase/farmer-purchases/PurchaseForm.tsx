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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { purchaseService } from '@/services/purchase';
import { toast } from 'sonner';
import { PurchaseRecord } from './types';

const purchaseSchema = z.object({
  supplier_name: z.string().min(2, 'Nama pemasok minimal 2 karakter'),
  item_name: z.string().min(2, 'Nama barang minimal 2 karakter'),
  quantity: z.coerce.number().positive('Kuantitas harus positif'),
  unit: z.string().min(1, 'Satuan wajib diisi'),
  total_cost: z.coerce.number().positive('Total biaya harus positif'),
  purchase_date: z.string().min(1, 'Tanggal wajib diisi'),
  notes: z.string().optional(),
  receipt_url: z.string().url('URL bukti tidak valid').optional().or(z.literal('')),
});

type PurchaseFormValues = z.infer<typeof purchaseSchema>;

interface PurchaseFormProps {
  initialData?: PurchaseRecord;
  onSuccess: () => void;
}

export function PurchaseForm({ initialData, onSuccess }: PurchaseFormProps) {
  const queryClient = useQueryClient();
  const form = useForm<PurchaseFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(purchaseSchema) as any,
    defaultValues: {
      supplier_name: initialData?.supplier_name || '',
      item_name: initialData?.item_name || '',
      quantity: initialData?.quantity || 0,
      unit: initialData?.unit || '',
      total_cost: initialData?.total_cost || 0,
      purchase_date: initialData?.purchase_date
        ? initialData.purchase_date.split('T')[0]
        : new Date().toISOString().split('T')[0],
      notes: initialData?.notes || '',
      receipt_url: initialData?.receipt_url || '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: PurchaseFormValues) => {
      if (initialData) {
        return purchaseService.updatePurchase(initialData.id, data);
      }
      return purchaseService.createPurchase(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-purchases'] });
      toast.success(initialData ? 'Catatan diperbarui' : 'Catatan berhasil ditambah');
      onSuccess();
    },
    onError: () => {
      toast.error('Terjadi kesalahan. Silakan coba lagi.');
    },
  });

  function onSubmit(data: PurchaseFormValues) {
    mutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="purchase_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tanggal</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="supplier_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Pemasok</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Toko Tani Jaya" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="item_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Barang</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Pupuk NPK 50kg" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Jumlah</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
                  <Input placeholder="Contoh: Karung, Liter, dll" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="total_cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Biaya (Rp)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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
              <FormLabel>Catatan (Opsional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Tambahkan keterangan tambahan..." {...field} />
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
                : 'Tambah Catatan'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
