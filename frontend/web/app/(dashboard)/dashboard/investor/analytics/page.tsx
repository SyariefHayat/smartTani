'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  TrendingUp,
  Award,
  Clock,
  Activity,
  AlertTriangle,
  RefreshCw,
  BarChart3,
  PieChartIcon,
} from 'lucide-react';

const COLORS = ['#22c55e', '#3b82f6', '#eab308', '#ec4899', '#8b5cf6', '#f97316'];

const MOCK_ANALYTICS_DATA = {
  avg_roi_percent: 15.6,
  total_invested_projects: 5,
  success_rate_percent: 100,
  avg_duration_days: 110,
  commodity_breakdown: [
    { name: 'Cabai Merah', value: 15000000 },
    { name: 'Tomat', value: 8000000 },
    { name: 'Padi', value: 25000000 },
  ],
  status_breakdown: [
    { name: 'Aktif', value: 2 },
    { name: 'Selesai', value: 3 },
  ],
  roi_trend: [
    { month: 'Des', roi: 12 },
    { month: 'Jan', roi: 13.5 },
    { month: 'Feb', roi: 13.5 },
    { month: 'Mar', roi: 14.2 },
    { month: 'Apr', roi: 15.0 },
    { month: 'Mei', roi: 15.6 },
  ],
};

export default function InvestorAnalyticsPage() {
  const user = useAuthStore((state) => state.user);

  const {
    data: analyticsResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['investor-analytics-charts', user?.id],
    queryFn: () => analyticsService.getInvestorAnalytics(user?.id || ''),
    enabled: !!user?.id,
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan data analitik offline. Menggunakan data demo lokal.', {
        description: 'Menampilkan data grafik simulasi agar Anda tetap dapat memantau antarmuka.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const rawData = isQueryError
    ? MOCK_ANALYTICS_DATA
    : (analyticsResponse as unknown as typeof MOCK_ANALYTICS_DATA) || MOCK_ANALYTICS_DATA;

  // Map fields from backend structure or use fallback fields
  const avgRoi = rawData.avg_roi_percent || MOCK_ANALYTICS_DATA.avg_roi_percent;
  const totalProjects =
    rawData.total_invested_projects || MOCK_ANALYTICS_DATA.total_invested_projects;
  const successRate = rawData.success_rate_percent || MOCK_ANALYTICS_DATA.success_rate_percent;
  const avgDuration = rawData.avg_duration_days || MOCK_ANALYTICS_DATA.avg_duration_days;
  const commodityData = rawData.commodity_breakdown || MOCK_ANALYTICS_DATA.commodity_breakdown;
  const statusData = rawData.status_breakdown || MOCK_ANALYTICS_DATA.status_breakdown;
  const trendData = rawData.roi_trend || MOCK_ANALYTICS_DATA.roi_trend;

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[350px]" />
          <Skeleton className="h-[350px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Offline Alert */}
      {isQueryError && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Layanan Analitik Offline</p>
              <p className="text-[10px] text-amber-600 font-medium">
                Menampilkan data visualisasi simulasi. Silakan hubungkan kembali server Anda untuk
                memantau data aktual.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-7 text-[10px] font-bold border-amber-300 text-amber-700 bg-white hover:bg-amber-100 hover:text-amber-800 cursor-pointer flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="h-3 w-3" /> Coba Hubungkan Kembali
          </Button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Analitik Mendalam</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Eksplorasi pembagian modal, trend ROI, dan rasio kesuksesan proyek tani Anda secara
          komprehensif.
        </p>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rata-rata ROI
            </CardDescription>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-800 tabular-nums">
              +{avgRoi}%
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">Tingkat imbal hasil rata-rata</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Proyek Didanai
            </CardDescription>
            <Activity className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-800 tabular-nums">
              {totalProjects} Proyek
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">Total proyek pertanian didanai</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rasio Keberhasilan
            </CardDescription>
            <Award className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="space-y-1">
            <CardTitle className="text-xl font-bold text-emerald-600 tabular-nums">
              {successRate}%
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">Tingkat proyek panen lancar</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rata-rata Durasi
            </CardDescription>
            <Clock className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent className="space-y-1">
            <CardTitle className="text-xl font-bold text-slate-800 tabular-nums">
              {avgDuration} Hari
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">Masa perputaran modal</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Commodity distribution PieChart */}
        <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <PieChartIcon className="h-4.5 w-4.5 text-green-600" />
              Distribusi Modal per Komoditas
            </CardTitle>
            <CardDescription className="text-xs">
              Proporsi alokasi pendanaan berdasarkan komoditas tanaman.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={commodityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                  >
                    {commodityData.map((entry: { name: string; value: number }, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Investasi']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ROI line chart trend */}
        <Card className="border border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
              <BarChart3 className="h-4.5 w-4.5 text-green-600" />
              Perkembangan Imbal Hasil (%)
            </CardTitle>
            <CardDescription className="text-xs">
              Rata-rata persentase ROI bulanan dari panen selesai.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-64 w-full text-xs">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 10, right: 15, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} stroke="#94a3b8" />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    stroke="#94a3b8"
                    tickFormatter={(v) => `${v}%`}
                  />
                  <Tooltip formatter={(value) => [`+${value}%`, 'ROI']} />
                  <Line
                    type="monotone"
                    dataKey="roi"
                    stroke="#22c55e"
                    strokeWidth={3}
                    activeDot={{ r: 6 }}
                    dot={{ strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
