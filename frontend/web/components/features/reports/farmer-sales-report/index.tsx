'use client';

import * as React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/auth';
import { analyticsService } from '@/services/analytics';
import { orderService } from '@/services/order';
import { toast } from 'sonner';
import { format, subDays } from 'date-fns';

import { SalesReportHeader } from './SalesReportHeader';
import { SalesReportStats } from './SalesReportStats';
import { SalesReportCharts } from './SalesReportCharts';
import { SalesReportTable } from './SalesReportTable';
import { columns } from './columns';
import { DailySalesData, SalesReportItem, SalesReportSummary } from './types';
import { DateRangeContext } from '@/context/dateRange';
import { DateRange } from 'react-day-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

// High-fidelity fallback simulated data if backend service is offline
const MOCK_ANALYTICS = {
  revenue_change_percent: 16.8,
};

const MOCK_REVENUE_CHART = [
  { date: '2026-05-21', pendapatan: 9000000, pengeluaran: 0 },
  { date: '2026-05-22', pendapatan: 9000000, pengeluaran: 0 },
  { date: '2026-05-23', pendapatan: 0, pengeluaran: 0 },
  { date: '2026-05-24', pendapatan: 5500000, pengeluaran: 0 },
  { date: '2026-05-25', pendapatan: 10500000, pengeluaran: 0 },
  { date: '2026-05-26', pendapatan: 6000000, pengeluaran: 0 },
  { date: '2026-05-27', pendapatan: 4500000, pengeluaran: 0 },
];

const MOCK_ORDERS = [
  {
    id: 'ORD-10922',
    created_at: '2026-05-27T10:00:00Z',
    buyer_id: 'BUY-7711',
    buyer: { full_name: 'Siti Aminah (Buyer Kelompok A)' },
    items: [{ product_id: 'PROD-8812', price_per_unit: 25000, quantity: 180 }],
    total_amount: 4500000,
    status: 'completed',
  },
  {
    id: 'ORD-10901',
    created_at: '2026-05-26T14:30:00Z',
    buyer_id: 'BUY-8812',
    buyer: { full_name: 'Agus Setiawan (Koperasi Tani)' },
    items: [{ product_id: 'PROD-7712', price_per_unit: 15000, quantity: 400 }],
    total_amount: 6000000,
    status: 'completed',
  },
  {
    id: 'ORD-10885',
    created_at: '2026-05-25T08:15:00Z',
    buyer_id: 'BUY-5501',
    buyer: { full_name: 'CV Segar Sentosa' },
    items: [{ product_id: 'PROD-9912', price_per_unit: 35000, quantity: 300 }],
    total_amount: 10500000,
    status: 'completed',
  },
  {
    id: 'ORD-10881',
    created_at: '2026-05-24T11:00:00Z',
    buyer_id: 'BUY-3392',
    buyer: { full_name: 'Pak Budi Wahyono' },
    items: [{ product_id: 'PROD-6611', price_per_unit: 22000, quantity: 250 }],
    total_amount: 5500000,
    status: 'completed',
  },
  {
    id: 'ORD-10850',
    created_at: '2026-05-23T09:30:00Z',
    buyer_id: 'BUY-2201',
    buyer: { full_name: 'Dewi Lestari' },
    items: [{ product_id: 'PROD-5501', price_per_unit: 12000, quantity: 100 }],
    total_amount: 1200000,
    status: 'cancelled',
  },
  {
    id: 'ORD-10812',
    created_at: '2026-05-22T16:45:00Z',
    buyer_id: 'BUY-9922',
    buyer: { full_name: 'Katering Berkah Jaya' },
    items: [{ product_id: 'PROD-4411', price_per_unit: 18000, quantity: 500 }],
    total_amount: 9000000,
    status: 'completed',
  },
  {
    id: 'ORD-10799',
    created_at: '2026-05-21T10:15:00Z',
    buyer_id: 'BUY-1192',
    buyer: { full_name: 'Supermarket Tani Makmur' },
    items: [{ product_id: 'PROD-3301', price_per_unit: 45000, quantity: 200 }],
    total_amount: 9000000,
    status: 'completed',
  },
];

export function FarmerSalesReport() {
  const user = useAuthStore((s) => s.user);

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // 1. Fetch Farmer Analytics
  const {
    data: farmerAnalytics,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
    refetch: refetchAnalytics,
    isRefetching: isRefetchingAnalytics,
  } = useQuery({
    queryKey: ['farmer-analytics', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      return analyticsService.getFarmerAnalytics(user.id);
    },
    enabled: !!user?.id,
  });

  // 2. Fetch Daily Revenue Chart Data
  const {
    data: revenueChartData,
    isLoading: isChartLoading,
    isError: isChartError,
    refetch: refetchChart,
    isRefetching: isRefetchingChart,
  } = useQuery({
    queryKey: ['farmer-revenue-chart', user?.id, date?.from, date?.to],
    queryFn: async () => {
      if (!user?.id) return null;
      const params = {
        from_date: date?.from ? format(date.from, 'yyyy-MM-dd') : undefined,
        to_date: date?.to ? format(date.to, 'yyyy-MM-dd') : undefined,
      };
      return analyticsService.getFarmerRevenueChart(user.id, params);
    },
    enabled: !!user?.id,
  });

  // 3. Fetch Orders in date range
  const {
    data: ordersResponse,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    refetch: refetchOrders,
    isRefetching: isRefetchingOrders,
  } = useQuery({
    queryKey: ['farmer-report-orders', user?.id, date?.from, date?.to],
    queryFn: async () => {
      if (!user?.id) return null;
      return orderService.getOrders({
        from_date: date?.from ? date.from.toISOString() : undefined,
        to_date: date?.to ? date.to.toISOString() : undefined,
        limit: 100,
      });
    },
    enabled: !!user?.id,
  });

  const isQueryError = isAnalyticsError || isChartError || isOrdersError;

  // Fallback to local demo data automatically on any fetch error
  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan Laporan Penjualan offline. Menggunakan data demo lokal.', {
        description:
          'Layanan backend analytics tidak merespon. Menampilkan data simulasi transaksi agar Anda tetap dapat meninjau dashboard.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  // 4. Map Orders to SalesReportItem
  const orders: SalesReportItem[] = React.useMemo(() => {
    const rawOrders = isQueryError ? MOCK_ORDERS : ordersResponse?.data?.orders || [];
    return rawOrders.map((o) => {
      const quantity = o.items.reduce((sum, item) => sum + Number(item.quantity), 0);

      const productName =
        o.items.length > 0
          ? `Produk #${o.items[0].product_id.slice(-4)}${o.items.length > 1 ? ` (+${o.items.length - 1} lainnya)` : ''}`
          : 'Tidak ada produk';

      const unitPrice = o.items.length > 0 ? Number(o.items[0].price_per_unit) : 0;

      return {
        id: o.id,
        date: o.created_at,
        customerName: o.buyer?.full_name || `Pembeli #${o.buyer_id.slice(-4)}`,
        productName,
        quantity,
        price: unitPrice,
        total: Number(o.total_amount),
        status: ['completed', 'delivered', 'paid', 'confirmed_seller', 'shipped'].includes(o.status)
          ? 'completed'
          : 'cancelled',
      };
    });
  }, [ordersResponse, isQueryError]);

  // 5. Compute aggregate metrics from real/mock data
  const summary: SalesReportSummary = React.useMemo(() => {
    const completedOrders = orders.filter((o) => o.status === 'completed');
    const totalSales = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const avgTransaction =
      completedOrders.length > 0 ? Math.round(totalSales / completedOrders.length) : 0;
    const itemsSold = completedOrders.reduce((sum, o) => sum + o.quantity, 0);
    const growth = isQueryError
      ? MOCK_ANALYTICS.revenue_change_percent
      : (farmerAnalytics?.revenue_change_percent ?? 0);

    return {
      totalSales,
      growth,
      avgTransaction,
      itemsSold,
    };
  }, [orders, farmerAnalytics, isQueryError]);

  // 6. Map Chart Data with computed orders per day
  const dailyData: DailySalesData[] = React.useMemo(() => {
    const ordersPerDay: Record<string, number> = {};
    orders.forEach((o) => {
      const day = format(new Date(o.date), 'yyyy-MM-dd');
      ordersPerDay[day] = (ordersPerDay[day] || 0) + 1;
    });

    const chartRaw = isQueryError
      ? MOCK_REVENUE_CHART
      : ((revenueChartData || []) as Array<{
          date: string;
          pendapatan: number;
          pengeluaran: number;
        }>);

    return chartRaw.map((item) => ({
      date: item.date,
      sales: item.pendapatan || 0,
      orders: ordersPerDay[item.date] || 0,
    }));
  }, [revenueChartData, orders, isQueryError]);

  // 7. Setup React Table
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: orders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleRetry = () => {
    refetchAnalytics();
    refetchChart();
    refetchOrders();
  };

  // 8. Client-side CSV export trigger
  const handleExportCSV = () => {
    if (!orders || orders.length === 0) {
      toast.error('Tidak ada data untuk diekspor');
      return;
    }

    const headers = [
      'Tanggal',
      'ID Pesanan',
      'Pelanggan',
      'Produk',
      'Jumlah',
      'Total (Rp)',
      'Status',
    ];
    const rows = orders.map((item) => [
      format(new Date(item.date), 'yyyy-MM-dd HH:mm:ss'),
      item.id,
      item.customerName,
      item.productName,
      item.quantity,
      item.total,
      item.status === 'completed' ? 'Selesai' : 'Batal',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((r) => r.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `Laporan_Penjualan_SmartTani_${format(new Date(), 'yyyyMMdd_HHmmss')}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Laporan berhasil diekspor ke CSV');
  };

  const isLoading = (isAnalyticsLoading || isChartLoading || isOrdersLoading) && !isQueryError;
  const isRefetching = isRefetchingAnalytics || isRefetchingChart || isRefetchingOrders;

  return (
    <DateRangeContext.Provider value={{ date, setDate }}>
      <div className="w-full text-slate-900">
        <div className="mx-auto flex w-full flex-col gap-6">
          {isQueryError && (
            <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 font-semibold shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 animate-pulse" />
                <p>
                  Mode Offline Simulasi: Koneksi ke server laporan penjualan terputus. Menampilkan
                  data lokal demo agar Anda tetap dapat menjelajahi layout.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-7 cursor-pointer border-amber-300 text-amber-800 bg-white hover:bg-amber-100 font-bold shrink-0 text-[10px]"
                onClick={handleRetry}
                disabled={isRefetching}
              >
                <RefreshCw className={`mr-1 h-3 w-3 ${isRefetching ? 'animate-spin' : ''}`} />
                {isRefetching ? 'Hubungkan...' : 'Coba Hubungkan Kembali'}
              </Button>
            </div>
          )}

          <SalesReportHeader onExportCSV={handleExportCSV} />

          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <SalesReportStats summary={summary} />
          )}

          {isLoading ? (
            <div className="grid gap-4 lg:grid-cols-3">
              <Skeleton className="lg:col-span-2 h-[380px] w-full rounded-xl" />
              <Skeleton className="h-[380px] w-full rounded-xl" />
            </div>
          ) : (
            <SalesReportCharts data={dailyData} />
          )}

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : (
            <SalesReportTable table={table} columnsCount={columns.length} />
          )}
        </div>
      </div>
    </DateRangeContext.Provider>
  );
}
