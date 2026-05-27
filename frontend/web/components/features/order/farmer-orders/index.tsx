'use client';

import * as React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { RefreshCw } from 'lucide-react';

import { useAuthStore } from '@/stores/auth';
import { orderService } from '@/services/order';
import { exportToCSV } from '@/lib/export-csv';
import { OrderHeader } from './OrderHeader';
import { OrderStats } from './OrderStats';
import { OrderTable } from './OrderTable';
import { columns } from './columns';
import { FarmerOrder, OrderStatus } from './types';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export function FarmerIncomingOrderList() {
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Dialog for redirected details
  const [detailOrder, setDetailOrder] = React.useState<FarmerOrder | null>(null);
  const [isDetailOpen, setIsDetailOpen] = React.useState(false);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError, error, isRefetching } = useQuery({
    queryKey: ['farmer-orders', user?.id, pagination.pageIndex, pagination.pageSize, columnFilters],
    queryFn: async () => {
      if (!user?.id) return null;

      const status = columnFilters.find((f) => f.id === 'status')?.value as string;

      return orderService.getOrders({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        status: status || undefined,
      });
    },
    enabled: !!user?.id,
  });

  React.useEffect(() => {
    if (isError) {
      toast.error(
        'Gagal mengambil data pesanan: ' +
          (error instanceof Error ? error.message : 'Terjadi kesalahan')
      );
    }
  }, [isError, error]);

  // Reset pagination pageIndex when filters change to prevent empty page index mismatch
  React.useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [columnFilters]);

  // Listener for ?detail query param action redirects from dashboard
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const detailId = params.get('detail');

      const loadOrderForDetail = async (orderId: string) => {
        try {
          const res = await orderService.getOrderById(orderId);
          if (res?.data) {
            const o = res.data;
            const uiOrder: FarmerOrder = {
              id: o.id.slice(-6).toUpperCase(),
              customerName: o.buyer?.full_name || 'Pembeli #' + o.buyer_id.slice(-4),
              date: o.created_at,
              totalAmount: Number(o.total_amount),
              paymentMethod: o.payment_url ? 'Online Payment' : 'Manual',
              status: o.status as OrderStatus,
              items: o.items.map((item) => ({
                id: item.id,
                name: 'Produk #' + item.product_id.slice(-4),
                quantity: Number(item.quantity),
                price: Number(item.price_per_unit),
                image: '',
              })),
              platformFee: Number(o.platform_fee || 0),
              shippingCost: Number(o.shipping_cost || 0),
              shippingAddress: o.shipping_address,
            };

            setDetailOrder(uiOrder);
            setIsDetailOpen(true);

            // Clean query parameters from URL silently
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
          }
        } catch (err) {
          console.error('Failed to load order details for dashboard query parameter action', err);
        }
      };

      if (detailId) {
        loadOrderForDetail(detailId);
      }
    }
  }, []);

  const orders: FarmerOrder[] = React.useMemo(() => {
    if (!data?.data?.orders) return [];

    return data.data.orders.map((o) => ({
      id: o.id.slice(-6).toUpperCase(),
      customerName: o.buyer?.full_name || 'Pembeli #' + o.buyer_id.slice(-4),
      date: o.created_at,
      totalAmount: Number(o.total_amount),
      paymentMethod: o.payment_url ? 'Online Payment' : 'Manual',
      status: o.status as OrderStatus,
      items: o.items.map((item) => ({
        id: item.id,
        name: 'Produk #' + item.product_id.slice(-4),
        quantity: Number(item.quantity),
        price: Number(item.price_per_unit),
        image: '',
      })),
      platformFee: Number(o.platform_fee || 0),
      shippingCost: Number(o.shipping_cost || 0),
      shippingAddress: o.shipping_address,
    }));
  }, [data]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: orders,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: data?.data?.meta?.totalPages ?? -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const handleExport = () => {
    if (orders.length === 0) {
      toast.error('Tidak ada data pesanan untuk diekspor.');
      return;
    }

    exportToCSV({
      data: orders,
      columns: [
        { header: 'ID Pesanan', accessor: (row) => `#${row.id}` },
        {
          header: 'Tanggal',
          accessor: (row) => format(new Date(row.date), 'dd MMM yyyy HH:mm', { locale: id }),
        },
        { header: 'Pelanggan', accessor: (row) => row.customerName },
        {
          header: 'Total Pendapatan',
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
              case 'pending_payment':
                return 'Menunggu Pembayaran';
              case 'paid':
                return 'Dibayar';
              case 'confirmed_seller':
                return 'Dikonfirmasi';
              case 'shipped':
                return 'Dikirim';
              case 'delivered':
                return 'Selesai';
              case 'cancelled':
                return 'Dibatalkan';
              case 'refund_requested':
                return 'Refund Diajukan';
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
      filename: 'daftar_pesanan_masuk',
    });
    toast.success('Data pesanan berhasil diekspor.');
  };

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['farmer-orders'] });
  };

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        <OrderHeader onExport={handleExport} />
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
            <p className="font-semibold text-base mb-1">Gagal Memuat Data Pesanan</p>
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
            <OrderStats orders={orders} isLoading={isLoading} />
            <div className="space-y-4">
              <OrderTable
                table={table}
                columnsCount={columns.length}
                pagination={data?.data?.meta}
                isLoading={isLoading}
              />
            </div>
          </>
        )}
      </div>

      {/* Global Order Detail Dialog for redirected queries */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Detail Pesanan #{detailOrder?.id}</DialogTitle>
            <DialogDescription>Informasi lengkap transaksi pembelian pelanggan.</DialogDescription>
          </DialogHeader>
          {detailOrder && (
            <div className="space-y-4 py-2 text-sm text-slate-800">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-muted-foreground">Nama Pelanggan:</span>
                <span className="font-semibold text-slate-900">{detailOrder.customerName}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-muted-foreground">Metode Pembayaran:</span>
                <span className="text-slate-900">{detailOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-muted-foreground">Tanggal Transaksi:</span>
                <span className="text-slate-900 font-sans">
                  {format(new Date(detailOrder.date), 'dd MMMM yyyy HH:mm', { locale: id })}
                </span>
              </div>
              <div className="border-b pb-2 space-y-1">
                <span className="font-medium text-muted-foreground block">Daftar Item:</span>
                {detailOrder.items.map((item) => (
                  <div key={item.id} className="flex justify-between pl-2">
                    <span className="text-slate-700">
                      • {item.quantity}x {item.name}
                    </span>
                    <span className="font-semibold text-slate-900 font-mono">
                      {new Intl.NumberFormat('id-ID', {
                        style: 'currency',
                        currency: 'IDR',
                        maximumFractionDigits: 0,
                      }).format(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between pt-1">
                <span className="font-bold text-slate-900">Total Pendapatan:</span>
                <span className="font-extrabold text-green-600 text-base">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    maximumFractionDigits: 0,
                  }).format(detailOrder.totalAmount)}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setIsDetailOpen(false)}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
