'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  Eye,
  RefreshCw,
  AlertTriangle,
  CreditCard,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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
  const user = getStoredAuthUser();

  const defaultTab = searchParams.get('tab') === 'history' ? 'history' : 'active';
  const [activeTab, setActiveTab] = React.useState<'active' | 'history'>(defaultTab);
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
    <div className="w-full space-y-6 text-slate-900">
      {/* Reconnect Banner */}
      {isQueryError && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 font-semibold shadow-xs">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 animate-pulse" />
            <p>
              Mode Offline Simulasi: Koneksi ke server pesanan terputus. Menampilkan data lokal demo
              agar Anda tetap dapat menjelajahi layout.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="h-7 cursor-pointer border-amber-300 text-amber-800 bg-white hover:bg-amber-100 font-bold shrink-0 text-[10px]"
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
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-800">
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
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-12 text-center text-slate-400 font-medium text-xs flex flex-col items-center justify-center gap-2">
              <ShoppingBag className="h-8 w-8 text-slate-300" />
              Tidak ada pesanan ditemukan pada daftar ini.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/75 border-b border-slate-200">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider pl-6">
                      ID Pesanan
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      Tanggal
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      Komoditas / Jumlah
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      Total Pembayaran
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider">
                      Status
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs uppercase tracking-wider text-right pr-6">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => {
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
                        className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                      >
                        <TableCell className="py-4 font-mono text-xs font-semibold text-slate-500 pl-6">
                          #{order.id}
                        </TableCell>
                        <TableCell className="py-4 text-xs font-medium text-slate-600">
                          {format(new Date(order.created_at), 'dd MMM yyyy')}
                        </TableCell>
                        <TableCell className="py-4 text-xs text-slate-700 max-w-xs truncate">
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
                        <TableCell className="py-4 text-xs font-bold text-slate-800">
                          {formatCurrency(order.total_amount)}
                        </TableCell>
                        <TableCell className="py-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
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
                        <TableCell className="py-4 text-right pr-6">
                          <div className="flex justify-end gap-1.5">
                            {isPendingPayment && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-[10px] font-bold border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 cursor-pointer flex items-center gap-1"
                                onClick={() => handlePayOrder(order.id)}
                              >
                                <CreditCard className="h-3 w-3" /> Bayar
                              </Button>
                            )}
                            {isShipped && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-[10px] font-bold border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800 cursor-pointer flex items-center gap-1"
                                onClick={() => handleConfirmReceipt(order.id)}
                              >
                                <CheckCircle2 className="h-3 w-3" /> Selesai
                              </Button>
                            )}
                            {isCompleted && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-7 text-[10px] font-bold border-slate-200 bg-white text-slate-700 hover:bg-slate-50 cursor-pointer flex items-center gap-1"
                                onClick={() =>
                                  handleWriteReview(
                                    (order.items?.[0] as unknown as ExtendedOrderItem)
                                      ?.product_id || 'P-01'
                                  )
                                }
                              >
                                <MessageSquare className="h-3 w-3 text-slate-400" /> Ulas
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-[10px] font-bold text-slate-500 hover:text-slate-900 cursor-pointer flex items-center gap-1"
                              onClick={() => router.push(`/dashboard/buyer/orders/${order.id}`)}
                            >
                              <Eye className="h-3.5 w-3.5 text-slate-400" /> Detail
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
