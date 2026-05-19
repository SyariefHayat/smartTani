'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Loader2, Camera } from 'lucide-react';

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

  const { data: profileResponse, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: () => authService.getProfile(),
  });

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      phone: '',
    },
  });

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

  if (isLoading) {
    return (
      <Card className="border-none shadow-sm">
        <CardContent className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </CardContent>
      </Card>
    );
  }

  const profileData = profileResponse?.data || user;

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle>Profil Petani</CardTitle>
        <CardDescription>Perbarui informasi pribadi dan foto profil Anda.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
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
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold">Foto Profil</h4>
            <p className="text-xs text-muted-foreground">JPG, GIF atau PNG. Maksimal 2MB.</p>
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" disabled>
                Ganti Foto
              </Button>
              <Button size="sm" variant="ghost" className="text-destructive" disabled>
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
              />
              {form.formState.errors.full_name && (
                <p className="text-xs text-red-500">{form.formState.errors.full_name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Alamat Email</Label>
              <Input id="email" value={profileData?.email || ''} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input id="phone" {...form.register('phone')} placeholder="Contoh: 081234567890" />
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
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={updateProfileMutation.isPending}
            >
              Reset
            </Button>
            <Button
              type="submit"
              className="bg-slate-900 text-white hover:bg-slate-800"
              disabled={updateProfileMutation.isPending}
            >
              {updateProfileMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
