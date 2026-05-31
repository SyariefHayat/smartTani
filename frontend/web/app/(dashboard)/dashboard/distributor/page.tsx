'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { distributorService } from '@/services/distributor';
import { orderService } from '@/services/order';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartContainer, ChartTooltip, type ChartConfig } from '@/components/ui/chart';
import { Boxes, ShoppingCart, Handshake, Wallet, ArrowRight, Plus } from 'lucide-react';

const chartConfig = {
  spending: {
    label: 'Belanja Grosir',
    color: '#16a34a',
  },
} satisfies ChartConfig;

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string | number;
    name: string;
    [key: string]: unknown;
  }>;
  label?: string | number;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-100 bg-white/95 p-3 shadow-lg backdrop-blur-md min-w-48 text-slate-800">
        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase border-b pb-1.5 border-slate-100">
          Bulan {label}
        </p>
        <div className="space-y-2 mt-2.5">
          {payload.map((item, index) => (
            <div key={index} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-slate-500 font-medium">{item.name}</span>
              </div>
              <span className="text-xs font-bold text-slate-900">
                {formatCurrency(Number(item.value))}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _MOCK_ANALYTICS = {
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
  ],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _MOCK_SPENDING_CHART = [
  { month: 'Des', spending: 18000000, orders_count: 4 },
  { month: 'Jan', spending: 22000000, orders_count: 5 },
  { month: 'Feb', spending: 15000000, orders_count: 3 },
  { month: 'Mar', spending: 28000000, orders_count: 6 },
  { month: 'Apr', spending: 31000000, orders_count: 7 },
  { month: 'Mei', spending: 34500000, orders_count: 8 },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MOCK_RECENT_ORDERS = [
  {
    id: 'ORD-98822',
    total_amount: 14500000,
    created_at: '2026-05-27T08:00:00Z',
    status: 'shipped',
    seller: { full_name: 'Budi Santoso' },
    items_count: 3,
  },
  {
    id: 'ORD-98815',
    total_amount: 8500000,
    created_at: '2026-05-25T14:30:00Z',
    status: 'paid',
    seller: { full_name: 'Siti Aminah' },
    items_count: 2,
  },
  {
    id: 'ORD-98790',
    total_amount: 11200000,
    created_at: '2026-05-20T10:00:00Z',
    status: 'completed',
    seller: { full_name: 'Agus Salim' },
    items_count: 4,
  },
  {
    id: 'ORD-98755',
    total_amount: 6000000,
    created_at: '2026-05-18T16:00:00Z',
    status: 'completed',
    seller: { full_name: 'Budi Santoso' },
    items_count: 1,
  },
  {
    id: 'ORD-98710',
    total_amount: 9300000,
    created_at: '2026-05-12T09:00:00Z',
    status: 'cancelled',
    seller: { full_name: 'Rina Buyer' },
    items_count: 2,
  },
];

export default function DistributorOverviewPage() {
  const user = getStoredAuthUser();

  // Queries
  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
  } = useQuery({
    queryKey: ['distributor-analytics', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Unauthenticated');
      return await distributorService.getAnalytics(user.id);
    },
    enabled: !!user?.id,
  });

  const {
    data: spendingChart,
    isLoading: isSpendingLoading,
    isError: isChartError,
  } = useQuery({
    queryKey: ['distributor-spending-chart', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Unauthenticated');
      return await distributorService.getSpendingChart(user.id);
    },
    enabled: !!user?.id,
  });

  const {
    data: recentOrders,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
  } = useQuery({
    queryKey: ['distributor-recent-orders', user?.id],
    queryFn: async (): Promise<Record<string, unknown>[]> => {
      const res = await orderService.getOrders({ limit: 5 });
      if (!res || !res.data || !res.data.orders) {
        throw new Error('Gagal memuat pesanan');
      }
      return res.data.orders as unknown as Record<string, unknown>[];
    },
    enabled: !!user?.id,
  });

  const isQueryError = isAnalyticsError || isChartError || isOrdersError;
  const isLoading = (isAnalyticsLoading || isSpendingLoading || isOrdersLoading) && !isQueryError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Koneksi ke server terputus. Gagal memuat data teraktual.');
    }
  }, [isQueryError]);

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="min-w-0">
              <CardHeader className="gap-1 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-full" />
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm mt-1.5 pt-0">
                <Skeleton className="h-4 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
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
    top_products: [],
  };
  const activeOrders = (recentOrders || []) as unknown as typeof MOCK_RECENT_ORDERS;
  const activeChart = spendingChart || [];

  const spendingChange = activeAnalytics.spending_change_percent || 0;

  const kpis = [
    {
      title: 'Belanja Bulan Ini',
      value: formatCurrency(activeAnalytics.monthly_spending),
      footer: `+${spendingChange.toFixed(1)}% dari bulan lalu`,
      icon: Wallet,
      iconColorClass: 'text-emerald-500',
    },
    {
      title: 'Pesanan Aktif',
      value: `${activeAnalytics.active_orders} Pesanan`,
      footer: `Total ${activeAnalytics.total_orders} pesanan selesai`,
      icon: ShoppingCart,
      iconColorClass: 'text-blue-500',
    },
    {
      title: 'Mitra Petani',
      value: `${activeAnalytics.unique_suppliers} Petani`,
      footer: 'Supplier suplai aktif',
      icon: Handshake,
      iconColorClass: 'text-purple-500',
    },
    {
      title: 'Total Gudang',
      value: '1.250 kg',
      footer: `${activeAnalytics.unique_products_bought} jenis komoditas`,
      icon: Boxes,
      iconColorClass: 'text-amber-500',
    },
  ] as const;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-900">
            Ringkasan Bisnis Distributor
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Selamat datang kembali,{' '}
            <span className="font-bold text-green-700">
              {user?.name || user?.full_name || 'Mitra B2B'}
            </span>
            . Kelola rantai pasok dan pembelian grosir Anda.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
          <Link href="/dashboard/distributor/catalog" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto cursor-pointer">
              <Plus className="mr-2 h-4 w-4" /> Belanja Grosir B2B
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid (Sesuai Gaya Investor/Farmer Overview) */}
      {isAnalyticsError ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat data statistik B2B / Koneksi ke server terputus
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {kpis.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="min-w-0">
                <CardHeader className="gap-1">
                  <CardDescription className="truncate text-xs">{card.title}</CardDescription>
                  <CardTitle
                    className="truncate text-xl font-semibold tabular-nums lg:text-2xl"
                    title={card.value}
                  >
                    {card.value}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                    <Icon className={`size-4 shrink-0 ${card.iconColorClass}`} />
                    <span className="truncate text-muted-foreground">{card.footer}</span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Main Contents */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Chart */}
        <Card className="w-full overflow-hidden md:col-span-2 flex flex-col justify-between">
          <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row border-slate-100">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
              <CardTitle className="font-semibold text-base text-slate-800">
                Riwayat Pengeluaran Belanja Grosir
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Tren nominal pembelian grosir B2B Anda selama 6 bulan terakhir.
              </CardDescription>
            </div>
            <div className="flex border-t border-slate-100 sm:border-t-0 sm:border-l">
              <div className="relative z-30 flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left bg-slate-50/50 sm:px-8 sm:py-6 min-w-56">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Total Belanja B2B
                </span>
                <span className="text-base leading-none font-bold sm:text-2xl mt-1 text-slate-800">
                  {formatCurrency(activeAnalytics.total_spending || 0)}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {isChartError ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                Gagal memuat grafik pengeluaran / Koneksi ke server terputus
              </div>
            ) : (
              <div className="h-64 w-full">
                <ChartContainer config={chartConfig} className="h-full w-full aspect-auto">
                  <BarChart data={activeChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis
                      dataKey="month"
                      stroke="#94a3b8"
                      fontSize={11}
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis hide />
                    <ChartTooltip content={<CustomTooltip />} />
                    <Bar
                      dataKey="spending"
                      name={chartConfig.spending.label}
                      fill="var(--color-spending)"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={45}
                    />
                  </BarChart>
                </ChartContainer>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Side: Popular B2B Products */}
        <Card className="border-slate-200 shadow-sm bg-white">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-sm font-bold text-slate-800">Komoditas Terpopuler</CardTitle>
            <CardDescription className="text-xs">
              Produk grosir tani yang paling sering Anda order.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 divide-y divide-slate-100">
            {activeAnalytics.top_products.map((prod, index) => (
              <div
                key={prod.product_id}
                className="py-3.5 flex items-center justify-between first:pt-0 last:pb-0"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50 text-xs font-bold text-green-600">
                    {index + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{prod.title}</h4>
                    <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                      {prod.buy_count} kali dipesan
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                    {prod.total_qty} kg
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-1">
            <CardTitle className="text-base font-bold text-slate-800">
              Aktivitas Pesanan Terbaru
            </CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Daftar transaksi grosir tani yang baru-baru ini diproses.
            </CardDescription>
          </div>
          <Link
            href="/dashboard/distributor/orders"
            className="text-xs font-bold text-green-600 hover:text-green-700 flex items-center gap-1.5"
          >
            Semua Pesanan <ArrowRight className="h-4 w-4" />
          </Link>
        </CardHeader>
        <CardContent>
          {isOrdersError ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
              Gagal memuat data aktivitas pesanan terbaru / Koneksi ke server terputus
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-25">Order ID</TableHead>
                      <TableHead>Mitra Petani</TableHead>
                      <TableHead className="text-center">Jumlah Barang</TableHead>
                      <TableHead className="text-right">Total Bayar</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-right">Tanggal</TableHead>
                      <TableHead className="text-right"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activeOrders.map((order: (typeof MOCK_RECENT_ORDERS)[number]) => {
                      const statusColors: Record<string, string> = {
                        pending_payment: 'bg-amber-50 text-amber-700 border-amber-200/50',
                        paid: 'bg-blue-50 text-blue-700 border-blue-200/50',
                        confirmed: 'bg-purple-50 text-purple-700 border-purple-200/50',
                        shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
                        completed: 'bg-green-50 text-green-700 border-green-200/50',
                        cancelled: 'bg-rose-50 text-rose-700 border-rose-200/50',
                      };

                      const statusLabels: Record<string, string> = {
                        pending_payment: 'Menunggu Bayar',
                        paid: 'Dibayar',
                        confirmed: 'Dikonfirmasi',
                        shipped: 'Dikirim',
                        completed: 'Selesai',
                        cancelled: 'Batal',
                      };

                      return (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium text-xs">
                            <span className="font-mono text-xs font-bold text-slate-500">
                              {order.id}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-slate-700">
                            {order.seller?.full_name || 'Petani Mandiri'}
                          </TableCell>
                          <TableCell className="text-center text-xs font-medium text-slate-600">
                            {order.items_count} Jenis
                          </TableCell>
                          <TableCell className="text-right font-medium text-xs">
                            {formatCurrency(order.total_amount)}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10.5px] font-bold ${statusColors[order.status] || 'bg-slate-50 text-slate-600'}`}
                            >
                              {statusLabels[order.status] || order.status}
                            </span>
                          </TableCell>
                          <TableCell className="text-right text-xs text-slate-500">
                            {new Date(order.created_at || '').toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </TableCell>
                          <TableCell className="text-right">
                            <Link href={`/dashboard/distributor/orders/${order.id}`}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 text-xs font-bold text-green-600 hover:text-green-700 hover:bg-green-50/50 cursor-pointer"
                              >
                                Detail
                              </Button>
                            </Link>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  Menampilkan 1-{activeOrders.length} dari {activeOrders.length} pesanan
                </div>
                <div className="space-x-2">
                  <Button variant="outline" size="sm" disabled={true} className="cursor-pointer">
                    Sebelumnya
                  </Button>
                  <Button variant="outline" size="sm" disabled={true} className="cursor-pointer">
                    Berikutnya
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
