'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Camera, AlertTriangle } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/auth';

const profileSchema = z.object({
  full_name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 karakter'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function ProfileSettings() {
  const { user, setAuth, accessToken, refreshToken } = useAuthStore();

  const {
    data: profileResponse,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
    retry: 1,
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      phone: '',
    },
  });

  useEffect(() => {
    if (isError) {
      toast.error('Layanan profil offline. Menggunakan data cadangan lokal.', {
        description:
          'Gagal memuat profil teraktual dari server. Mengaktifkan mode cadangan offline.',
        duration: 4000,
      });
    }
  }, [isError]);

  useEffect(() => {
    if (profileResponse?.data) {
      form.reset({
        full_name: profileResponse.data.full_name || '',
        phone: profileResponse.data.phone || '',
      });
    } else if (user) {
      form.reset({
        full_name: user.full_name || '',
        phone: '',
      });
    }
  }, [profileResponse, user, form]);

  const updateProfileMutation = useMutation({
    mutationFn: (values: ProfileFormValues) => authService.updateProfile(values),
    onSuccess: (response) => {
      toast.success('Profil berhasil diperbarui');
      if (response.success && response.data && accessToken && refreshToken) {
        // Sync Zustand store
        setAuth(response.data, accessToken, refreshToken);
      }
    },
    onError: (error: Error) => {
      toast.error('Gagal memperbarui profil: ' + (error.message || 'Terjadi kesalahan'));
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values);
  };

  const handleRetry = () => {
    refetch();
  };

  if (isLoading && !isError) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="flex h-64 items-center justify-center bg-white rounded-xl">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  const profileData = profileResponse?.data || user;

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

      <Card className="border border-slate-200 shadow-xs text-slate-900 bg-white rounded-xl">
        <CardHeader>
          <CardTitle>Profil Petani</CardTitle>
          <CardDescription>Perbarui informasi pribadi dan foto profil Anda.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24 border border-slate-100">
                <AvatarImage
                  src={profileData?.avatar_url || '/images/dashboard/dashboard-logo.png'}
                />
                <AvatarFallback>
                  {profileData?.full_name?.substring(0, 2).toUpperCase() || 'ST'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                variant="outline"
                className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white border border-slate-200 shadow-3xs cursor-pointer hover:bg-slate-50"
              >
                <Camera className="h-4 w-4 text-slate-500" />
              </Button>
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">Foto Profil</h4>
              <p className="text-xs text-slate-400">JPG, GIF atau PNG. Maksimal 2MB.</p>
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer text-xs font-semibold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 h-8 shadow-3xs"
                  disabled
                >
                  Ganti Foto
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="cursor-pointer text-xs font-semibold text-destructive hover:bg-red-50 h-8"
                  disabled
                >
                  Hapus
                </Button>
              </div>
            </div>
          </div>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="full_name">Nama Lengkap</Label>
                <Input
                  id="full_name"
                  {...form.register('full_name')}
                  placeholder="Masukkan nama lengkap"
                  className="bg-white border-slate-200"
                />
                {form.formState.errors.full_name && (
                  <p className="text-xs text-red-500">{form.formState.errors.full_name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Alamat Email</Label>
                <Input
                  id="email"
                  value={profileData?.email || ''}
                  disabled
                  className="bg-slate-50/80 border-slate-200 text-slate-500 cursor-not-allowed"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  {...form.register('phone')}
                  placeholder="Contoh: 081234567890"
                  className="bg-white border-slate-200"
                />
                {form.formState.errors.phone && (
                  <p className="text-xs text-red-500">{form.formState.errors.phone.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Peran</Label>
                <Input
                  id="role"
                  value={profileData?.role === 'petani' ? 'Petani' : profileData?.role || ''}
                  disabled
                  className="bg-slate-50/80 border-slate-200 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
                disabled={updateProfileMutation.isPending}
                className="cursor-pointer text-xs font-semibold text-slate-700 bg-white border-slate-200 hover:bg-slate-50 h-9"
              >
                Reset
              </Button>
              <Button
                type="submit"
                className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs h-9 min-w-[140px] shadow-2xs"
                disabled={updateProfileMutation.isPending}
              >
                {updateProfileMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
