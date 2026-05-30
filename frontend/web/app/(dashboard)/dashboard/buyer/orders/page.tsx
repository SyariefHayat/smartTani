'use client';

import * as React from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { orderService } from '@/services/order';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Search,
  ShoppingBag,
  RefreshCw,
  AlertTriangle,
  MoreHorizontal,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ExtendedOrderItem {
  product_id?: string;
  product?: {
    title: string;
  };
  quantity: number;
  price_per_unit: number;
}

const MOCK_ORDERS = [
  {
    id: 'ORD-88192',
    created_at: '2026-05-27T10:00:00Z',
    total_amount: 1500000,
    status: 'shipped',
    items: [{ product: { title: 'Cabai Merah Keriting' }, quantity: 60, price_per_unit: 25000 }],
  },
  {
    id: 'ORD-88180',
    created_at: '2026-05-26T18:00:00Z',
    total_amount: 450000,
    status: 'pending_payment',
    items: [{ product: { title: 'Bibit Tomat Unggul' }, quantity: 25, price_per_unit: 18000 }],
  },
  {
    id: 'ORD-88151',
    created_at: '2026-05-26T14:30:00Z',
    total_amount: 2100000,
    status: 'completed',
    items: [{ product: { title: 'Pupuk Organik Bio-Tani' }, quantity: 70, price_per_unit: 30000 }],
  },
  {
    id: 'ORD-88092',
    created_at: '2026-05-24T08:15:00Z',
    total_amount: 4500000,
    status: 'completed',
    items: [{ product: { title: 'Alat Semprot Hama' }, quantity: 15, price_per_unit: 300000 }],
  },
  {
    id: 'ORD-87850',
    created_at: '2026-05-21T09:30:00Z',
    total_amount: 900000,
    status: 'cancelled',
    items: [{ product: { title: 'Bawang Merah Bima' }, quantity: 30, price_per_unit: 30000 }],
  },
];

export default function BuyerOrdersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const user = getStoredAuthUser();

  const defaultTab = pathname.includes('/history') || searchParams.get('tab') === 'history' ? 'history' : 'active';
  const [activeTab, setActiveTab] = React.useState<'active' | 'history'>(defaultTab);

  React.useEffect(() => {
    const nextTab = pathname.includes('/history') || searchParams.get('tab') === 'history' ? 'history' : 'active';
    setActiveTab(nextTab);
  }, [pathname, searchParams]);
  const [searchQuery, setSearchQuery] = React.useState('');

  // 1. Fetch Orders
  const {
    data: ordersResponse,
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['buyer-orders', user?.id],
    queryFn: async () => orderService.getOrders({ limit: 100 }),
    enabled: !!user?.id,
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan transaksi offline. Menggunakan data demo lokal.', {
        description: 'Menampilkan data pesanan simulasi agar Anda tetap dapat menjelajahi layout.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const rawOrders = isQueryError ? MOCK_ORDERS : ordersResponse?.data?.orders || MOCK_ORDERS;

  // Filter orders by active vs history
  // Active status: pending_payment, confirmed_seller, shipped, delivered, paid
  // History status: completed, cancelled, refunded
  const filteredOrders = React.useMemo(() => {
    return rawOrders.filter((order) => {
      const isHistoryStatus = ['completed', 'cancelled', 'refunded'].includes(order.status);
      const matchesTab = activeTab === 'history' ? isHistoryStatus : !isHistoryStatus;

      const productTitle = (order.items?.[0] as unknown as ExtendedOrderItem)?.product?.title || '';
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        productTitle.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [rawOrders, activeTab, searchQuery]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const ITEMS_PER_PAGE = 10;

  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  const totalRows = filteredOrders.length;
  const totalPages = Math.ceil(totalRows / ITEMS_PER_PAGE);
  const fromRow = totalRows === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const toRow = Math.min(currentPage * ITEMS_PER_PAGE, totalRows);

  const paginatedOrders = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const handlePayOrder = (orderId: string) => {
    toast.loading('Membuka gerbang pembayaran Midtrans...');
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Pembayaran untuk pesanan ${orderId} berhasil dilakukan! (Simulasi)`);
      refetch();
    }, 1500);
  };

  const handleConfirmReceipt = (orderId: string) => {
    toast.loading('Mengonfirmasi penerimaan barang...');
    setTimeout(() => {
      toast.dismiss();
      toast.success(`Pesanan ${orderId} telah berhasil diselesaikan! Terima kasih.`);
      refetch();
    }, 1500);
  };

  const handleWriteReview = (productId: string) => {
    router.push(`/dashboard/buyer/reviews?newReview=${productId}`);
  };

  return (
    <div className="space-y-4">
      {/* Reconnect Banner */}
      {isQueryError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 animate-pulse" />
            <p>
              Layanan Transaksi Offline: Gagal memuat data teraktual. Menggunakan data demo lokal.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 cursor-pointer border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold shrink-0 text-[10px]"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RefreshCw className={`mr-1 h-3 w-3 ${isRefetching ? 'animate-spin' : ''}`} />
            {isRefetching ? 'Hubungkan...' : 'Coba Hubungkan Kembali'}
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
            Pesanan Saya
          </h1>
          <p className="text-sm text-slate-500">
            Kelola dan pantau status pengiriman transaksi pembelian Anda.
          </p>
        </div>
      </div>

      {/* Main Card Wrapper */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100">
          {/* Tab buttons */}
          <div className="flex bg-slate-100 p-0.5 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('active')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'active'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Pesanan Aktif
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Riwayat Pesanan
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Cari ID pesanan atau produk..."
              className="h-9 rounded-md border-slate-200 bg-white pl-9 pr-4 text-xs text-slate-900 focus-visible:ring-green-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-md border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID Pesanan</TableHead>
                  <TableHead>Tanggal</TableHead>
                  <TableHead>Komoditas / Jumlah</TableHead>
                  <TableHead>Total Pembayaran</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-20 bg-slate-100 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 bg-slate-100 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40 bg-slate-100 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 bg-slate-100 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24 bg-slate-100 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-28 bg-slate-100 rounded" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground font-medium text-xs"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ShoppingBag className="h-8 w-8 text-slate-300" />
                        Tidak ada pesanan ditemukan pada daftar ini.
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedOrders.map((order) => {
                    const productTitle =
                      (order.items?.[0] as unknown as ExtendedOrderItem)?.product?.title ||
                      'Produk Tani';
                    const itemsCount = order.items?.length || 1;
                    const isCompleted = order.status === 'completed';
                    const isShipped = order.status === 'shipped';
                    const isPendingPayment = order.status === 'pending_payment';
                    const isCancelled = order.status === 'cancelled';

                    return (
                      <TableRow
                        key={order.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell className="font-mono text-xs font-medium text-muted-foreground">
                          #{order.id}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-slate-600">
                          {format(new Date(order.created_at), 'dd MMM yyyy')}
                        </TableCell>
                        <TableCell className="text-xs text-slate-700 max-w-xs truncate">
                          <span className="font-semibold text-slate-800">{productTitle}</span>
                          {itemsCount > 1 && (
                            <span className="text-slate-400 text-[10px] ml-1">
                              +{itemsCount - 1} item lainnya
                            </span>
                          )}
                          <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                            {order.items?.[0]?.quantity || 0} unit
                          </p>
                        </TableCell>
                        <TableCell className="text-xs font-bold text-slate-800">
                          {formatCurrency(order.total_amount)}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                              isCompleted
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : isShipped
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : isPendingPayment
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : isCancelled
                                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                                      : 'bg-slate-50 text-slate-700 border-slate-200'
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                isCompleted
                                  ? 'bg-emerald-500 animate-pulse'
                                  : isShipped
                                    ? 'bg-blue-500 animate-pulse'
                                    : isPendingPayment
                                      ? 'bg-amber-500'
                                      : isCancelled
                                        ? 'bg-rose-500'
                                        : 'bg-slate-400'
                              }`}
                            />
                            {isCompleted
                              ? 'Selesai'
                              : isShipped
                                ? 'Dalam Pengiriman'
                                : isPendingPayment
                                  ? 'Menunggu Pembayaran'
                                  : isCancelled
                                    ? 'Dibatalkan'
                                    : 'Diproses'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-xs" className="cursor-pointer">
                                <span className="sr-only">Buka menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 bg-white">
                              <DropdownMenuGroup>
                                <DropdownMenuLabel>Aksi</DropdownMenuLabel>
                                <DropdownMenuItem
                                  className="cursor-pointer text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
                                  onClick={() => {
                                    navigator.clipboard.writeText(order.id);
                                    toast.success('ID pesanan berhasil disalin');
                                  }}
                                >
                                  Salin ID Pesanan
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer text-slate-700 hover:bg-slate-50 focus:bg-slate-50"
                                  onClick={() => router.push(`/dashboard/buyer/orders/${order.id}`)}
                                >
                                  Lihat Detail
                                </DropdownMenuItem>
                              </DropdownMenuGroup>
                              {(isPendingPayment || isShipped || isCompleted) && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuGroup>
                                    {isPendingPayment && (
                                      <DropdownMenuItem
                                        className="cursor-pointer font-medium text-amber-600 hover:bg-amber-50 focus:bg-amber-50 focus:text-amber-700"
                                        onClick={() => handlePayOrder(order.id)}
                                      >
                                        Bayar Sekarang
                                      </DropdownMenuItem>
                                    )}
                                    {isShipped && (
                                      <DropdownMenuItem
                                        className="cursor-pointer font-medium text-blue-600 hover:bg-blue-50 focus:bg-blue-50 focus:text-blue-700"
                                        onClick={() => handleConfirmReceipt(order.id)}
                                      >
                                        Konfirmasi Terima
                                      </DropdownMenuItem>
                                    )}
                                    {isCompleted && (
                                      <DropdownMenuItem
                                        className="cursor-pointer font-medium text-emerald-600 hover:bg-emerald-50 focus:bg-emerald-50 focus:text-emerald-700"
                                        onClick={() =>
                                          handleWriteReview(
                                            (order.items?.[0] as unknown as ExtendedOrderItem)
                                              ?.product_id || 'P-01'
                                          )
                                        }
                                      >
                                        Ulas Produk
                                      </DropdownMenuItem>
                                    )}
                                  </DropdownMenuGroup>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 mt-4">
            <div className="text-sm text-muted-foreground">
              {isLoading ? (
                <div className="h-4 w-48 animate-pulse bg-slate-100 rounded inline-block" />
              ) : totalRows === 0 ? (
                '0 pesanan ditemukan'
              ) : (
                <>
                  Menampilkan{' '}
                  <span className="font-semibold text-slate-900">
                    {fromRow}–{toRow}
                  </span>{' '}
                  dari <span className="font-semibold text-slate-900">{totalRows}</span> pesanan
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer text-slate-700 bg-white"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={isLoading || currentPage === 1 || totalRows === 0}
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer text-slate-700 bg-white"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={isLoading || currentPage === totalPages || totalRows === 0}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
