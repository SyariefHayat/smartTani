'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { distributorService } from '@/services/distributor';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, Award, Layers, BarChart3 } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MOCK_ANALYTICS_DATA = {
  total_spending: 125000000,
  monthly_spending: 34500000,
  spending_change_percent: 12.5,
  active_orders: 3,
  total_orders: 28,
  unique_suppliers: 5,
  unique_products_bought: 14,
  avg_order_value: 4460000,
  top_products: [
    { product_id: 'prod-001', title: 'Beras Pandan Wangi Organik', buy_count: 8, total_qty: 400 },
    { product_id: 'prod-003', title: 'Cabai Rawit Merah Super', buy_count: 6, total_qty: 180 },
    { product_id: 'prod-004', title: 'Kentang Dieng Super', buy_count: 4, total_qty: 250 },
  ],
  top_suppliers: [
    { farmer_id: 'farm-001', name: 'Budi Santoso', total_transactions: 12, total_amount: 45000000 },
    { farmer_id: 'farm-002', name: 'Siti Aminah', total_transactions: 8, total_amount: 32000000 },
    { farmer_id: 'farm-003', name: 'Agus Salim', total_transactions: 5, total_amount: 20500000 },
    { farmer_id: 'farm-004', name: 'Suryo Putro', total_transactions: 3, total_amount: 12000000 },
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MOCK_SPENDING_HISTORY = [
  { month: 'Des', spending: 18000000, orders_count: 4 },
  { month: 'Jan', spending: 22000000, orders_count: 5 },
  { month: 'Feb', spending: 15000000, orders_count: 3 },
  { month: 'Mar', spending: 28000000, orders_count: 6 },
  { month: 'Apr', spending: 31000000, orders_count: 7 },
  { month: 'Mei', spending: 34500000, orders_count: 8 },
];

const MOCK_CATEGORY_DATA = [
  { name: 'Biji-bijian', value: 45000000 },
  { name: 'Sayuran', value: 32000000 },
  { name: 'Rempah', value: 28000000 },
  { name: 'Umbi-umbian', value: 20000000 },
];

const COLORS = ['#16a34a', '#3b82f6', '#8b5cf6', '#f59e0b'];

export default function DistributorAnalyticsPage() {
  const user = getStoredAuthUser();

  // Fetch analytics
  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
  } = useQuery({
    queryKey: ['distributor-deep-analytics', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Unauthenticated');
      return await distributorService.getAnalytics(user.id);
    },
    enabled: !!user?.id,
  });

  const {
    data: spendingHistory,
    isLoading: isSpendingLoading,
    isError: isChartError,
  } = useQuery({
    queryKey: ['distributor-deep-spending-history', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Unauthenticated');
      return await distributorService.getSpendingChart(user.id);
    },
    enabled: !!user?.id,
  });

  const isQueryError = isAnalyticsError || isChartError;
  const isLoading = (isAnalyticsLoading || isSpendingLoading) && !isQueryError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Koneksi ke server terputus. Gagal memuat data teraktual.');
    }
  }, [isQueryError]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-80 md:col-span-2" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  const activeAnalytics = analytics || {
    total_spending: 0,
    monthly_spending: 0,
    spending_change_percent: 0,
    active_orders: 0,
    total_orders: 0,
    unique_suppliers: 0,
    unique_products_bought: 0,
    avg_order_value: 0,
    top_products: [],
    top_suppliers: [],
  };
  const activeHistory = spendingHistory || [];

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Tren & Analisis Bisnis B2B
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Pantau grafik belanja modal bulanan, kontribusi supplier petani lokal, dan pembagian
          kategori persediaan produk.
        </p>
      </div>

      {/* Stats summary panel (Standardised) */}
      {isAnalyticsError ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat data statistik B2B / Koneksi ke server terputus
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {/* Stat 1 */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Pengadaan Modal
              </CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                title={formatCurrency(activeAnalytics.total_spending)}
              >
                {formatCurrency(activeAnalytics.total_spending)}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <TrendingUp className="size-4 shrink-0 text-emerald-500" />
                <span className="truncate text-muted-foreground">Jumlah modal belanja selesai</span>
              </div>
            </CardFooter>
          </Card>

          {/* Stat 2 */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Komoditas Dibeli
              </CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                title={`${activeAnalytics.unique_products_bought} Jenis`}
              >
                {activeAnalytics.unique_products_bought} Jenis
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <Layers className="size-4 shrink-0 text-blue-500" />
                <span className="truncate text-muted-foreground">Total variasi produk tani</span>
              </div>
            </CardFooter>
          </Card>

          {/* Stat 3 */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Petani Supplier
              </CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                title={`${activeAnalytics.unique_suppliers} Petani`}
              >
                {activeAnalytics.unique_suppliers} Petani
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <Award className="size-4 shrink-0 text-purple-500" />
                <span className="truncate text-muted-foreground">
                  Petani mitra terhubung langsung
                </span>
              </div>
            </CardFooter>
          </Card>

          {/* Stat 4 */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Rata-rata Order
              </CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                title={formatCurrency(activeAnalytics.avg_order_value)}
              >
                {formatCurrency(activeAnalytics.avg_order_value)}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <BarChart3 className="size-4 shrink-0 text-amber-500" />
                <span className="truncate text-muted-foreground">
                  Rata-rata nominal per checkout
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Main Analysis Chart Panel */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Line Chart: monthly spending */}
        <Card className="border-slate-200 shadow-sm bg-white md:col-span-2">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-sm font-bold text-slate-800">
              Tren Belanja Grosir Bulanan
            </CardTitle>
            <CardDescription className="text-xs">
              Representasi linear modal pengadaan barang tani bulanan.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {isChartError ? (
              <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                Gagal memuat tren belanja / Koneksi ke server terputus
              </div>
            ) : (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={activeHistory}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{
                        background: '#0f172a',
                        borderRadius: '8px',
                        color: '#fff',
                        fontSize: '11px',
                        border: 'none',
                      }}
                      formatter={(value) => [formatCurrency(Number(value)), 'Total Belanja']}
                    />
                    <Line
                      type="monotone"
                      dataKey="spending"
                      stroke="#16a34a"
                      strokeWidth={3}
                      dot={{ fill: '#16a34a', r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart: Category distribution */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-sm font-bold text-slate-800">
              Pembagian Kategori Persediaan
            </CardTitle>
            <CardDescription className="text-xs">
              Proporsi belanja modal tani berdasarkan jenis kategori produk.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex flex-col items-center justify-center">
            {isAnalyticsError ? (
              <div className="flex h-52 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm w-full">
                Gagal memuat kategori persediaan / Koneksi ke server terputus
              </div>
            ) : (
              <>
                <div className="h-52 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={MOCK_CATEGORY_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {MOCK_CATEGORY_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Custom Legend labels */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 justify-center mt-3 text-xs font-semibold text-slate-500">
                  {MOCK_CATEGORY_DATA.map((entry, index) => (
                    <div key={entry.name} className="flex items-center gap-1.5">
                      <span
                        className="h-3 w-3 rounded-full shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Horizontal Bar Chart: Supplier Contribution */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-2 border-b border-slate-50">
          <CardTitle className="text-sm font-bold text-slate-800">
            Analisis Kontribusi Supplier Petani Mitra
          </CardTitle>
          <CardDescription className="text-xs">
            Rincian nominal akumulasi pembelian grosir berdasarkan masing-masing mitra tani.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {isAnalyticsError ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
              Gagal memuat kontribusi supplier / Koneksi ke server terputus
            </div>
          ) : (
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={activeAnalytics.top_suppliers}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                  <XAxis
                    type="number"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#94a3b8"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#0f172a',
                      borderRadius: '8px',
                      color: '#fff',
                      fontSize: '11px',
                      border: 'none',
                    }}
                    formatter={(value) => [formatCurrency(Number(value)), 'Kontribusi Belanja']}
                  />
                  <Bar
                    dataKey="total_amount"
                    fill="#3b82f6"
                    radius={[0, 6, 6, 0]}
                    maxBarSize={30}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
