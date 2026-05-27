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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { exportToCSV } from '@/lib/export-csv';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { DateRange } from 'react-day-picker';

import { SalesHistoryHeader } from './SalesHistoryHeader';
import { SalesHistoryStats } from './SalesHistoryStats';
import { SalesHistoryTable } from './SalesHistoryTable';
import { columns } from './columns';
import { FarmerOrder, OrderStatus } from '../farmer-orders/types';

export function FarmerSalesHistory() {
  const queryClient = useQueryClient();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

  // 1. Fetch Orders with target statuses (delivered, completed, cancelled, refunded)
  const {
    data: ordersResponse,
    isLoading,
    isError,
    error,
    isRefetching,
  } = useQuery({
    queryKey: ['farmer-sales-history'],
    queryFn: async () =>
      orderService.getOrders({ status: 'delivered,completed,cancelled,refunded', limit: 200 }),
  });

  React.useEffect(() => {
    if (error) {
      toast.error('Gagal mengambil data riwayat pesanan');
    }
  }, [error]);

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['farmer-sales-history'] });
  };

  // 2. Map backend Order type to UI FarmerOrder type
  const orders: FarmerOrder[] = React.useMemo(() => {
    const rawOrders = ordersResponse?.data?.orders || [];
    return rawOrders.map((o) => {
      const items = o.items.map((item) => ({
        id: item.id,
        name: `Produk #${item.product_id.slice(-4)}`,
        quantity: Number(item.quantity),
        price: Number(item.price_per_unit),
        image: '',
      }));

      return {
        id: o.id,
        customerName: o.buyer?.full_name || `Pembeli #${o.buyer_id.slice(-4)}`,
        date: o.created_at,
        totalAmount: Number(o.total_amount),
        paymentMethod: o.payment_url ? 'Online (Midtrans)' : 'Manual',
        status: o.status as OrderStatus,
        items,
        platformFee: Number(o.platform_fee || 0),
        shippingCost: Number(o.shipping_cost || 0),
        shippingAddress: o.shipping_address,
      };
    });
  }, [ordersResponse]);

  // 3. Date range memory filtering
  const filteredOrders = React.useMemo(() => {
    let result = orders;
    if (dateRange?.from) {
      const fromDate = new Date(dateRange.from);
      fromDate.setHours(0, 0, 0, 0);
      result = result.filter((o) => {
        const orderDate = new Date(o.date);
        return orderDate >= fromDate;
      });
    }
    if (dateRange?.to) {
      const toDate = new Date(dateRange.to);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((o) => {
        const orderDate = new Date(o.date);
        return orderDate <= toDate;
      });
    }
    return result;
  }, [orders, dateRange]);

  // 4. Setup React Table
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: filteredOrders,
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

  // 5. CSV Export Handler
  const handleExport = () => {
    if (filteredOrders.length === 0) {
      toast.error('Tidak ada data riwayat transaksi untuk diekspor.');
      return;
    }

    exportToCSV({
      data: filteredOrders,
      columns: [
        { header: 'ID Pesanan', accessor: (row) => `#${row.id.slice(-6).toUpperCase()}` },
        {
          header: 'Tanggal',
          accessor: (row) => format(new Date(row.date), 'dd MMM yyyy HH:mm', { locale: id }),
        },
        { header: 'Pelanggan', accessor: (row) => row.customerName },
        {
          header: 'Total Penjualan',
          accessor: (row) =>
            new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0,
            }).format(row.totalAmount),
        },
        { header: 'Metode Pembayaran', accessor: (row) => row.paymentMethod },
        {
          header: 'Status',
          accessor: (row) => {
            switch (row.status) {
              case 'delivered':
                return 'Selesai';
              case 'completed':
                return 'Selesai';
              case 'cancelled':
                return 'Dibatalkan';
              case 'refunded':
                return 'Direfund';
              default:
                return row.status;
            }
          },
        },
        {
          header: 'Daftar Item',
          accessor: (row) => row.items.map((item) => `${item.quantity}x ${item.name}`).join('; '),
        },
      ],
      filename: 'riwayat_penjualan_petani',
    });
    toast.success('Data riwayat penjualan berhasil diekspor.');
  };

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        <SalesHistoryHeader onExport={handleExport} />

        {isError ? (
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
            <p className="font-semibold text-base mb-1">Gagal Memuat Riwayat Penjualan</p>
            <p className="text-xs text-red-400 max-w-md mb-4">
              Layanan order-service tidak merespon atau sedang tidak aktif. Harap periksa koneksi
              Anda atau hubungi administrator.
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
        ) : (
          <>
            <SalesHistoryStats orders={filteredOrders} isLoading={isLoading} />
            <SalesHistoryTable
              table={table}
              columnsCount={columns.length}
              isLoading={isLoading}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          </>
        )}
      </div>
    </div>
  );
}
