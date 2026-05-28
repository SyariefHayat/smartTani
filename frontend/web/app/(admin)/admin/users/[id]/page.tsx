'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService, User } from '@/services/user';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  ChevronLeft,
  UserCheck,
  UserX,
  Calendar,
  Mail,
  Shield,
  Sprout,
  ShoppingBag,
  TrendingUp,
  Award,
  Truck,
  BookOpen,
  AlertTriangle,
  Lock,
  Users,
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminUserDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const queryClient = useQueryClient();

  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch User Details Query
  const { data: user, isLoading } = useQuery<any>({
    queryKey: ['admin-user-detail', id],
    queryFn: async () => {
      try {
        const res = await userService.getUserById(id);
        return res;
      } catch {
        setIsOffline(true);
        // Fallback search in local storage admin-users list
        const stored = JSON.parse(localStorage.getItem('admin-users') || '[]');
        const found = stored.find((u: any) => u.id === id);

        if (!found) throw new Error('User not found');

        // Enrich user with mock profile info depending on role
        return {
          ...found,
          phone: '+62 823-2695-2833',
          last_login: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
          avatar: '',
          // Mock Role activity summary
          activity: getMockRoleActivity(found.role),
        };
      }
    },
  });

  // Verify mutation
  const verifyMutation = useMutation({
    mutationFn: async () => {
      try {
        await userService.verifyUser(id);
      } catch {
        const stored: User[] = JSON.parse(localStorage.getItem('admin-users') || '[]');
        const updated = stored.map((u) => (u.id === id ? { ...u, status: 'active' } : u));
        localStorage.setItem('admin-users', JSON.stringify(updated));
      }
    },
    onSuccess: () => {
      toast.success('Pengguna berhasil diverifikasi!');
      queryClient.invalidateQueries({ queryKey: ['admin-user-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
    },
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async (newStatus: 'active' | 'suspended') => {
      try {
        await userService.updateStatus(id, newStatus);
      } catch {
        const stored: User[] = JSON.parse(localStorage.getItem('admin-users') || '[]');
        const updated = stored.map((u) => (u.id === id ? { ...u, status: newStatus } : u));
        localStorage.setItem('admin-users', JSON.stringify(updated));
      }
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Akun pengguna berhasil di-${variables === 'active' ? 'aktifkan' : 'suspend'}!`
      );
      queryClient.invalidateQueries({ queryKey: ['admin-user-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-users-list'] });
    },
  });

  // Reset password simulation
  const handleResetPassword = () => {
    toast.success('Tautan reset kata sandi telah dikirim ke email pengguna.', {
      description: `Email instruksi dikirim ke: ${user?.email}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Aktif</Badge>;
      case 'pending_verification':
        return (
          <Badge className="bg-amber-100 text-amber-700 border-amber-200">
            Menunggu Verifikasi
          </Badge>
        );
      case 'suspended':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Ditangguhkan</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleLabel = (role: string) => {
    const roles: Record<string, string> = {
      petani: 'Petani (Farmer)',
      buyer: 'Buyer (Pembeli)',
      investor: 'Investor (Penyokong Dana)',
      distributor: 'Distributor (B2B)',
      logistik: 'Logistik (Kurir)',
      siswa: 'Siswa Academy',
      instruktur: 'Instruktur Academy',
      admin: 'Super Administrator',
    };
    return roles[role] || role;
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-80 md:col-span-2 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full text-center py-20">
        <h3 className="text-sm font-bold text-slate-700">Pengguna Tidak Ditemukan</h3>
        <Link href="/admin/users">
          <Button size="sm" className="mt-4 bg-green-600 text-white rounded-xl">
            Kembali ke Daftar
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Back button */}
      <div>
        <Link
          href="/admin/users"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali ke Daftar Pengguna
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
          Detail Pengguna: {user.full_name || '-'} {getStatusBadge(user.status)}
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Ulas detail profil, status pendaftaran komoditi pertanian, and rekapitulasi performa
          perannya di ekosistem SmartTani.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Auth Service sedang tidak terhubung. Seluruh perubahan profil ini disimpan di database
              peramban Anda.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Columns: Profile details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">
                Informasi Profil Akun
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 grid gap-4 sm:grid-cols-2 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">Nama Lengkap</span>
                <span className="text-slate-800">{user.full_name || '-'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">Alamat Email</span>
                <span className="text-slate-800 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-slate-400" /> {user.email}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">Nomor Telepon</span>
                <span className="text-slate-800">{user.phone || '-'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">Hak Akses Role</span>
                <span className="text-slate-800 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-slate-400" /> {getRoleLabel(user.role)}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">Tanggal Terdaftar</span>
                <span className="text-slate-800 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />{' '}
                  {new Date(user.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">Login Terakhir</span>
                <span className="text-slate-800">
                  {user.last_login
                    ? new Date(user.last_login).toLocaleString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Role specific dynamic metrics card */}
          {user.activity && (
            <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
              <CardHeader className="pb-4 border-b border-slate-100">
                <CardTitle className="text-sm font-bold text-slate-800">
                  Ringkasan Aktivitas Peran: {getRoleLabel(user.role)}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-4.5 sm:grid-cols-3">
                  {user.activity.metrics.map((m: any, idx: number) => {
                    const MetricIcon = m.icon;
                    return (
                      <div
                        key={idx}
                        className="bg-slate-50 border border-slate-100 rounded-xl p-4.5 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">
                            {m.label}
                          </span>
                          <MetricIcon className="h-4.5 w-4.5 text-slate-400" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">{m.value}</h3>
                      </div>
                    );
                  })}
                </div>

                {user.activity.list && user.activity.list.length > 0 && (
                  <div className="mt-6 space-y-3.5">
                    <span className="text-xs font-bold text-slate-800 block">
                      {user.activity.listTitle}
                    </span>
                    <div className="border border-slate-100 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white">
                      {user.activity.list.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-3.5 text-xs font-semibold text-slate-700 flex justify-between items-center"
                        >
                          <span className="text-slate-800">{item.name}</span>
                          <span className="text-slate-400 text-[10px]">{item.meta}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Moderation Actions Panel */}
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-red-500 to-amber-500" />
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">
                Panel Kendali Keamanan & Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {/* Verify Pending user action */}
              {user.status === 'pending_verification' && (
                <div className="space-y-2 bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <h4 className="text-xs font-bold text-amber-800">Verifikasi Dokumen KTP</h4>
                  <p className="text-[10px] text-amber-600 font-semibold leading-normal">
                    Pengguna telah mengunggah dokumen pendaftaran resmi. Silakan periksa kelayakan
                    berkas KTP sebelum memberikan otorisasi perdagangan.
                  </p>
                  <Button
                    onClick={() => {
                      if (confirm('Konfirmasi verifikasi identitas pengguna ini?')) {
                        verifyMutation.mutate();
                      }
                    }}
                    disabled={verifyMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold gap-1.5 py-4 cursor-pointer mt-1"
                  >
                    <UserCheck className="h-4.5 w-4.5" /> Berikan Verifikasi
                  </Button>
                </div>
              )}

              {/* Reset Password */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                  Tindakan Akun
                </span>
                <Button
                  onClick={handleResetPassword}
                  variant="outline"
                  className="w-full border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold gap-1.5 py-4 cursor-pointer"
                >
                  <Lock className="h-4.5 w-4.5 text-slate-400" /> Kirim Reset Password
                </Button>
              </div>

              {/* Suspend or Activate Account */}
              {user.role !== 'admin' && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Status Otorisasi
                  </span>
                  {user.status === 'active' ? (
                    <Button
                      onClick={() => {
                        if (
                          confirm(
                            'Apakah Anda yakin ingin menangguhkan (suspend) akun ini? Pengguna tidak akan dapat login sementara waktu.'
                          )
                        ) {
                          updateStatusMutation.mutate('suspended');
                        }
                      }}
                      disabled={updateStatusMutation.isPending}
                      className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold gap-1.5 py-4 cursor-pointer"
                    >
                      <UserX className="h-4.5 w-4.5" /> Suspend Akun (Tangguhkan)
                    </Button>
                  ) : user.status === 'suspended' ? (
                    <Button
                      onClick={() => {
                        if (confirm('Aktifkan kembali akun ini?')) {
                          updateStatusMutation.mutate('active');
                        }
                      }}
                      disabled={updateStatusMutation.isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold gap-1.5 py-4 cursor-pointer"
                    >
                      <UserCheck className="h-4.5 w-4.5" /> Aktifkan Kembali Akun
                    </Button>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Mock Role-based details enricher
function getMockRoleActivity(role: string) {
  switch (role) {
    case 'petani':
      return {
        metrics: [
          { label: 'Total Produk', value: '8 Produk', icon: Sprout },
          { label: 'Pesanan Masuk', value: '142 Transaksi', icon: ShoppingBag },
          { label: 'Total Penghasilan', value: 'Rp 32.450.000', icon: TrendingUp },
        ],
        listTitle: 'Produk Terpopuler Petani',
        list: [
          { name: 'Cabe Rawit Organik Unggul (1kg)', meta: '120kg Terjual' },
          { name: 'Pupuk Kompos Fermentasi Matang (10kg)', meta: '80 Karung Terjual' },
        ],
      };
    case 'buyer':
      return {
        metrics: [
          { label: 'Pesanan Dibuat', value: '24 Pesanan', icon: ShoppingBag },
          { label: 'Total Belanja', value: 'Rp 6.800.000', icon: TrendingUp },
          { label: 'Wishlist Tersimpan', value: '12 Item', icon: Sprout },
        ],
        listTitle: 'Pesanan Terakhir Pembeli',
        list: [
          { name: 'Order #ST-98245 - 2kg Tomat Ceri', meta: 'Selesai • Rp 95.000' },
          { name: 'Order #ST-98112 - 5kg Melon Hidroponik', meta: 'Selesai • Rp 180.000' },
        ],
      };
    case 'investor':
      return {
        metrics: [
          { label: 'Proyek Didanai', value: '6 Proyek', icon: Sprout },
          { label: 'Total Investasi', value: 'Rp 75.000.000', icon: TrendingUp },
          { label: 'Rata-rata ROI', value: '14.8%', icon: Award },
        ],
        listTitle: 'Portofolio Investasi Aktif',
        list: [
          { name: 'Pendanaan Cabe Rawit NFT Lamongan', meta: 'Sedang Berjalan • Rp 25.000.000' },
          {
            name: 'Kelompok Tani Melon Hidroponik Sukorejo',
            meta: 'Selesai (ROI 15%) • Rp 15.000.000',
          },
        ],
      };
    case 'siswa':
      return {
        metrics: [
          { label: 'Kelas Diikuti', value: '4 Kursus', icon: BookOpen },
          { label: 'Sertifikat Emas', value: '2 Sertifikat', icon: Award },
          { label: 'Total Jam Belajar', value: '48.5 Jam', icon: Calendar },
        ],
        listTitle: 'Progres Belajar Terakhir',
        list: [
          { name: 'Budidaya Cabe Hidroponik Skala Ekspor', meta: 'Progress 85%' },
          { name: 'Manajemen Keuangan Bisnis Tani Dasar', meta: 'Lulus (100%) • Sertifikat' },
        ],
      };
    case 'instruktur':
      return {
        metrics: [
          { label: 'Kelas Diajar', value: '3 Kursus', icon: BookOpen },
          { label: 'Total Peserta', value: '1.240 Murid', icon: Users },
          { label: 'Rata-rata Rating', value: '4.85 / 5', icon: Award },
        ],
        listTitle: 'Kursus Utama Instruktur',
        list: [
          { name: 'Budidaya Melon Hidroponik Skala Industri', meta: '850 Peserta • Rating 4.9' },
          { name: 'Teknik Fertigasi & Sensor IoT Pertanian', meta: '390 Peserta • Rating 4.8' },
        ],
      };
    default:
      return null;
  }
}
