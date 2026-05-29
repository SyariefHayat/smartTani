'use client';

import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Sprout, MapPin, Scale, Loader2, Info, AlertTriangle, X } from 'lucide-react';
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
import { useAuthStore } from '@/stores/auth';

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
  const { user, accessToken, refreshToken, setAuth } = useAuthStore();
  const [commodityInput, setCommodityInput] = React.useState('');

  const {
    data: userResponse,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    retry: 1,
  });

  const activeUser = userResponse?.data || user;

  const form = useForm<FarmSettingsFormValues>({
    resolver: zodResolver(farmSettingsSchema) as unknown as Resolver<FarmSettingsFormValues>,
    defaultValues: {
      farm_name: '',
      farm_description: '',
      farm_address: '',
      farm_size_ha: 0,
      commodities: [],
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const commodities = form.watch('commodities') || [];

  React.useEffect(() => {
    if (isError) {
      toast.error('Layanan profil offline. Menggunakan data cadangan lokal.', {
        description:
          'Gagal memuat profil teraktual dari server. Mengaktifkan mode cadangan offline.',
        duration: 4000,
      });
    }
  }, [isError]);

  // Sync form with user data once fetched
  React.useEffect(() => {
    if (activeUser) {
      form.reset({
        farm_name: activeUser.farm_name || '',
        farm_description: activeUser.farm_description || '',
        farm_address: activeUser.farm_address || '',
        farm_size_ha: activeUser.farm_size_ha || 0,
        commodities: Array.isArray(activeUser.commodities) ? activeUser.commodities : [],
      });
    }
  }, [activeUser, form]);

  const mutation = useMutation({
    mutationFn: (values: FarmSettingsFormValues) => authService.updateProfile(values),
    onSuccess: (response) => {
      toast.success('Detail usaha tani berhasil diperbarui');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      if (response.success && response.data && accessToken && refreshToken) {
        // Sync Zustand store
        setAuth(response.data, accessToken, refreshToken);
      }
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
      current.filter((c: string) => c !== item),
      { shouldDirty: true }
    );
  };

  const handleRetry = () => {
    refetch();
  };

  if (isLoading && !isError) {
    return (
      <div className="flex h-60 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 font-semibold shadow-xs animate-fade-in">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 animate-pulse" />
            <p>
              Layanan Profil Offline: Gagal memuat profil teraktual. Menggunakan data demo lokal.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold shrink-0 text-[10px] cursor-pointer"
            onClick={handleRetry}
            disabled={isRefetching}
          >
            {isRefetching ? 'Menghubungkan...' : 'Coba Hubungkan Kembali'}
          </Button>
        </div>
      )}

      <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white text-slate-900">
        <CardHeader className="border-b bg-slate-50/50 border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 text-green-700 rounded-lg">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>Informasi Usaha Tani</CardTitle>
              <CardDescription>
                Lengkapi detail operasional pertanian Anda untuk akses fitur marketplace &
                investasi.
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
                          <Input
                            placeholder="Contoh: Tani Makmur Sejahtera"
                            className="bg-white border-slate-200"
                            {...field}
                          />
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
                            className="min-h-[120px] resize-none bg-white border-slate-200 leading-relaxed"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-slate-400">
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
                              className="pl-9 bg-white border-slate-200"
                              {...field}
                            />
                            <div className="absolute right-3 top-2.5 text-xs text-slate-400 font-semibold uppercase">
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
                              className="pl-9 min-h-[100px] bg-white border-slate-200 leading-relaxed"
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
                    <div className="flex flex-wrap gap-2 mb-3 min-h-[30px] items-center">
                      {commodities.map((item: string) => (
                        <Badge
                          key={item}
                          variant="secondary"
                          className="bg-green-50 text-green-700 border border-green-150 px-3 py-1 flex items-center gap-1.5 text-xs font-semibold rounded-full"
                        >
                          {item}
                          <button
                            type="button"
                            onClick={() => removeCommodity(item)}
                            className="hover:text-green-900 cursor-pointer"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                      {commodities.length === 0 && (
                        <span className="text-xs text-slate-400 italic">
                          Belum ada komoditas ditambahkan
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Tambah komoditas (padi, jagung, dll)"
                        value={commodityInput}
                        onChange={(e) => setCommodityInput(e.target.value)}
                        className="bg-white border-slate-200"
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
                        className="cursor-pointer text-xs font-semibold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 h-9 shrink-0 shadow-3xs"
                      >
                        Tambah
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                  <Info className="h-4 w-4 text-slate-400" />
                  <span>Semua perubahan akan segera diperbarui di profil Anda.</span>
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => form.reset()}
                    disabled={mutation.isPending}
                    className="cursor-pointer text-xs font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 h-9 px-4"
                  >
                    Reset
                  </Button>
                  <Button
                    type="submit"
                    className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold text-xs h-9 min-w-[140px] shadow-2xs disabled:opacity-50"
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
    </div>
  );
}
