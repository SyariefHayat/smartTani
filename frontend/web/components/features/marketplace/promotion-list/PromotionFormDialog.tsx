'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

import { promotionService, CreatePromotionInput } from '@/services/promotion';
import { marketplaceService } from '@/services/marketplace';
import { Promotion } from './types';

const promotionSchema = z.object({
  title: z.string().min(5, 'Judul minimal 5 karakter'),
  code: z.string().min(3, 'Kode kupon minimal 3 karakter').toUpperCase(),
  type: z.enum(['discount_percent', 'discount_amount']),
  value: z.number().positive('Nilai promo harus lebih dari 0'),
  start_date: z.string().min(1, 'Tanggal mulai wajib diisi'),
  end_date: z.string().min(1, 'Tanggal berakhir wajib diisi'),
  limit: z.number().min(1, 'Batas penggunaan minimal 1'),
  product_ids: z.array(z.string()).min(1, 'Pilih minimal 1 produk'),
});

type PromotionFormValues = z.infer<typeof promotionSchema>;

interface PromotionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promo?: Promotion | null;
  farmerId?: string;
}

interface CustomCreatePromotionInput extends CreatePromotionInput {
  code: string;
  limit: number;
  farmer_id?: string;
}

export function PromotionFormDialog({
  open,
  onOpenChange,
  promo,
  farmerId,
}: PromotionFormDialogProps) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch farmer's products to choose from
  const { data: productsResponse, isLoading: isLoadingProducts } = useQuery({
    queryKey: ['farmer-products-all', farmerId],
    queryFn: () => marketplaceService.getProducts({ farmer_id: farmerId, limit: 1000 }),
    enabled: open && !!farmerId,
  });

  const products = productsResponse?.data?.products || [];

  const form = useForm<PromotionFormValues>({
    resolver: zodResolver(promotionSchema),
    defaultValues: {
      title: '',
      code: '',
      type: 'discount_percent',
      value: 0,
      start_date: '',
      end_date: '',
      limit: 100,
      product_ids: [],
    },
  });

  // Sync state with promo when dialog opens
  useEffect(() => {
    if (open) {
      if (promo) {
        form.reset({
          title: promo.title,
          code: promo.code || 'PROMO' + Math.floor(100 + Math.random() * 900),
          type: promo.type,
          value: promo.value,
          start_date: promo.start_date ? promo.start_date.split('T')[0] : '',
          end_date: promo.end_date ? promo.end_date.split('T')[0] : '',
          limit: promo.limit || 100,
          product_ids: promo.product_ids || [],
        });
      } else {
        form.reset({
          title: '',
          code: '',
          type: 'discount_percent',
          value: 0,
          start_date: new Date().toISOString().split('T')[0],
          end_date: '',
          limit: 100,
          product_ids: [],
        });
      }
    }
  }, [open, promo, form]);

  const createMutation = useMutation({
    mutationFn: (data: CustomCreatePromotionInput) => promotionService.createPromotion(data),
    onSuccess: () => {
      toast.success('Berhasil', { description: 'Promo baru berhasil dibuat.' });
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      onOpenChange(false);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error('Gagal', {
        description: error?.response?.data?.message || 'Terjadi kesalahan saat membuat promo',
      });
    },
    onSettled: () => setIsSubmitting(false),
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CustomCreatePromotionInput>) =>
      promotionService.updatePromotion(promo?._id || '', data),
    onSuccess: () => {
      toast.success('Berhasil', { description: 'Promo berhasil diperbarui.' });
      queryClient.invalidateQueries({ queryKey: ['promotions'] });
      onOpenChange(false);
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error('Gagal', {
        description: error?.response?.data?.message || 'Terjadi kesalahan saat memperbarui promo',
      });
    },
    onSettled: () => setIsSubmitting(false),
  });

  const onSubmit = (values: PromotionFormValues) => {
    setIsSubmitting(true);
    const payload: CustomCreatePromotionInput = {
      title: values.title,
      type: values.type,
      value: values.value,
      product_ids: values.product_ids,
      start_date: new Date(values.start_date).toISOString(),
      end_date: new Date(values.end_date).toISOString(),
      status: promo ? promo.status : 'active',
      code: values.code,
      limit: values.limit,
    };

    if (promo) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate({ ...payload, farmer_id: farmerId });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-[560px] text-slate-900 bg-white p-0 flex flex-col h-full shadow-2xl border-l border-slate-100 overflow-hidden">
        {/* Header - Fixed at the top */}
        <SheetHeader className="p-6 pb-4 border-b">
          <SheetTitle className="text-lg font-bold">
            {promo ? 'Ubah Promo' : 'Buat Promo Baru'}
          </SheetTitle>
          <SheetDescription className="text-xs text-slate-500">
            Isi detail promo di bawah ini untuk menarik minat pembeli di marketplace SmartTani.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable Form Body inside Sheet (strictly vertical scroll only) */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col flex-1 h-full overflow-hidden"
          >
            <div className="flex-1 overflow-y-auto overflow-x-hidden">
              <div className="p-6 space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700 font-semibold text-xs">
                        Nama Promo / Kampanye
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Diskon Panen Raya Pupuk" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold text-xs">
                          Kode Kupon
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Contoh: PANENRAYA10" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="limit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold text-xs">
                          Batas Penggunaan
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="100"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold text-xs">
                          Tipe Diskon
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white">
                              <SelectValue placeholder="Pilih tipe" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white text-slate-900">
                            <SelectItem value="discount_percent">Persentase (%)</SelectItem>
                            <SelectItem value="discount_amount">Nominal Tunai (Rp)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold text-xs">
                          Nilai Diskon
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="start_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold text-xs">
                          Tanggal Mulai
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="end_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-700 font-semibold text-xs">
                          Tanggal Berakhir
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Products Selection - No internal scrollbar/slider as requested */}
                <div className="space-y-2">
                  <FormLabel className="text-slate-700 font-semibold text-xs">
                    Pilih Produk yang Berlaku
                  </FormLabel>
                  <div className="rounded-md border p-3 bg-slate-50">
                    {isLoadingProducts ? (
                      <div className="flex h-24 items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin text-green-600" />
                        <span className="ml-2 text-xs text-slate-500">Memuat produk...</span>
                      </div>
                    ) : products.length === 0 ? (
                      <p className="text-center py-6 text-xs text-slate-500">
                        Anda belum memiliki produk aktif untuk diberi diskon.
                      </p>
                    ) : (
                      <FormField
                        control={form.control}
                        name="product_ids"
                        render={() => (
                          <div className="space-y-2">
                            {products.map((prod) => (
                              <FormField
                                key={prod._id}
                                control={form.control}
                                name="product_ids"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={prod._id}
                                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border border-slate-200 bg-white p-2"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(prod._id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, prod._id])
                                              : field.onChange(
                                                  field.value?.filter((value) => value !== prod._id)
                                                );
                                          }}
                                        />
                                      </FormControl>
                                      <div className="space-y-0.5 leading-none">
                                        <FormLabel className="text-xs font-bold text-slate-800 cursor-pointer">
                                          {prod.title}
                                        </FormLabel>
                                        <FormDescription className="text-[10px]">
                                          Stok: {prod.stock} {prod.unit} • Rp{' '}
                                          {prod.price_per_unit.toLocaleString('id-ID')}
                                        </FormDescription>
                                      </div>
                                    </FormItem>
                                  );
                                }}
                              />
                            ))}
                          </div>
                        )}
                      />
                    )}
                  </div>
                  <FormMessage />
                </div>
              </div>
            </div>

            {/* Sticky Action buttons at the end - Fixed at the very bottom with zero empty whitespace under */}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 p-4 bg-slate-50 border-t mt-auto">
              <Button
                type="button"
                variant="outline"
                className="cursor-pointer"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : promo ? (
                  'Ubah Promo'
                ) : (
                  'Buat Promo'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
