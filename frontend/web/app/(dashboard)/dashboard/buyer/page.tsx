'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { analyticsService, BuyerAnalytics } from '@/services/analytics';
import { orderService } from '@/services/order';
import { formatCurrency, cn } from '@/lib/utils';
import { toast } from 'sonner';
import { subDays, format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DateRangeContext } from '@/context/dateRange';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Download,
  AlertTriangle,
  RefreshCw,
  Eye,
  ArrowRight,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { DatePickerWithRange } from '@/components/sections/dashboard/farmer/DatePickerRange';
import { exportToCSV } from '@/lib/export-csv';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

const chartConfig = {
  spending: {
    label: 'Total Belanja',
    color: '#16a34a',
  },
} satisfies ChartConfig;

// High-fidelity fallback simulated data if backend analytics service is offline
const MOCK_BUYER_ANALYTICS: BuyerAnalytics = {
  total_spending: 18450000,
  active_orders: 2,
  total_products_bought: 14,
  total_reviews_given: 6,
  monthly_spending: 4200000,
  spending_change_percent: 12.4,
  top_products: [
    {
      product_id: 'P-01',
      title: 'Cabai Merah Keriting A',
      image: '/images/products/chili.jpg',
      buy_count: 5,
    },
    {
      product_id: 'P-02',
      title: 'Pupuk Organik Bio-Tani',
      image: '/images/products/fertilizer.jpg',
      buy_count: 3,
    },
    {
      product_id: 'P-03',
      title: 'Bibit Tomat Unggul',
      image: '/images/products/tomato.jpg',
      buy_count: 2,
    },
  ],
};

const MOCK_SPENDING_CHART = [
  { date: '2026-05-21', spending: 1200000, orders_count: 1 },
  { date: '2026-05-22', spending: 2500000, orders_count: 2 },
  { date: '2026-05-23', spending: 0, orders_count: 0 },
  { date: '2026-05-24', spending: 4500000, orders_count: 1 },
  { date: '2026-05-25', spending: 850000, orders_count: 1 },
  { date: '2026-05-26', spending: 3100000, orders_count: 2 },
  { date: '2026-05-27', spending: 1500000, orders_count: 1 },
];

const MOCK_RECENT_ORDERS = [
  {
    id: 'ORD-88192',
    created_at: '2026-05-27T10:00:00Z',
    total_amount: 1500000,
    status: 'shipped',
    items: [{ product: { title: 'Cabai Merah Keriting' }, quantity: 60 }],
  },
  {
    id: 'ORD-88151',
    created_at: '2026-05-26T14:30:00Z',
    total_amount: 2100000,
    status: 'completed',
    items: [{ product: { title: 'Pupuk Organik Bio-Tani' }, quantity: 70 }],
  },
  {
    id: 'ORD-88092',
    created_at: '2026-05-24T08:15:00Z',
    total_amount: 4500000,
    status: 'completed',
    items: [{ product: { title: 'Alat Semprot Hama' }, quantity: 15 }],
  },
  {
    id: 'ORD-87910',
    created_at: '2026-05-22T16:00:00Z',
    total_amount: 1800000,
    status: 'completed',
    items: [{ product: { title: 'Bibit Tomat Unggul' }, quantity: 150 }],
  },
];

export default function BuyerDashboardOverview() {
  const router = useRouter();
  const [user] = React.useState(() => getStoredAuthUser());

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  // Guard role
  React.useEffect(() => {
    if (!user) {
      router.push('/login?redirect=/dashboard/buyer');
      return;
    }
    if (user.role !== 'buyer') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // 1. Fetch Analytics Overview
  const {
    data: analyticsData,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    refetch: refetchAnalytics,
    isRefetching: isRefetchingAnalytics,
  } = useQuery({
    queryKey: ['buyer-analytics', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return analyticsService.getBuyerAnalytics(user.id);
    },
    enabled: !!user?.id,
  });

  // 2. Fetch Spending Chart
  const {
    data: chartData,
    isLoading: isChartLoading,
    isError: isChartError,
    refetch: refetchChart,
    isRefetching: isRefetchingChart,
  } = useQuery({
    queryKey: ['buyer-spending-chart', user?.id, date?.from, date?.to],
    queryFn: async () => {
      if (!user?.id) return null;
      return analyticsService.getBuyerSpendingChart(user.id, {
        from_date: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
        to_date: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
      });
    },
    enabled: !!user?.id,
  });

  // 3. Fetch Recent Orders
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
    isRefetching: isRefetchingOrders,
  } = useQuery({
    queryKey: ['buyer-recent-orders', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return orderService.getOrders({ limit: 5 });
    },
    enabled: !!user?.id,
  });

  const isQueryError = isAnalyticsError || isChartError || isOrdersError;
  const isRefetching = isRefetchingAnalytics || isRefetchingChart || isRefetchingOrders;

  // Fallback to local demo data automatically on error
  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan dashboard offline. Menggunakan data demo lokal.', {
        description: 'Menampilkan data simulasi belanja agar Anda tetap dapat menjelajahi layout.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const activeAnalytics = isQueryError
    ? MOCK_BUYER_ANALYTICS
    : analyticsData || MOCK_BUYER_ANALYTICS;
  const activeChart = isQueryError ? MOCK_SPENDING_CHART : chartData || MOCK_SPENDING_CHART;
  const activeOrders = isQueryError
    ? MOCK_RECENT_ORDERS
    : ordersData?.data?.orders || MOCK_RECENT_ORDERS;

  const handleRetry = () => {
    refetchAnalytics();
    refetchChart();
    refetchOrders();
  };

  const handleDownload = React.useCallback(() => {
    if (!activeAnalytics) {
      toast.error('Data belum tersedia, coba lagi nanti');
      return;
    }

    try {
      const summaryData = [
        { metrik: 'Total Belanja', nilai: formatCurrency(activeAnalytics.total_spending || 0) },
        { metrik: 'Pesanan Aktif', nilai: `${activeAnalytics.active_orders || 0} Transaksi` },
        {
          metrik: 'Total Produk Dibeli',
          nilai: `${activeAnalytics.total_products_bought || 0} Unit`,
        },
        {
          metrik: 'Total Ulasan Diberikan',
          nilai: `${activeAnalytics.total_reviews_given || 0} Ulasan`,
        },
        {
          metrik: 'Belanja Bulan Ini',
          nilai: formatCurrency(activeAnalytics.monthly_spending || 0),
        },
        {
          metrik: 'Perubahan Belanja',
          nilai: `${(activeAnalytics.spending_change_percent || 0).toFixed(1)}%`,
        },
      ];

      exportToCSV({
        data: summaryData,
        columns: [
          { header: 'Metrik', accessor: (row) => row.metrik },
          { header: 'Nilai', accessor: (row) => row.nilai },
        ],
        filename: 'dashboard_pembeli_ringkasan',
      });

      toast.success('Laporan dashboard berhasil diunduh');
    } catch {
      toast.error('Gagal mengunduh laporan');
    }
  }, [activeAnalytics]);

  const isLoading = (isAnalyticsLoading || isChartLoading || isOrdersLoading) && !isQueryError;

  if (!user || user.role !== 'buyer') return null;

  const spendingChange = activeAnalytics.spending_change_percent || 0;

  const kpis = [
    {
      title: 'Total Belanja',
      value: formatCurrency(activeAnalytics.total_spending || 0),
      hasCompare: true,
      change: spendingChange,
      footer: 'dari bulan lalu',
    },
    {
      title: 'Total Pesanan',
      value: (activeAnalytics.active_orders || 0).toLocaleString('id-ID'),
      hasCompare: false,
      change: 0,
      footer: 'dari bulan lalu',
    },
    {
      title: 'Total Produk',
      value: (activeAnalytics.total_products_bought || 0).toLocaleString('id-ID'),
      hasCompare: false,
      change: 0,
      footer: 'dari bulan lalu',
    },
    {
      title: 'Total Ulasan',
      value: (activeAnalytics.total_reviews_given || 0).toLocaleString('id-ID'),
      hasCompare: false,
      change: 0,
      footer: 'dari bulan lalu',
    },
  ] as const;

  return (
    <DateRangeContext.Provider value={{ date, setDate }}>
      {/* Offline Warning Banner */}
      {isQueryError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 animate-pulse" />
            <p>
              Layanan Analytics Offline: Gagal memuat data teraktual. Menggunakan data demo lokal.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 cursor-pointer border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold shrink-0 text-[10px]"
            onClick={handleRetry}
            disabled={isRefetching}
          >
            <RefreshCw className={`mr-1 h-3 w-3 ${isRefetching ? 'animate-spin' : ''}`} />
            {isRefetching ? 'Hubungkan...' : 'Coba Hubungkan Kembali'}
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Dashboard Pembeli</h1>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <DatePickerWithRange />
          <Button className="w-full sm:w-auto cursor-pointer" onClick={handleDownload}>
            <Download /> Download
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="min-w-0">
              <CardHeader className="gap-1">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <Skeleton className="h-4 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {kpis.map((kpi, index) => {
            const hasCompare = kpi.hasCompare;
            const isUp = kpi.change > 0;
            const isDown = kpi.change < 0;

            let colorClass = 'text-muted-foreground';
            let Icon = null;
            let percentageText = '0.0%';

            if (hasCompare) {
              colorClass = isUp
                ? 'text-green-500'
                : isDown
                  ? 'text-red-500'
                  : 'text-muted-foreground';
              Icon = isUp ? ArrowUp : isDown ? ArrowDown : null;
              percentageText = `${Math.abs(kpi.change).toFixed(1)}%`;
            }

            return (
              <Card key={index} className="min-w-0">
                <CardHeader className="gap-1">
                  <CardDescription className="truncate text-xs">{kpi.title}</CardDescription>
                  <CardTitle
                    className="truncate text-xl font-semibold tabular-nums lg:text-2xl"
                    title={kpi.value}
                  >
                    {kpi.value}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                    {Icon && <Icon className={`size-4 shrink-0 ${colorClass}`} />}
                    <span className="truncate">
                      <span className={colorClass}>{percentageText} </span>
                      <span className="text-muted-foreground">{kpi.footer}</span>
                    </span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Chart Column */}
      {isLoading ? (
        <Skeleton className="h-[350px] w-full rounded-xl" />
      ) : (
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-base font-bold text-slate-800">
                  Tren Pengeluaran Belanja
                </CardTitle>
                <CardDescription className="text-xs">
                  Grafik total belanja harian Anda.
                </CardDescription>
              </div>
              <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">
                {activeAnalytics.spending_change_percent >= 0 ? '+' : ''}
                {activeAnalytics.spending_change_percent}% dibanding bln lalu
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
                <BarChart
                  accessibilityLayer
                  data={activeChart}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                    tickFormatter={(v) =>
                      new Date(v).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                    }
                  />
                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(value) => {
                          return new Date(value).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          });
                        }}
                        formatter={(value, name, item) => (
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-1.5">
                              <span className="h-2.5 w-2.5 rounded-full bg-green-600 shrink-0" />
                              <span className="text-[10px] text-muted-foreground uppercase font-semibold">
                                Total Belanja
                              </span>
                            </div>
                            <span className="text-sm font-bold text-slate-800">
                              {formatCurrency(value as number)}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                              {item.payload.orders_count} Pesanan
                            </span>
                          </div>
                        )}
                      />
                    }
                  />
                  <Bar dataKey="spending" fill="var(--color-spending)" radius={8} barSize={28} />
                </BarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lower Row */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (60%): Recent Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold text-slate-800">Pesanan Terbaru</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-slate-500 font-semibold flex items-center gap-1 hover:text-green-600"
              onClick={() => router.push('/dashboard/buyer/orders')}
            >
              Semua Pesanan <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ) : (
            <div className="space-y-3">
              {(activeOrders as unknown[]).map((rawOrder) => {
                const order = rawOrder as (typeof MOCK_RECENT_ORDERS)[0];
                const productTitle = order.items?.[0]?.product?.title || 'Produk Kategori Tani';
                const isCompleted = order.status === 'completed';
                const isShipped = order.status === 'shipped';
                return (
                  <Card
                    key={order.id}
                    className="border border-slate-200 bg-white hover:bg-slate-50/50 transition-colors shadow-xs"
                  >
                    <CardContent className="p-4 flex items-center justify-between gap-4">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-slate-500 font-semibold">
                            #{order.id}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                              isCompleted
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isShipped
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}
                          >
                            <span
                              className={`h-1 w-1 rounded-full ${isCompleted ? 'bg-emerald-500 animate-pulse' : isShipped ? 'bg-blue-500' : 'bg-amber-500'}`}
                            />
                            {isCompleted ? 'Selesai' : isShipped ? 'Dikirim' : 'Menunggu'}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-slate-800 truncate max-w-xs sm:max-w-sm">
                          {productTitle}{' '}
                          {order.items?.length > 1 ? `(+${order.items.length - 1} lainnya)` : ''}
                        </h4>
                        <p className="text-xs text-slate-400">
                          {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm')}
                        </p>
                      </div>
                      <div className="text-right space-y-1">
                        <p className="text-sm font-bold text-slate-800">
                          {formatCurrency(order.total_amount)}
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 cursor-pointer"
                          onClick={() => router.push(`/dashboard/buyer/orders/${order.id}`)}
                        >
                          <Eye className="mr-1 h-3.5 w-3.5" /> Detail
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column (40%): Top Products */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">Sering Dibeli</h2>
          {isLoading ? (
            <Skeleton className="h-[250px] w-full rounded-xl" />
          ) : (
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-bold">Rekomendasi Restok</CardTitle>
                <CardDescription className="text-xs">
                  Produk terlaris berdasarkan frekuensi pembelian Anda.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {activeAnalytics.top_products?.map((prod) => (
                    <div
                      key={prod.product_id}
                      className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600 shrink-0 font-bold text-xs uppercase">
                          {prod.title.slice(0, 2)}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-800 line-clamp-1">
                            {prod.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            Dipesan {prod.buy_count} kali
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 cursor-pointer"
                        onClick={() => router.push(`/marketplace/${prod.product_id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DateRangeContext.Provider>
  );
}
