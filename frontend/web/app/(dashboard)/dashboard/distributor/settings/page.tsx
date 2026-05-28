'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { authService } from '@/services/auth';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  User,
  Lock,
  Key,
  ShieldCheck,
  Mail,
  Phone,
  Building2,
  MapPin,
  Award,
  CheckCircle,
} from 'lucide-react';

export default function DistributorSettingsPage() {
  const router = useRouter();
  const user = getStoredAuthUser();

  // Tab 1: Profile Business forms state
  const [companyName, setCompanyName] = React.useState('Distributor Sembako Mandiri');
  const [ownerName, setOwnerName] = React.useState(user?.name || user?.full_name || 'Mitra B2B');
  const [email] = React.useState(user?.email || 'distributor@smarttani.id');
  const [phone, setPhone] = React.useState(
    (user as unknown as Record<string, string>)?.phone || '0812-3456-7890'
  );
  const [businessAddress, setBusinessAddress] = React.useState(
    'Gudang Utama Blok C, Jl. Raya Industri No. 45, Surabaya'
  );
  const [licenseSiup, setLicenseSiup] = React.useState('SIUP/503/008892/2025');
  const [distributionAreas, setDistributionAreas] = React.useState<string[]>([
    'Jawa Timur',
    'Jawa Tengah',
  ]);
  const [isProfileUpdating, setIsProfileUpdating] = React.useState(false);

  // Tab 2: Password reset form state
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isPasswordUpdating, setIsPasswordUpdating] = React.useState(false);

  const availableAreas = [
    'Jawa Timur',
    'Jawa Tengah',
    'Jawa Barat',
    'DKI Jakarta',
    'Banten',
    'Bali',
  ];

  React.useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/dashboard/distributor/settings');
    }
  }, [user, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (companyName.trim() === '' || ownerName.trim() === '') {
      toast.error('Nama Perusahaan dan Pemilik tidak boleh kosong.');
      return;
    }

    setIsProfileUpdating(true);
    try {
      const payload = {
        full_name: ownerName,
        phone,
        company_name: companyName,
        business_license: licenseSiup,
        business_address: businessAddress,
        distribution_areas: distributionAreas,
      };
      await authService.updateProfile(payload);
      toast.success('Profil bisnis B2B berhasil diperbarui!');
    } catch {
      // Local fallback simulation
      toast.success('[Simulasi] Profil bisnis distributor disimpan!', {
        description: 'Toko memori B2B terisi secara lokal.',
      });
    } finally {
      setIsProfileUpdating(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (oldPassword === '' || newPassword === '' || confirmPassword === '') {
      toast.error('Seluruh kolom kata sandi wajib diisi.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Kata sandi baru minimal 6 karakter.');
      return;
    }

    setIsPasswordUpdating(true);
    try {
      await authService.changePassword({
        currentPassword: oldPassword,
        newPassword,
      });
      toast.success('Kata sandi berhasil diperbarui!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.success('[Simulasi] Kata sandi distributor diperbarui!', {
        description: 'Autentikasi luring diproses.',
      });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setIsPasswordUpdating(false);
    }
  };

  const toggleArea = (area: string) => {
    if (distributionAreas.includes(area)) {
      setDistributionAreas(distributionAreas.filter((a) => a !== area));
    } else {
      setDistributionAreas([...distributionAreas, area]);
    }
  };

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Pengaturan Akun & Bisnis
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Kelola biodata pengenal usaha, perizinan SIUP, wilayah cakupan grosir, dan keamanan kata
          sandi.
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full space-y-6">
        <TabsList className="bg-slate-100 p-1 border border-slate-200/50 rounded-xl max-w-sm flex">
          <TabsTrigger
            value="profile"
            className="flex-1 text-xs font-bold py-2 rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Building2 className="h-4 w-4" /> Profil Usaha
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="flex-1 text-xs font-bold py-2 rounded-lg cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Lock className="h-4 w-4" /> Keamanan & Sandi
          </TabsTrigger>
        </TabsList>

        {/* Business Profile tab content */}
        <TabsContent value="profile">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden max-w-2xl">
            <CardHeader className="pb-4 border-b border-slate-50">
              <CardTitle className="text-sm font-bold text-slate-800">
                Identitas Bisnis & Kemitraan B2B
              </CardTitle>
              <CardDescription className="text-xs">
                Ubah data pendirian usaha, wilayah distribusi suplai, dan telepon.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="pt-6 space-y-5">
                {/* Email (Readonly) */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    Email Bisnis (Akun)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="email"
                      value={email}
                      disabled
                      className="pl-10 h-11 text-xs font-semibold bg-slate-50 border-slate-100 text-slate-400"
                    />
                  </div>
                </div>

                {/* Company & Owner name */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                      Nama Perusahaan / CV
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="pl-10 h-11 text-xs font-semibold border-slate-200 focus:border-green-500"
                        placeholder="Contoh: CV Sembako Mandiri..."
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                      Nama Pemilik Usaha
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        className="pl-10 h-11 text-xs font-semibold border-slate-200 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Phone & SIUP License */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                      Telepon / WhatsApp Gudang
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-10 h-11 text-xs font-semibold border-slate-200 focus:border-green-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                      Nomor SIUP / Izin Usaha
                    </label>
                    <div className="relative">
                      <Award className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        type="text"
                        value={licenseSiup}
                        onChange={(e) => setLicenseSiup(e.target.value)}
                        className="pl-10 h-11 text-xs font-semibold border-slate-200 focus:border-green-500"
                        placeholder="Contoh: SIUP/xxx..."
                      />
                    </div>
                  </div>
                </div>

                {/* Warehouse Address */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    Alamat Gudang Utama
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                    <textarea
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      rows={2}
                      className="pl-10 pt-2.5 text-xs font-semibold border border-slate-200 rounded-lg focus:border-green-500 w-full"
                    />
                  </div>
                </div>

                {/* Distribution Areas multiselect chips */}
                <div className="space-y-2 pt-2">
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    Wilayah Distribusi (Cakupan Grosir)
                  </label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {availableAreas.map((area) => {
                      const isSelected = distributionAreas.includes(area);
                      return (
                        <button
                          type="button"
                          key={area}
                          onClick={() => toggleArea(area)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1 transition-all ${
                            isSelected
                              ? 'bg-green-600 text-white shadow-sm'
                              : 'bg-slate-50 border border-slate-200/50 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {isSelected && <CheckCircle className="w-3.5 h-3.5 fill-green-700/20" />}
                          {area}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-6 border-t border-slate-50 bg-slate-50/20 flex sm:justify-end gap-3 mt-4">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-10 cursor-pointer shadow-sm"
                  disabled={isProfileUpdating}
                >
                  {isProfileUpdating ? 'Menyimpan...' : 'Simpan Profil Bisnis'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>

        {/* Security Password tab content */}
        <TabsContent value="security">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden max-w-2xl">
            <CardHeader className="pb-4 border-b border-slate-50">
              <CardTitle className="text-sm font-bold text-slate-800">
                Keamanan Sandi Akun
              </CardTitle>
              <CardDescription className="text-xs">
                Ubah kata sandi secara berkala untuk menjaga keutuhan akun kemitraan B2B.
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleResetPassword}>
              <CardContent className="pt-6 space-y-5">
                {/* Old password */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    Kata Sandi Saat Ini
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="pl-10 h-11 text-xs font-semibold border-slate-200 focus:border-green-500"
                      placeholder="Masukkan kata sandi lama..."
                    />
                  </div>
                </div>

                {/* New password */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 h-11 text-xs font-semibold border-slate-200 focus:border-green-500"
                      placeholder="Minimal 6 karakter..."
                    />
                  </div>
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
                    Konfirmasi Kata Sandi Baru
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 h-11 text-xs font-semibold border-slate-200 focus:border-green-500"
                      placeholder="Ulangi kata sandi baru..."
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2 pb-6 border-t border-slate-50 bg-slate-50/20 flex sm:justify-end gap-3 mt-4">
                <Button
                  type="submit"
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 cursor-pointer shadow-sm"
                  disabled={isPasswordUpdating}
                >
                  {isPasswordUpdating ? 'Memproses...' : 'Ubah Kata Sandi'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
