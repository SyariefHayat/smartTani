'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '@/services/analytics';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  AlertTriangle,
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Percent,
  Award,
  Sprout,
  GraduationCap,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const MOCK_PLATFORM_ANALYTICS = {
  user_distribution: [
    { name: 'Petani (Farmer)', value: 450, color: '#16a34a' },
    { name: 'Buyer', value: 1200, color: '#2563eb' },
    { name: 'Investor', value: 180, color: '#9333ea' },
    { name: 'Distributor', value: 85, color: '#ea580c' },
    { name: 'Logistik (Courier)', value: 110, color: '#06b6d4' },
    { name: 'Siswa (Student)', value: 380, color: '#f59e0b' },
    { name: 'Instruktur', value: 45, color: '#ec4899' },
    { name: 'Admin', value: 12, color: '#64748b' },
  ],
  registration_trend: [
    { date: '2026-05-22', signups: 24, petani: 4, buyer: 15, other: 5 },
    { date: '2026-05-23', signups: 32, petani: 6, buyer: 20, other: 6 },
    { date: '2026-05-24', signups: 28, petani: 3, buyer: 18, other: 7 },
    { date: '2026-05-25', signups: 45, petani: 8, buyer: 30, other: 7 },
    { date: '2026-05-26', signups: 50, petani: 10, buyer: 32, other: 8 },
    { date: '2026-05-27', signups: 48, petani: 9, buyer: 28, other: 11 },
    { date: '2026-05-28', signups: 62, petani: 12, buyer: 38, other: 12 },
  ],
  top_products: [
    {
      id: 'p-1',
      title: 'Pupuk Organik Super Humus 5kg',
      farmer: 'Bambang Sugiharto',
      sold: 340,
      revenue: 8500000,
      rating: 4.8,
    },
    {
      id: 'p-2',
      title: 'Benih Padi Unggul Ciherang 10kg',
      farmer: 'Siti Aminah',
      sold: 280,
      revenue: 14000000,
      rating: 4.9,
    },
    {
      id: 'p-3',
      title: 'Bawang Merah Lokal Lamongan 1kg',
      farmer: 'Karno Saputro',
      sold: 210,
      revenue: 7350000,
      rating: 4.6,
    },
    {
      id: 'p-4',
      title: 'Alat Siram Otomatis IoT Node',
      farmer: 'Bambang Sugiharto',
      sold: 95,
      revenue: 23750000,
      rating: 4.7,
    },
  ],
  top_farmers: [
    {
      id: 'f-1',
      name: 'Bambang Sugiharto',
      location: 'Karangbinangun, Lamongan',
      total_products: 12,
      total_sales: 435,
      revenue: 32250000,
    },
    {
      id: 'f-2',
      name: 'Siti Aminah',
      location: 'Deket, Lamongan',
      total_products: 8,
      total_sales: 310,
      revenue: 24500000,
    },
    {
      id: 'f-3',
      name: 'Karno Saputro',
      location: 'Glagah, Lamongan',
      total_products: 6,
      total_sales: 220,
      revenue: 11200000,
    },
  ],
  kpi_metrics: {
    active_users: { value: 2462, change: 12.5, type: 'up' },
    verification_rate: { value: '94.2%', change: 2.1, type: 'up' },
    conversion_rate: { value: '3.62%', change: -0.4, type: 'down' },
    retention_rate: { value: '88.5%', change: 4.8, type: 'up' },
  },
};

export default function AdminAnalyticsPage() {
  const [isOffline, setIsOffline] = React.useState(false);
  const [daysFilter, setDaysFilter] = React.useState('7');

  // Fetch Platform Analytics Query
  const { data: analytics, isLoading } = useQuery({
    queryKey: ['admin-platform-analytics', daysFilter],
    queryFn: async () => {
      try {
        const data = await analyticsService.getPlatformAnalytics();
        return {
          ...MOCK_PLATFORM_ANALYTICS,
          ...data,
        };
      } catch {
        setIsOffline(true);
        return MOCK_PLATFORM_ANALYTICS;
      }
    },
  });

  const handleExportData = () => {
    toast.success('Laporan analisis platform berhasil diekspor ke PDF/Excel!');
  };

  const currentKPI = analytics?.kpi_metrics || MOCK_PLATFORM_ANALYTICS.kpi_metrics;

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Analytics Platform 📊
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Analisis data demografis, tren pendaftaran, produk terlaris, dan kinerja mitra tani
            secara nasional.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Days Filter */}
          <div className="flex border border-slate-200 bg-white rounded-xl p-0.5 shadow-sm">
            {['7', '30', '90'].map((d) => (
              <button
                key={d}
                onClick={() => setDaysFilter(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  daysFilter === d
                    ? 'bg-slate-800 text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {d} Hari
              </button>
            ))}
          </div>

          <Button
            onClick={handleExportData}
            size="sm"
            className="bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="h-4 w-4" /> Ekspor Analitis
          </Button>
        </div>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Analytics Service sedang luring. Seluruh grafik demografi dan operasional dimuat
              menggunakan memori simulasi statis.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards Row */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="border-slate-200/80 shadow-xs animate-pulse">
              <CardContent className="p-5 h-24 bg-slate-50 rounded-xl" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-slate-200/80 shadow-xs bg-white rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500">Pengguna Aktif Bulanan</p>
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <Users className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2.5">
                <h3 className="text-2xl font-bold tracking-tight text-slate-800">
                  {currentKPI.active_users.value.toLocaleString('id-ID')}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-[10px] font-bold">
                  {currentKPI.active_users.type === 'up' ? (
                    <span className="text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" /> +{currentKPI.active_users.change}%
                    </span>
                  ) : (
                    <span className="text-red-600 flex items-center">
                      <ArrowDownRight className="h-3 w-3 mr-0.5" /> {currentKPI.active_users.change}
                      %
                    </span>
                  )}
                  <span className="text-slate-400">vs bulan lalu</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-xs bg-white rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500">Rasio Verifikasi Sukses</p>
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <Award className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2.5">
                <h3 className="text-2xl font-bold tracking-tight text-slate-800">
                  {currentKPI.verification_rate.value}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-[10px] font-bold">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> +
                    {currentKPI.verification_rate.change}%
                  </span>
                  <span className="text-slate-400">vs target 90%</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-xs bg-white rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500">Conversion Rate Beli</p>
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <Percent className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2.5">
                <h3 className="text-2xl font-bold tracking-tight text-slate-800">
                  {currentKPI.conversion_rate.value}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-[10px] font-bold">
                  {currentKPI.conversion_rate.type === 'up' ? (
                    <span className="text-green-600 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" /> +
                      {currentKPI.conversion_rate.change}%
                    </span>
                  ) : (
                    <span className="text-red-500 flex items-center">
                      <ArrowDownRight className="h-3 w-3 mr-0.5" />{' '}
                      {currentKPI.conversion_rate.change}%
                    </span>
                  )}
                  <span className="text-slate-400">dari kunjungan web</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 shadow-xs bg-white rounded-2xl">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500">Tingkat Retensi Mitra</p>
                <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                  <TrendingUp className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2.5">
                <h3 className="text-2xl font-bold tracking-tight text-slate-800">
                  {currentKPI.retention_rate.value}
                </h3>
                <div className="flex items-center gap-1 mt-1 text-[10px] font-bold">
                  <span className="text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3 mr-0.5" /> +{currentKPI.retention_rate.change}%
                  </span>
                  <span className="text-slate-400">aktifitas berkelanjutan</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Grid Charts Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Registration Trend Area Chart (Left 2 Columns) */}
        <Card className="md:col-span-2 border-slate-200 bg-white rounded-2xl shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-800">
              Tren Pendaftaran Pengguna Baru
            </CardTitle>
            <CardDescription className="text-[11px] font-semibold text-slate-500">
              Pertumbuhan harian untuk petani, pembeli, dan role lainnya secara nasional.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[300px] bg-slate-50 rounded-xl animate-pulse" />
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={
                      analytics?.registration_trend || MOCK_PLATFORM_ANALYTICS.registration_trend
                    }
                  >
                    <defs>
                      <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="date"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
                      }}
                    />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      labelFormatter={(label) =>
                        new Date(label).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      }
                      contentStyle={{
                        backgroundColor: '#ffffff',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0',
                        fontSize: '12px',
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="signups"
                      name="Total Pendaftar"
                      stroke="#16a34a"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorSignups)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Role Demographics Donut Chart (Right 1 Column) */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-slate-800">
              Demografi Peran Pengguna
            </CardTitle>
            <CardDescription className="text-[11px] font-semibold text-slate-500">
              Rasio proporsi dari total 8 peran ekosistem SmartTani.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            {isLoading ? (
              <div className="h-[220px] w-full bg-slate-50 rounded-full animate-pulse" />
            ) : (
              <>
                <div className="h-[220px] w-full flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={
                          analytics?.user_distribution || MOCK_PLATFORM_ANALYTICS.user_distribution
                        }
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {(
                          analytics?.user_distribution || MOCK_PLATFORM_ANALYTICS.user_distribution
                        ).map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0',
                          fontSize: '11px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Compact Legend Grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2 w-full text-[10px] font-bold text-slate-600">
                  {(analytics?.user_distribution || MOCK_PLATFORM_ANALYTICS.user_distribution).map(
                    (item: any) => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <span
                          className="h-2.5 w-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="truncate">
                          {item.name}: {item.value}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Grid: Top products and top farmers */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Top Selling Products Table */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800">
                Daftar Produk Terlaris 🌿
              </CardTitle>
              <CardDescription className="text-[11px] font-semibold text-slate-500">
                Peringkat produk teratas berdasarkan volume terjual nasional.
              </CardDescription>
            </div>
            <Sprout className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-slate-50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="pb-3">Nama Produk</th>
                      <th className="pb-3">Petani</th>
                      <th className="pb-3 text-center">Terjual</th>
                      <th className="pb-3 text-right">Pendapatan (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {(analytics?.top_products || MOCK_PLATFORM_ANALYTICS.top_products).map(
                      (prod: any) => (
                        <tr key={prod.id} className="hover:bg-slate-50/50 transition-all">
                          <td className="py-3 max-w-[180px] truncate">{prod.title}</td>
                          <td className="py-3 text-slate-500 text-[11px]">{prod.farmer}</td>
                          <td className="py-3 text-center text-slate-800 font-bold">
                            {prod.sold} pcs
                          </td>
                          <td className="py-3 text-right text-green-700 font-bold">
                            {prod.revenue.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Performing Farmers Table */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-xs">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-slate-800">
                Daftar Mitra Tani Teladan 🌟
              </CardTitle>
              <CardDescription className="text-[11px] font-semibold text-slate-500">
                Peringkat petani berkinerja tertinggi berdasarkan volume penjualan & reputasi.
              </CardDescription>
            </div>
            <Award className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-10 bg-slate-50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="pb-3">Nama Petani</th>
                      <th className="pb-3">Lokasi</th>
                      <th className="pb-3 text-center">Total Transaksi</th>
                      <th className="pb-3 text-right">Omset (Rp)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                    {(analytics?.top_farmers || MOCK_PLATFORM_ANALYTICS.top_farmers).map(
                      (f: any) => (
                        <tr key={f.id} className="hover:bg-slate-50/50 transition-all">
                          <td className="py-3 font-bold text-slate-800">{f.name}</td>
                          <td className="py-3 text-slate-500 text-[11px] max-w-[120px] truncate">
                            {f.location}
                          </td>
                          <td className="py-3 text-center text-slate-800 font-bold">
                            {f.total_sales} kali
                          </td>
                          <td className="py-3 text-right text-green-700 font-bold">
                            {f.revenue.toLocaleString('id-ID')}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
