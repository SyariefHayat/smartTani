'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { logisticsService, IShipment } from '@/services/logistics';
import { useAuthStore } from '@/stores/auth';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  Truck,
  ClipboardList,
  Package,
  Calendar,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  TrendingUp,
  MapPin,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

const MOCK_ANALYTICS = {
  pending_pickup_count: 3,
  active_count: 2,
  delivered_today: 4,
  delivered_this_month: 78,
  delivered_all_time: 412,
  avg_delivery_hours: 14.5,
  ontime_rate_percent: 96.8,
  monthly_change_percent: 8.2,
};

const MOCK_CHART_DATA = [
  { date: 'Senin', deliveries: 5, avg_hours: 12 },
  { date: 'Selasa', deliveries: 7, avg_hours: 13 },
  { date: 'Rabu', deliveries: 4, avg_hours: 11 },
  { date: 'Kamis', deliveries: 8, avg_hours: 15 },
  { date: 'Jumat', deliveries: 6, avg_hours: 14 },
  { date: 'Sabtu', deliveries: 9, avg_hours: 16 },
  { date: 'Minggu', deliveries: 3, avg_hours: 12 },
];

const MOCK_RECENT_SHIPMENTS = [
  {
    id: 'SH-7701',
    order_id: 'ORD-98831',
    status: 'pending_pickup' as const,
    items_count: 3,
    pickup_address: { city: 'Lamongan', full_address: 'Greenhouse Budi, Desa Karang' },
    delivery_address: {
      city: 'Surabaya',
      full_address: 'Jl. Pemuda No. 12',
      recipient_name: 'Andi Wijaya',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 mins ago
  },
  {
    id: 'SH-7702',
    order_id: 'ORD-98822',
    status: 'picked_up' as const,
    items_count: 1,
    pickup_address: { city: 'Lamongan', full_address: 'Lahan Siti, Desa Paciran' },
    delivery_address: {
      city: 'Sidoarjo',
      full_address: 'Perum Asri B3',
      recipient_name: 'Dewi Lestari',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: 'SH-7703',
    order_id: 'ORD-98810',
    status: 'in_transit' as const,
    items_count: 5,
    pickup_address: { city: 'Lamongan', full_address: 'Gudang Tani Sentosa, Glagah' },
    delivery_address: {
      city: 'Gresik',
      full_address: 'Jl. Raya Kebomas 54',
      recipient_name: 'Hadi Susanto',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: 'SH-7690',
    order_id: 'ORD-98781',
    status: 'delivered' as const,
    items_count: 2,
    pickup_address: { city: 'Lamongan', full_address: 'Lahan Agus, Tikung' },
    delivery_address: {
      city: 'Mojokerto',
      full_address: 'Pahlawan Square No. 1',
      recipient_name: 'Rudi Hermawan',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
];

export default function LogisticsOverviewPage() {
  const user = useAuthStore((state) => state.user);

  // Fetch KPI statistics
  const {
    data: analyticsResponse,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['logistics-analytics-overview', user?.id],
    queryFn: () => logisticsService.getLogisticsAnalytics(user?.id || ''),
    enabled: !!user?.id,
  });

  // Fetch recent shipments
  const {
    data: shipmentsResponse,
    isLoading: isShipmentsLoading,
    isError: isShipmentsError,
    refetch: refetchShipments,
  } = useQuery({
    queryKey: ['logistics-shipments-recent'],
    queryFn: () => logisticsService.getShipments({ limit: 5 }),
  });

  const isQueryError = isStatsError || isShipmentsError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan logistik offline. Menggunakan data demo lokal.', {
        description: 'Menampilkan data simulasi kurir agar Anda tetap dapat menjelajahi layout.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const stats = isQueryError ? MOCK_ANALYTICS : analyticsResponse || MOCK_ANALYTICS;
  const recentShipments = isQueryError
    ? MOCK_RECENT_SHIPMENTS
    : shipmentsResponse?.data?.shipments?.slice(0, 5) || MOCK_RECENT_SHIPMENTS;

  const handleRefetchAll = () => {
    refetchStats();
    refetchShipments();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_pickup':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Menunggu Pickup
          </span>
        );
      case 'picked_up':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            Diambil
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Terkirim
          </span>
        );
      default:
        return null;
    }
  };

  if ((isStatsLoading || isShipmentsLoading) && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-[350px] md:col-span-2 w-full" />
          <Skeleton className="h-[350px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Offline Alert */}
      {isQueryError && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-red-50 border border-red-200 rounded-xl p-4 text-red-800 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 animate-pulse" />
            <div>
              <p className="text-xs font-bold text-red-800">Layanan Kurir Offline</p>
              <p className="text-[10px] text-red-600 font-semibold">
                Layanan Logistik Offline: Gagal memuat data teraktual. Menggunakan data demo lokal.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefetchAll}
            className="h-7 text-[10px] font-bold border-red-300 text-red-800 bg-white hover:bg-red-100 hover:text-red-900 cursor-pointer flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="h-3 w-3" /> Coba Hubungkan Kembali
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Ringkasan Pengiriman</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Selamat bekerja,{' '}
            <span className="font-bold text-green-600">{user?.full_name || 'Rekan Kurir'}</span>!
            Siap kirim pesanan hari ini?
          </p>
        </div>
        <div className="text-[10px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
          ID Kurir: #{user?.id?.slice(0, 8) || 'L-DUMMY'}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-400" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pl-6">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Menunggu Pickup
            </CardDescription>
            <ClipboardList className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent className="space-y-1 pl-6">
            <CardTitle className="text-2xl font-bold text-slate-800 tabular-nums lg:text-3xl">
              {stats.pending_pickup_count}
            </CardTitle>
            <p className="text-[10px] font-medium text-slate-400">Paket di greenhouse petani</p>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pl-6">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Dalam Perjalanan
            </CardDescription>
            <Truck className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent className="space-y-1 pl-6">
            <CardTitle className="text-2xl font-bold text-amber-600 tabular-nums lg:text-3xl">
              {stats.active_count}
            </CardTitle>
            <p className="text-[10px] font-medium text-slate-400">Sedang dikirim ke pembeli</p>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pl-6">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Selesai Hari Ini
            </CardDescription>
            <Calendar className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="space-y-1 pl-6">
            <CardTitle className="text-2xl font-bold text-emerald-600 tabular-nums lg:text-3xl">
              {stats.delivered_today}
            </CardTitle>
            <p className="text-[10px] font-medium text-slate-400">Terkirim aman hari ini</p>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-green-600" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pl-6">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              On-Time Rate
            </CardDescription>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent className="space-y-1 pl-6">
            <CardTitle className="text-2xl font-bold text-green-600 tabular-nums lg:text-3xl">
              {stats.ontime_rate_percent}%
            </CardTitle>
            <p className="text-[10px] font-medium text-slate-400">
              Rata-rata waktu transit {stats.avg_delivery_hours} jam
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts & Quick Action Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Recharts Bar Chart deliveries */}
        <Card className="border-slate-200 shadow-sm bg-white md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-bold text-slate-800">
              Tren Pengiriman Selesai
            </CardTitle>
            <CardDescription className="text-xs">
              Jumlah pengiriman sukses kurir per hari minggu ini.
            </CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={MOCK_CHART_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                  />
                  <Bar
                    dataKey="deliveries"
                    name="Jumlah Sukses"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions and Stats */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-800">
              Aksi Cepat & Navigasi
            </CardTitle>
            <CardDescription className="text-xs">
              Kelola antrean kerja aktif kurir logistik.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-2">
            <Link href="/dashboard/logistik/shipments/pending" className="block w-full">
              <Button className="w-full h-11 justify-between bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer">
                <span className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4" /> Ambil Paket Baru
                </span>
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-green-600 px-1 text-[10px] font-bold text-white shadow-sm">
                  {stats.pending_pickup_count}
                </span>
              </Button>
            </Link>

            <Link href="/dashboard/logistik/shipments/active" className="block w-full">
              <Button className="w-full h-11 justify-between bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl cursor-pointer">
                <span className="flex items-center gap-2">
                  <Truck className="h-4 w-4" /> Kirim Paket Aktif
                </span>
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-bold text-amber-700 shadow-sm">
                  {stats.active_count}
                </span>
              </Button>
            </Link>

            <div className="border-t border-slate-100 my-4 pt-4 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500">Total Kirim (Bulan ini)</span>
                <span className="font-bold text-slate-800 tabular-nums">
                  {stats.delivered_this_month} Paket
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-500">Total Seumur Hidup</span>
                <span className="font-bold text-slate-800 tabular-nums">
                  {stats.delivered_all_time} Paket
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-green-600 bg-green-50 px-2 py-1.5 rounded-lg font-semibold mt-2">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Efisiensi
                </span>
                <span className="font-bold">Unggul (+12%)</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Shipments List Table */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800">
              Antrean Pengiriman Terbaru
            </CardTitle>
            <CardDescription className="text-xs">
              Daftar pengiriman paket pertanian terbaru yang ditugaskan kepada Anda.
            </CardDescription>
          </div>
          <Link
            href="/dashboard/logistik/shipments"
            className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            Semua Pengiriman <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/75 border-b border-slate-100">
                <TableRow>
                  <TableHead className="h-10 text-slate-600 font-bold text-xs pl-6">
                    Order ID
                  </TableHead>
                  <TableHead className="h-10 text-slate-600 font-bold text-xs">
                    Hijau / Asal
                  </TableHead>
                  <TableHead className="h-10 text-slate-600 font-bold text-xs">
                    Penerima / Kota
                  </TableHead>
                  <TableHead className="h-10 text-slate-600 font-bold text-xs">Status</TableHead>
                  <TableHead className="h-10 text-slate-600 font-bold text-xs">
                    Jumlah Item
                  </TableHead>
                  <TableHead className="h-10 text-slate-600 font-bold text-xs text-right pr-6">
                    Detail
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentShipments.map((ship) => (
                  <TableRow
                    key={ship.id}
                    className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                  >
                    <TableCell className="py-4 pl-6 font-mono text-xs font-semibold text-slate-700">
                      #{ship.order_id}
                    </TableCell>
                    <TableCell className="py-4 text-xs font-medium text-slate-800 max-w-[200px] truncate">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                        {ship.pickup_address.city}
                      </span>
                    </TableCell>
                    <TableCell className="py-4 text-xs font-semibold text-slate-800 max-w-[200px] truncate">
                      <span className="font-bold text-slate-800 block text-xs truncate">
                        {ship.delivery_address.recipient_name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">
                        Tujuan: {ship.delivery_address.city}
                      </span>
                    </TableCell>
                    <TableCell className="py-4">{getStatusBadge(ship.status)}</TableCell>
                    <TableCell className="py-4 text-xs font-bold text-slate-700 tabular-nums">
                      {ship.items_count} Item
                    </TableCell>
                    <TableCell className="py-4 text-right pr-6">
                      <Link href={`/dashboard/logistik/shipments/${ship.order_id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                        >
                          Lihat Rincian
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
