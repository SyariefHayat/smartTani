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
import { WarehouseTable } from '../../inventory/farmer-warehouse/WarehouseTable';
import { columns } from './columns';
import { DailySalesData, SalesReportItem, SalesReportSummary } from './types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangeContext } from '@/context/dateRange';
import { DateRange } from 'react-day-picker';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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

  // 1. Fetch Farmer Analytics (for metrics growth percentage)
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

  // 2. Fetch Daily Revenue Chart Data based on chosen date range
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
        limit: 100, // retrieve robust list of report records
      });
    },
    enabled: !!user?.id,
  });

  // 4. Map Orders to SalesReportItem — MUST be before any early returns
  const orders: SalesReportItem[] = React.useMemo(() => {
    const rawOrders = ordersResponse?.data?.orders || [];
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
  }, [ordersResponse]);

  // 5. Compute aggregate metrics from real data
  const summary: SalesReportSummary = React.useMemo(() => {
    const completedOrders = orders.filter((o) => o.status === 'completed');
    const totalSales = completedOrders.reduce((sum, o) => sum + o.total, 0);
    const avgTransaction =
      completedOrders.length > 0 ? Math.round(totalSales / completedOrders.length) : 0;
    const itemsSold = completedOrders.reduce((sum, o) => sum + o.quantity, 0);
    const growth = farmerAnalytics?.revenue_change_percent ?? 0;

    return {
      totalSales,
      growth,
      avgTransaction,
      itemsSold,
    };
  }, [orders, farmerAnalytics]);

  // 6. Map Chart Data with computed real orders per day
  const dailyData: DailySalesData[] = React.useMemo(() => {
    const ordersPerDay: Record<string, number> = {};
    orders.forEach((o) => {
      const day = format(new Date(o.date), 'yyyy-MM-dd');
      ordersPerDay[day] = (ordersPerDay[day] || 0) + 1;
    });

    const chartRaw = (revenueChartData || []) as Array<{
      date: string;
      pendapatan: number;
      pengeluaran: number;
    }>;

    return chartRaw.map((item) => ({
      date: item.date,
      sales: item.pendapatan || 0,
      orders: ordersPerDay[item.date] || 0,
    }));
  }, [revenueChartData, orders]);

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

  // Error state — rendered after all hooks
  if (isAnalyticsError || isChartError || isOrdersError) {
    const handleRetry = () => {
      refetchAnalytics();
      refetchChart();
      refetchOrders();
    };
    const isRefetching = isRefetchingAnalytics || isRefetchingChart || isRefetchingOrders;

    return (
      <div className="flex w-full h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 text-red-500 p-6 text-center text-sm font-medium shadow-xs">
        <svg
          className="w-10 h-10 mb-3 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="font-semibold text-base mb-1">Gagal Memuat Laporan Penjualan</p>
        <p className="text-xs text-red-400 max-w-md mb-4">
          Layanan/Service tidak merespon atau sedang tidak aktif. Harap periksa koneksi Anda atau
          hubungi administrator.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer border-red-200 text-red-500 hover:bg-red-100 hover:text-red-600"
          onClick={handleRetry}
          disabled={isRefetching}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          {isRefetching ? 'Mencoba ulang...' : 'Coba Lagi'}
        </Button>
      </div>
    );
  }

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

  const isLoading = isAnalyticsLoading || isChartLoading || isOrdersLoading;

  return (
    <DateRangeContext.Provider value={{ date, setDate }}>
      <div className="w-full text-slate-900">
        <div className="mx-auto flex w-full flex-col gap-6">
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

          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">Rincian Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : (
                <WarehouseTable table={table} columnsCount={columns.length} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DateRangeContext.Provider>
  );
}
