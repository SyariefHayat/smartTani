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
  Shield,
  Smartphone,
} from 'lucide-react';

import { useAuthStore } from '@/stores/auth';
import { authService } from '@/services/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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

export default function InvestorSettingsPage() {
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
    queryKey: ['investor-profile'],
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
      router.push('/login?redirect=/dashboard/investor/settings');
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
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error('Gagal memperbarui profil: ' + (err.response?.data?.message || err.message));
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
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      toast.error('Gagal memperbarui kata sandi: ' + (err.response?.data?.message || err.message));
    },
  });

  // Notifications State
  const [preferences, setPreferences] = React.useState(notificationPreferences);
  const [prevPreferences, setPrevPreferences] = React.useState(notificationPreferences);
  if (notificationPreferences !== prevPreferences) {
    setPrevPreferences(notificationPreferences);
    setPreferences(notificationPreferences);
  }

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
    <div className="w-full space-y-6 text-slate-900 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          Pengaturan Akun
        </h1>
        <p className="text-sm text-slate-500">
          Kelola profil, keamanan kata sandi, dan preferensi notifikasi Anda.
        </p>
      </div>

      <div className="h-[1px] w-full bg-slate-200" />

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

      <Tabs defaultValue="profile" className="flex flex-col md:flex-row gap-6 w-full items-start">
        {/* Sidebar Nav Card */}
        <div className="w-full md:w-64 shrink-0 rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
          <TabsList className="flex flex-row md:flex-col h-auto bg-transparent p-0 gap-1 items-start w-full overflow-x-auto md:overflow-x-visible">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-3 w-full justify-start px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-slate-600 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none hover:bg-slate-50 hover:text-slate-900"
            >
              <UserIcon className="h-4 w-4 shrink-0" />
              <span>Profil</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-3 w-full justify-start px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-slate-600 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none hover:bg-slate-50 hover:text-slate-900"
            >
              <LockKeyhole className="h-4 w-4 shrink-0" />
              <span>Keamanan</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-3 w-full justify-start px-3 py-2 text-sm font-semibold rounded-lg transition-all cursor-pointer text-slate-600 data-[state=active]:bg-slate-100 data-[state=active]:text-slate-900 data-[state=active]:shadow-none hover:bg-slate-50 hover:text-slate-900"
            >
              <Bell className="h-4 w-4 shrink-0" />
              <span>Notifikasi</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Active Content Panel */}
        <div className="flex-1 w-full">
          {/* Tab 1: Profile Settings */}
          <TabsContent value="profile" className="m-0 focus-visible:outline-none">
            <Card className="border border-slate-200 shadow-xs text-slate-900 bg-white rounded-xl">
              <CardHeader>
                <CardTitle>Profil Investor</CardTitle>
                <CardDescription>
                  Perbarui informasi pribadi dan foto profil investasi Anda.
                </CardDescription>
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
                      disabled
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

                <form
                  onSubmit={profileForm.handleSubmit((values) =>
                    updateProfileMutation.mutate(values)
                  )}
                  className="space-y-6"
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Nama Lengkap</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                          id="full_name"
                          placeholder="Masukkan nama lengkap"
                          {...profileForm.register('full_name')}
                          className="pl-9 bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 text-xs"
                        />
                      </div>
                      {profileForm.formState.errors.full_name && (
                        <p className="text-xs text-red-500">
                          {profileForm.formState.errors.full_name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Alamat Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                          id="email"
                          value={profileData?.email || ''}
                          disabled
                          className="pl-9 bg-slate-50/80 border-slate-200 text-slate-500 cursor-not-allowed text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Nomor Telepon</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                          id="phone"
                          placeholder="Contoh: 081234567890"
                          {...profileForm.register('phone')}
                          className="pl-9 bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 text-xs"
                        />
                      </div>
                      {profileForm.formState.errors.phone && (
                        <p className="text-xs text-red-500">
                          {profileForm.formState.errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Peran</Label>
                      <div className="relative">
                        <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                        <Input
                          id="role"
                          value={
                            profileData?.role === 'investor' ? 'Investor' : profileData?.role || ''
                          }
                          disabled
                          className="pl-9 bg-slate-50/80 border-slate-200 text-slate-500 cursor-not-allowed text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => profileForm.reset()}
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
                      {updateProfileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        'Simpan Perubahan'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 2: Security Settings */}
          <TabsContent value="security" className="m-0 focus-visible:outline-none">
            <Card className="border border-slate-200 shadow-xs rounded-xl overflow-hidden bg-white text-slate-900">
              <CardHeader className="border-b bg-slate-50/50 border-slate-100 rounded-t-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 text-green-700 rounded-lg">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Keamanan Akun</CardTitle>
                    <CardDescription>
                      Perbarui kata sandi Anda secara berkala untuk menjaga keamanan akun.
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <form
                  onSubmit={securityForm.handleSubmit((values) =>
                    changePasswordMutation.mutate(values)
                  )}
                  className="space-y-6 max-w-md"
                >
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Password Saat Ini</Label>
                    <div className="relative">
                      <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                      <Input
                        id="currentPassword"
                        type="password"
                        placeholder="••••••••"
                        className="pl-9 bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 text-xs"
                        {...securityForm.register('currentPassword')}
                      />
                    </div>
                    {securityForm.formState.errors.currentPassword && (
                      <p className="text-xs text-red-500">
                        {securityForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">Password Baru</Label>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                          id="newPassword"
                          type="password"
                          placeholder="••••••••"
                          className="pl-9 bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 text-xs"
                          {...securityForm.register('newPassword')}
                        />
                      </div>
                      {securityForm.formState.errors.newPassword && (
                        <p className="text-xs text-red-500">
                          {securityForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                      <div className="relative">
                        <LockKeyhole className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <Input
                          id="confirmPassword"
                          type="password"
                          placeholder="••••••••"
                          className="pl-9 bg-white border-slate-200 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 text-xs"
                          {...securityForm.register('confirmPassword')}
                        />
                      </div>
                      {securityForm.formState.errors.confirmPassword && (
                        <p className="text-xs text-red-500">
                          {securityForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="cursor-pointer bg-green-600 hover:bg-green-700 text-white font-semibold text-xs h-9 px-4 w-full sm:w-auto shadow-2xs"
                      disabled={changePasswordMutation.isPending}
                    >
                      {changePasswordMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        'Simpan Perubahan'
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab 3: Notifications Preferences */}
          <TabsContent value="notifications" className="m-0 focus-visible:outline-none">
            <Card className="border border-slate-200 shadow-xs text-slate-900 bg-white rounded-xl">
              <CardHeader>
                <CardTitle>Preferensi Notifikasi</CardTitle>
                <CardDescription>
                  Pilih jenis informasi dan saluran notifikasi yang ingin Anda terima sebagai
                  investor.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <form onSubmit={handleSaveNotifications} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors border-slate-100 border-dashed">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-blue-50 text-blue-600">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <Label
                            htmlFor="notify-order"
                            className="text-sm font-bold cursor-pointer"
                          >
                            Notifikasi Pembagian Hasil (Email)
                          </Label>
                          <p className="text-xs text-slate-500">
                            Kirim email invoice rincian pembagian hasil panen dan realisasi
                            investasi ke email Anda.
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="notify-order"
                        checked={preferences.email_new_order}
                        onCheckedChange={(checked) =>
                          handleTogglePreference('email_new_order', checked)
                        }
                        className="cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors border-slate-100 border-dashed">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-indigo-50 text-indigo-600">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                          <Label
                            htmlFor="notify-payment"
                            className="text-sm font-bold cursor-pointer"
                          >
                            Notifikasi Kemitraan Proyek (Email)
                          </Label>
                          <p className="text-xs text-slate-500">
                            Terima berita pembaruan otomatis saat petani menyelesaikan tahapan
                            budidaya atau merilis laporan progres lahan baru.
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="notify-payment"
                        checked={preferences.email_payment}
                        onCheckedChange={(checked) =>
                          handleTogglePreference('email_payment', checked)
                        }
                        className="cursor-pointer"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg bg-slate-50/50 hover:bg-slate-50 transition-colors border-slate-100 border-dashed">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-md bg-green-50 text-green-600">
                          <Smartphone className="h-5 w-5" />
                        </div>
                        <div>
                          <Label htmlFor="notify-push" className="text-sm font-bold cursor-pointer">
                            Rekomendasi Proyek Tani Baru (Push)
                          </Label>
                          <p className="text-xs text-slate-500">
                            Terima pemberitahuan push langsung saat proposal investasi prospek
                            tinggi dirilis ke publik.
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="notify-push"
                        checked={preferences.push_notification}
                        onCheckedChange={(checked) =>
                          handleTogglePreference('push_notification', checked)
                        }
                        className="cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <Button
                      type="submit"
                      className="cursor-pointer bg-green-600 text-white hover:bg-green-700 font-semibold text-xs h-9 shadow-2xs px-4"
                    >
                      Simpan Pengaturan
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
