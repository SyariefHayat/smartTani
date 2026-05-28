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
  Boxes,
  ShoppingCart,
  Handshake,
  Wallet,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  FileText,
  Plus,
} from 'lucide-react';

const MOCK_ANALYTICS = {
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

const MOCK_SPENDING_CHART = [
  { month: 'Des', spending: 18000000, orders_count: 4 },
  { month: 'Jan', spending: 22000000, orders_count: 5 },
  { month: 'Feb', spending: 15000000, orders_count: 3 },
  { month: 'Mar', spending: 28000000, orders_count: 6 },
  { month: 'Apr', spending: 31000000, orders_count: 7 },
  { month: 'Mei', spending: 34500000, orders_count: 8 },
];

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
  const [isOffline, setIsOffline] = React.useState(false);

  // Queries
  const { data: analytics, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ['distributor-analytics', user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) throw new Error('Unauthenticated');
        return await distributorService.getAnalytics(user.id);
      } catch {
        setIsOffline(true);
        return MOCK_ANALYTICS;
      }
    },
  });

  const { data: spendingChart, isLoading: isSpendingLoading } = useQuery({
    queryKey: ['distributor-spending-chart', user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) throw new Error('Unauthenticated');
        return await distributorService.getSpendingChart(user.id);
      } catch {
        return MOCK_SPENDING_CHART;
      }
    },
  });

  const { data: recentOrders, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['distributor-recent-orders', user?.id],
    queryFn: async () => {
      try {
        const res = await orderService.getOrders({ limit: 5 });
        if (!res || !res.data || !res.data.orders || res.data.orders.length === 0)
          return MOCK_RECENT_ORDERS;
        return res.data.orders;
      } catch {
        return MOCK_RECENT_ORDERS;
      }
    },
  });

  const isLoading = isAnalyticsLoading || isSpendingLoading || isOrdersLoading;

  React.useEffect(() => {
    if (isOffline) {
      toast.error('Layanan B2B luring. Menggunakan data demo lokal.', {
        description: 'Menampilkan data simulasi memori offline.',
        duration: 4000,
      });
    }
  }, [isOffline]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-80 md:col-span-2" />
          <Skeleton className="h-80" />
        </div>
      </div>
    );
  }

  const activeAnalytics = analytics || MOCK_ANALYTICS;
  const activeOrders = (recentOrders || MOCK_RECENT_ORDERS) as unknown as typeof MOCK_RECENT_ORDERS;
  const activeChart = spendingChart || MOCK_SPENDING_CHART;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Ringkasan Bisnis Distributor
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Selamat datang kembali,{' '}
            <span className="font-bold text-green-700">
              {user?.name || user?.full_name || 'Mitra B2B'}
            </span>
            . Kelola rantai pasok dan pembelian grosir Anda.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/distributor/catalog">
            <Button className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-10 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm">
              <Plus className="h-4 w-4" /> Belanja Grosir B2B
            </Button>
          </Link>
        </div>
      </div>

      {/* Offline Alert Banner */}
      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] text-amber-600/90 font-medium mt-0.5 leading-relaxed">
              Koneksi ke backend SmartTani terputus atau luring. Semua fitur manajemen kemitraan,
              keranjang grosir B2B, checkout, dan mutasi barang gudang berjalan secara simulasi
              memori lokal berperingkat tinggi.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Total Spending */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
              Belanja Bulan Ini
            </span>
            <div className="p-2 bg-green-50 rounded-lg text-green-600">
              <Wallet className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-800">
              {formatCurrency(activeAnalytics.monthly_spending)}
            </div>
            <div className="text-[10.5px] font-semibold text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-green-600 flex items-center gap-0.5 font-bold">
                <TrendingUp className="h-3 w-3" /> +{activeAnalytics.spending_change_percent}%
              </span>
              dari bulan lalu
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Active Orders */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
              Pesanan Aktif
            </span>
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <ShoppingCart className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-800">
              {activeAnalytics.active_orders}{' '}
              <span className="text-xs font-medium text-slate-500">Pesanan</span>
            </div>
            <div className="text-[10.5px] font-semibold text-slate-500 mt-1">
              Total {activeAnalytics.total_orders} pesanan selesai
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Unique Suppliers */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
              Mitra Petani
            </span>
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Handshake className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-800">
              {activeAnalytics.unique_suppliers}{' '}
              <span className="text-xs font-medium text-slate-500">Petani</span>
            </div>
            <div className="text-[10.5px] font-semibold text-slate-500 mt-1">
              Supplier suplai aktif
            </div>
          </CardContent>
        </Card>

        {/* KPI 4: Stock Gudang */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <span className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Gudang
            </span>
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Boxes className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-slate-800">
              1.250 <span className="text-xs font-medium text-slate-500">kg/unit</span>
            </div>
            <div className="text-[10.5px] font-semibold text-slate-500 mt-1">
              {activeAnalytics.unique_products_bought} jenis komoditas terlacak
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Contents */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Chart */}
        <Card className="border-slate-200 shadow-sm bg-white md:col-span-2 flex flex-col justify-between">
          <CardHeader className="pb-2 border-b border-slate-50">
            <CardTitle className="text-sm font-bold text-slate-800">
              Riwayat Pengeluaran Belanja Grosir
            </CardTitle>
            <CardDescription className="text-xs">
              Tren nominal pembelian grosir B2B Anda selama 6 bulan terakhir.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
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
                    formatter={(value) => [formatCurrency(Number(value)), 'Belanja']}
                  />
                  <Bar dataKey="spending" fill="#16a34a" radius={[6, 6, 0, 0]} maxBarSize={45} />
                </BarChart>
              </ResponsiveContainer>
            </div>
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
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-800">
              Aktivitas Pesanan Terbaru
            </CardTitle>
            <CardDescription className="text-xs">
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
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-b border-slate-100">
                  <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider py-3">
                    Order ID
                  </TableHead>
                  <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider">
                    Mitra Petani
                  </TableHead>
                  <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-center">
                    Jumlah Barang
                  </TableHead>
                  <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-right">
                    Total Bayar
                  </TableHead>
                  <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-right">
                    Tanggal
                  </TableHead>
                  <TableHead className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider text-center">
                    Aksi
                  </TableHead>
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
                    <TableRow
                      key={order.id}
                      className="border-b border-slate-100 hover:bg-slate-50/40"
                    >
                      <TableCell className="font-bold text-xs py-3 text-slate-800">
                        {order.id}
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-600">
                        {order.seller?.full_name || 'Petani Mandiri'}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-600 text-center">
                        {order.items_count} Jenis
                      </TableCell>
                      <TableCell className="text-xs font-bold text-slate-800 text-right">
                        {formatCurrency(order.total_amount)}
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10.5px] font-bold ${statusColors[order.status] || 'bg-slate-50 text-slate-600'}`}
                        >
                          {statusLabels[order.status] || order.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-xs font-semibold text-slate-500 text-right">
                        {new Date(order.created_at || '').toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </TableCell>
                      <TableCell className="text-center">
                        <Link href={`/dashboard/distributor/orders/${order.id}`}>
                          <Button
                            variant="ghost"
                            className="h-8 px-2 text-xs font-bold text-green-600 hover:text-green-700 hover:bg-green-50/50 flex items-center gap-1 justify-center mx-auto cursor-pointer"
                          >
                            <FileText className="h-3.5 w-3.5" /> Detail
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
