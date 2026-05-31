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
import { RefreshCw, AlertTriangle } from 'lucide-react';
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

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['farmer-sales-history'] });
  };

  const mockSalesHistory = React.useMemo(
    () => [
      {
        id: 'ORDER-901',
        customerName: 'Budi Santoso',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        totalAmount: 250000,
        paymentMethod: 'Online (Midtrans)',
        status: 'completed' as OrderStatus,
        items: [
          { id: 'item-h1', name: 'Pupuk Organik Cair', quantity: 2, price: 125000, image: '' },
        ],
        platformFee: 2000,
        shippingCost: 15000,
        shippingAddress: {
          recipient_name: 'Budi Santoso',
          phone_number: '081234567890',
          full_address: 'Jl. Ahmad Yani No. 12',
          city: 'Surabaya',
          province: 'Jawa Timur',
          postal_code: '60231',
        },
      },
      {
        id: 'ORDER-902',
        customerName: 'Dewi Lestari',
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        totalAmount: 95000,
        paymentMethod: 'Manual',
        status: 'delivered' as OrderStatus,
        items: [
          { id: 'item-h2', name: 'Benih Tomat Premium 100g', quantity: 1, price: 95000, image: '' },
        ],
        platformFee: 2000,
        shippingCost: 10000,
        shippingAddress: {
          recipient_name: 'Dewi Lestari',
          phone_number: '082123456789',
          full_address: 'Perum Tani Indah Blok C/10',
          city: 'Sidoarjo',
          province: 'Jawa Timur',
          postal_code: '61212',
        },
      },
      {
        id: 'ORDER-903',
        customerName: 'Joko Susilo',
        date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        totalAmount: 120000,
        paymentMethod: 'Manual',
        status: 'cancelled' as OrderStatus,
        items: [
          { id: 'item-h3', name: 'Alat Gunting Dahan', quantity: 2, price: 60000, image: '' },
        ],
        platformFee: 2000,
        shippingCost: 12000,
        shippingAddress: {
          recipient_name: 'Joko Susilo',
          phone_number: '081333444555',
          full_address: 'RT 04/RW 01',
          city: 'Tuban',
          province: 'Jawa Timur',
          postal_code: '62311',
        },
      },
    ],
    []
  );

  React.useEffect(() => {
    if (isError) {
      toast.error('Gagal menghubungkan ke layanan riwayat penjualan. Koneksi terputus.');
    }
  }, [isError]);

  // 2. Map backend Order type to UI FarmerOrder type
  const orders: FarmerOrder[] = React.useMemo(() => {
    if (isError || !ordersResponse?.data?.orders || ordersResponse.data.orders.length === 0) {
      return [];
    }

    const rawOrders = ordersResponse.data.orders;
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
  }, [ordersResponse, isError, mockSalesHistory]);

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
          <>
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
              Gagal memuat data statistik penjualan / Koneksi ke server terputus
            </div>
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
              Gagal memuat daftar riwayat penjualan / Koneksi ke server terputus
            </div>
          </>
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
