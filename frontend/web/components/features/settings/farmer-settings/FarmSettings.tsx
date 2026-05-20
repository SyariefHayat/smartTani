'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Sprout, MapPin, Scale, Loader2, Info } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { authService } from '@/services/auth';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const farmSettingsSchema = z.object({
  farm_name: z.string().min(3, 'Nama usaha minimal 3 karakter'),
  farm_description: z.string().optional(),
  farm_address: z.string().min(10, 'Alamat lengkap minimal 10 karakter'),
  farm_size_ha: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z.number().min(0, 'Luas lahan tidak boleh negatif').optional()
  ),
  commodities: z.array(z.string()).default([]),
});

type FarmSettingsFormValues = z.infer<typeof farmSettingsSchema>;

export function FarmSettings() {
  const queryClient = useQueryClient();
  const [commodityInput, setCommodityInput] = React.useState('');

  const { data: userResponse, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
  });

  const user = userResponse?.data;

  const form = useForm<FarmSettingsFormValues>({
    resolver: zodResolver(farmSettingsSchema),
    defaultValues: {
      farm_name: '',
      farm_description: '',
      farm_address: '',
      farm_size_ha: 0,
      commodities: [],
    },
  });

  // Sync form with user data once fetched
  React.useEffect(() => {
    if (user) {
      form.reset({
        farm_name: user.farm_name || '',
        farm_description: user.farm_description || '',
        farm_address: user.farm_address || '',
        farm_size_ha: user.farm_size_ha || 0,
        commodities: Array.isArray(user.commodities) ? user.commodities : [],
      });
    }
  }, [user, form]);

  const mutation = useMutation({
    mutationFn: (values: FarmSettingsFormValues) => authService.updateProfile(values),
    onSuccess: () => {
      toast.success('Detail usaha tani berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { message?: string } } };
      const message = axiosError.response?.data?.message || 'Gagal memperbarui detail usaha';
      toast.error(message);
    },
  });

  function onSubmit(values: FarmSettingsFormValues) {
    mutation.mutate(values);
  }

  const addCommodity = () => {
    if (!commodityInput.trim()) return;
    const current = form.getValues('commodities');
    if (!current.includes(commodityInput.trim())) {
      form.setValue('commodities', [...current, commodityInput.trim()], { shouldDirty: true });
    }
    setCommodityInput('');
  };

  const removeCommodity = (item: string) => {
    const current = form.getValues('commodities');
    form.setValue(
      'commodities',
      current.filter((c) => c !== item),
      { shouldDirty: true }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-60 items-center justify-center rounded-lg border border-dashed">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <Card className="border-none shadow-sm rounded-xl overflow-hidden">
      <CardHeader className="border-b bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 text-green-700 rounded-lg">
            <Sprout className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Informasi Usaha Tani</CardTitle>
            <CardDescription>
              Lengkapi detail operasional pertanian Anda untuk akses fitur marketplace & investasi.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Left Column: Basic Info */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="farm_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Usaha / Kelompok Tani</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Tani Makmur Sejahtera" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="farm_description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deskripsi Usaha</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ceritakan tentang fokus pertanian Anda..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Informasi ini akan tampil pada profil publik Anda.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column: Physical Info */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="farm_size_ha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Luas Lahan (Hektar)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Scale className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="0.00"
                            className="pl-9"
                            {...field}
                          />
                          <div className="absolute right-3 top-2.5 text-xs text-muted-foreground font-medium uppercase">
                            Ha
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="farm_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alamat Lengkap</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                          <Textarea
                            placeholder="Alamat kantor atau lokasi utama pertanian..."
                            className="pl-9 min-h-[100px]"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormLabel>Komoditas Utama</FormLabel>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.watch('commodities').map((item) => (
                      <Badge
                        key={item}
                        variant="secondary"
                        className="bg-green-50 text-green-700 border-green-100 px-3 py-1 flex items-center gap-1"
                      >
                        {item}
                        <button
                          type="button"
                          onClick={() => removeCommodity(item)}
                          className="hover:text-green-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                    {form.watch('commodities').length === 0 && (
                      <span className="text-sm text-muted-foreground italic">
                        Belum ada komoditas ditambahkan
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Tambah komoditas (padi, jagung, dll)"
                      value={commodityInput}
                      onChange={(e) => setCommodityInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCommodity();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addCommodity}
                      className="shrink-0"
                    >
                      Tambah
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Info className="h-4 w-4" />
                <span>Semua perubahan akan segera diperbarui di profil Anda.</span>
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => form.reset()}
                  disabled={mutation.isPending}
                >
                  Reset
                </Button>
                <Button
                  type="submit"
                  className="bg-green-700 hover:bg-green-800 text-white min-w-[140px]"
                  disabled={mutation.isPending || !form.formState.isDirty}
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
