'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { logisticsService } from '@/services/logistics';
import { useAuthStore } from '@/stores/auth';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  Activity,
  Award,
} from 'lucide-react';

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ec4899', '#8b5cf6', '#f97316'];

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

const MOCK_PERFORMANCE_TRENDS = [
  { month: 'Des', delivered: 45, avg_hours: 18.2 },
  { month: 'Jan', delivered: 58, avg_hours: 17.0 },
  { month: 'Feb', delivered: 64, avg_hours: 16.5 },
  { month: 'Mar', delivered: 70, avg_hours: 15.2 },
  { month: 'Apr', delivered: 75, avg_hours: 14.8 },
  { month: 'Mei', delivered: 78, avg_hours: 14.5 },
];

const MOCK_STATUS_DISTRIBUTION = [
  { name: 'Menunggu Pickup', value: 3 },
  { name: 'Diambil', value: 1 },
  { name: 'Transit', value: 1 },
  { name: 'Sukses Terkirim', value: 78 },
];

export default function LogisticsPerformancePage() {
  const user = useAuthStore((state) => state.user);

  const {
    data: analyticsResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['logistics-analytics-performance', user?.id],
    queryFn: () => logisticsService.getLogisticsAnalytics(user?.id || ''),
    enabled: !!user?.id,
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan performa analitik offline. Menggunakan data demo lokal.', {
        description:
          'Menampilkan data grafik simulasi agar Anda tetap dapat memantau produktivitas.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const rawData = isQueryError ? MOCK_ANALYTICS : analyticsResponse || MOCK_ANALYTICS;

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-80 w-full" />
          <Skeleton className="h-80 w-full" />
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
              <p className="text-xs font-bold text-red-800">Layanan Performa Offline</p>
              <p className="text-[10px] text-red-600 font-semibold">
                Layanan Logistik Offline: Gagal memuat data teraktual. Menggunakan data demo lokal.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-7 text-[10px] font-bold border-red-300 text-red-800 bg-white hover:bg-red-100 hover:text-red-900 cursor-pointer flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="h-3 w-3" /> Coba Hubungkan Kembali
          </Button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Analisis Performa Kurir
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Ukur produktivitas operasional pengiriman, rata-rata waktu transit, dan efisiensi karir
          Anda.
        </p>
      </div>

      {/* Numerical summaries */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pl-6">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tingkat Ketepatan Waktu
            </CardDescription>
            <Award className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="space-y-1 pl-6">
            <CardTitle className="text-2xl font-bold text-slate-800 tabular-nums lg:text-3xl">
              {rawData.ontime_rate_percent}%
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">Ketepatan kirim (Target &gt;95%)</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pl-6">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rata-rata Transit
            </CardDescription>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="space-y-1 pl-6">
            <CardTitle className="text-2xl font-bold text-slate-800 tabular-nums lg:text-3xl">
              {rawData.avg_delivery_hours} Jam
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">Efisiensi waktu tempuh antarkota</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-green-600" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pl-6">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Pertumbuhan Bulanan
            </CardDescription>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent className="space-y-1 pl-6">
            <CardTitle className="text-2xl font-bold text-green-600 tabular-nums lg:text-3xl">
              +{rawData.monthly_change_percent}%
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">
              Kenaikan order dibanding bulan lalu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Visual Analytics Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Trend of success deliveries and transit hours */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-green-600" /> Tren Produktivitas Bulanan
            </CardTitle>
            <CardDescription className="text-xs">
              Rata-rata waktu transit vs kuantitas paket terkirim.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="h-72 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={MOCK_PERFORMANCE_TRENDS}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis yAxisId="left" stroke="#3b82f6" fontSize={10} tickLine={false} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#eab308"
                    fontSize={10}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0',
                    }}
                    labelStyle={{ fontWeight: 'bold', color: '#1e293b' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="delivered"
                    name="Paket Terkirim"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="avg_hours"
                    name="Rata Durasi (Jam)"
                    stroke="#eab308"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Status distributions */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-green-600" /> Distribusi Status Paket
            </CardTitle>
            <CardDescription className="text-xs">
              Peta komposisi daur hidup paket yang di-assign seumur hidup.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 pt-2">
            <div className="h-72 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MOCK_STATUS_DISTRIBUTION}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  >
                    {MOCK_STATUS_DISTRIBUTION.map((_entry: unknown, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Paket`, 'Jumlah']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
