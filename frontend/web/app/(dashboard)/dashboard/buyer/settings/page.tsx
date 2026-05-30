'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import {
  User as UserIcon,
  LockKeyhole,
  Bell,
  Mail,
  Phone,
  Camera,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Zod Schemas
const profileSchema = z.object({
  full_name: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  phone: z.string().min(10, 'Nomor telepon minimal 10 karakter'),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const securitySchema = z
  .object({
    currentPassword: z.string().min(6, 'Kata sandi saat ini minimal 6 karakter'),
    newPassword: z.string().min(6, 'Kata sandi baru minimal 6 karakter'),
    confirmPassword: z.string().min(6, 'Konfirmasi kata sandi baru minimal 6 karakter'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Konfirmasi kata sandi baru tidak cocok',
    path: ['confirmPassword'],
  });

type SecurityFormValues = z.infer<typeof securitySchema>;

export default function BuyerSettingsPage() {
  const router = useRouter();
  const {
    user: localUser,
    accessToken,
    refreshToken,
    setAuth,
    notificationPreferences,
    updateNotificationPreferences,
  } = useAuthStore();

  // Query profile
  const {
    data: profileResponse,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['buyer-profile'],
    queryFn: () => authService.getProfile(),
    retry: 1,
  });

  const profileData = profileResponse?.data || localUser;

  // React Hook Form for Profile
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: '',
      phone: '',
    },
  });

  // React Hook Form for Security
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Sync profile data to form when loaded
  React.useEffect(() => {
    if (profileData) {
      profileForm.reset({
        full_name: profileData.full_name || '',
        phone: profileData.phone || '',
      });
    }
  }, [profileData, profileForm]);

  // Auth Redirect guard
  React.useEffect(() => {
    if (!localUser) {
      router.push('/login?redirect=/dashboard/buyer/settings');
    }
  }, [localUser, router]);

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: (values: ProfileFormValues) =>
      authService.updateProfile({
        full_name: values.full_name,
        phone: values.phone,
      }),
    onSuccess: (response) => {
      toast.success('Profil berhasil diperbarui!');
      if (response?.data && accessToken && refreshToken) {
        setAuth(response.data, accessToken, refreshToken);
      }
    },
    onError: (error: any) => {
      toast.error(
        'Gagal memperbarui profil: ' + (error?.response?.data?.message || error.message)
      );
    },
  });

  // Change Password Mutation
  const changePasswordMutation = useMutation({
    mutationFn: (values: SecurityFormValues) =>
      authService.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: () => {
      toast.success('Kata sandi berhasil diperbarui!');
      securityForm.reset();
    },
    onError: (error: any) => {
      toast.error(
        'Gagal memperbarui kata sandi: ' + (error?.response?.data?.message || error.message)
      );
    },
  });

  // Notifications State
  const [preferences, setPreferences] = React.useState(notificationPreferences);

  React.useEffect(() => {
    setPreferences(notificationPreferences);
  }, [notificationPreferences]);

  const handleTogglePreference = (key: keyof typeof preferences, checked: boolean) => {
    setPreferences((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationPreferences(preferences);
    toast.success('Preferensi notifikasi berhasil disimpan!');
  };

  const handleRetry = () => {
    refetch();
  };

  if (!localUser) return null;

  if (isLoading && !isError) {
    return (
      <div className="w-full space-y-6 text-foreground">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 bg-slate-200 animate-pulse rounded" />
          <div className="h-4 w-96 bg-slate-200 animate-pulse rounded" />
        </div>
        <div className="h-64 bg-slate-100 animate-pulse rounded-xl w-full max-w-xl" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-foreground">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-foreground">
          Pengaturan Akun
        </h1>
        <p className="text-sm text-muted-foreground">
          Kelola profil, keamanan kata sandi, dan preferensi notifikasi Anda.
        </p>
      </div>

      {isError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 font-semibold shadow-xs animate-fade-in max-w-xl">
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

      <Tabs defaultValue="profile" className="w-full space-y-4">
        {/* Tabs Bar List */}
        <TabsList className="grid w-full grid-cols-3 max-w-xl">
          <TabsTrigger value="profile" className="flex items-center gap-2 text-xs cursor-pointer">
            <UserIcon className="h-4 w-4" />
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2 text-xs cursor-pointer">
            <LockKeyhole className="h-4 w-4" />
            <span>Keamanan</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 text-xs cursor-pointer">
            <Bell className="h-4 w-4" />
            <span>Notifikasi</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Profile Settings */}
        <TabsContent value="profile" className="focus-visible:outline-none">
          <Card className="border border-border shadow-sm bg-card overflow-hidden max-w-xl rounded-xl">
            <form onSubmit={profileForm.handleSubmit((values) => updateProfileMutation.mutate(values))}>
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-bold text-foreground">
                  Informasi Pribadi
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Ubah data diri dan informasi kontak Anda di SmartTani.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6 text-xs text-foreground">
                {/* Avatar Section */}
                <div className="flex items-center gap-6 pb-2 border-b border-border border-dashed">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border border-border">
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
                      className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-background border border-border shadow-3xs cursor-pointer hover:bg-muted"
                      disabled
                    >
                      <Camera className="h-3.5 w-3.5 text-muted-foreground" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-foreground">Foto Profil</h4>
                    <p className="text-[10px] text-muted-foreground">Format JPG, GIF atau PNG. Maksimal 2MB.</p>
                    <div className="flex gap-2 mt-1">
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="cursor-pointer text-[10px] font-semibold text-foreground bg-background border-border hover:bg-muted h-7 px-2.5 shadow-3xs"
                        disabled
                      >
                        Ganti Foto
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Input Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name" className="text-xs font-bold text-foreground">
                      Nama Lengkap
                    </Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <Input
                        id="full_name"
                        placeholder="Masukkan nama lengkap Anda"
                        {...profileForm.register('full_name')}
                        className="pl-9 h-9 text-xs bg-background border-border focus-visible:ring-ring"
                      />
                    </div>
                    {profileForm.formState.errors.full_name && (
                      <p className="text-[10px] text-destructive font-medium">
                        {profileForm.formState.errors.full_name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-xs font-bold text-foreground">
                      Alamat Email (Tidak dapat diubah)
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <Input
                        id="email"
                        value={profileData?.email || ''}
                        disabled
                        className="pl-9 h-9 text-xs bg-muted border-border text-muted-foreground cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-xs font-bold text-foreground">
                      No. Telepon / WhatsApp
                    </Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                      <Input
                        id="phone"
                        placeholder="Contoh: 081234567890"
                        {...profileForm.register('phone')}
                        className="pl-9 h-9 text-xs bg-background border-border focus-visible:ring-ring"
                      />
                    </div>
                    {profileForm.formState.errors.phone && (
                      <p className="text-[10px] text-destructive font-medium">
                        {profileForm.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 text-xs font-bold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4"
                  disabled={updateProfileMutation.isPending}
                >
                  {updateProfileMutation.isPending ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Menyimpan...
                    </span>
                  ) : (
                    'Simpan Perubahan'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Tab 2: Security Settings */}
        <TabsContent value="security" className="focus-visible:outline-none">
          <Card className="border border-border shadow-sm bg-card overflow-hidden max-w-xl rounded-xl">
            <form onSubmit={securityForm.handleSubmit((values) => changePasswordMutation.mutate(values))}>
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-bold text-foreground">Ubah Kata Sandi</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4 text-xs text-foreground">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword" className="text-xs font-bold text-foreground">
                    Kata Sandi Saat Ini
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Masukkan kata sandi lama"
                      {...securityForm.register('currentPassword')}
                      className="pl-9 h-9 text-xs bg-background border-border focus-visible:ring-ring"
                    />
                  </div>
                  {securityForm.formState.errors.currentPassword && (
                    <p className="text-[10px] text-destructive font-medium">
                      {securityForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-xs font-bold text-foreground">
                    Kata Sandi Baru
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Minimal 6 karakter"
                      {...securityForm.register('newPassword')}
                      className="pl-9 h-9 text-xs bg-background border-border focus-visible:ring-ring"
                    />
                  </div>
                  {securityForm.formState.errors.newPassword && (
                    <p className="text-[10px] text-destructive font-medium">
                      {securityForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-xs font-bold text-foreground">
                    Konfirmasi Kata Sandi Baru
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Ulangi kata sandi baru"
                      {...securityForm.register('confirmPassword')}
                      className="pl-9 h-9 text-xs bg-background border-border focus-visible:ring-ring"
                    />
                  </div>
                  {securityForm.formState.errors.confirmPassword && (
                    <p className="text-[10px] text-destructive font-medium">
                      {securityForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 text-xs font-bold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4"
                  disabled={changePasswordMutation.isPending}
                >
                  {changePasswordMutation.isPending ? (
                    <span className="flex items-center gap-1.5">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" /> Mengubah...
                    </span>
                  ) : (
                    'Ubah Kata Sandi'
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Tab 3: Notifications Preferences */}
        <TabsContent value="notifications" className="focus-visible:outline-none">
          <Card className="border border-border shadow-sm bg-card overflow-hidden max-w-xl rounded-xl">
            <form onSubmit={handleSaveNotifications}>
              <CardHeader className="pb-3 border-b border-border">
                <CardTitle className="text-sm font-bold text-foreground">
                  Preferensi Notifikasi
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">
                  Atur jenis pemberitahuan belanja dan informasi penawaran yang ingin Anda terima.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-5 text-xs text-foreground">
                <div className="flex items-center justify-between gap-4 p-4 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border-dashed">
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs font-bold text-foreground cursor-pointer">
                      Notifikasi Transaksi (Email)
                    </Label>
                    <p className="text-[10px] text-muted-foreground leading-normal font-normal">
                      Kirim invoice pembayaran, rincian pesanan baru, dan kwitansi belanja via email.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.email_new_order}
                    onCheckedChange={(checked) => handleTogglePreference('email_new_order', checked)}
                    className="cursor-pointer animate-fade-in"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 p-4 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border-dashed">
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs font-bold text-foreground cursor-pointer">
                      Notifikasi Pelacakan Kurir (Email)
                    </Label>
                    <p className="text-[10px] text-muted-foreground leading-normal font-normal">
                      Terima email pembaruan otomatis saat status transit pengiriman logistik Anda berubah.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.email_payment}
                    onCheckedChange={(checked) => handleTogglePreference('email_payment', checked)}
                    className="cursor-pointer animate-fade-in"
                  />
                </div>

                <div className="flex items-center justify-between gap-4 p-4 border border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors border-dashed">
                  <div className="space-y-1 flex-1">
                    <Label className="text-xs font-bold text-foreground cursor-pointer">
                      Promo & Penawaran Kemitraan (Push)
                    </Label>
                    <p className="text-[10px] text-muted-foreground leading-normal font-normal">
                      Kirim newsletter pemberitahuan diskon marketplace dan promo investasi kemitraan baru.
                    </p>
                  </div>
                  <Switch
                    checked={preferences.push_notification}
                    onCheckedChange={(checked) => handleTogglePreference('push_notification', checked)}
                    className="cursor-pointer animate-fade-in"
                  />
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0 flex justify-end">
                <Button
                  type="submit"
                  size="sm"
                  className="h-9 text-xs font-bold cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90 px-4"
                >
                  Simpan Preferensi
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
