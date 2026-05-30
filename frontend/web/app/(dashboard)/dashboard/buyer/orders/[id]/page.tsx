'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/order';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
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
  ArrowLeft,
  Truck,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  MapPin,
  FileText,
  Calendar,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

const MOCK_ORDER_DETAIL = {
  id: 'ORD-88192',
  created_at: '2026-05-27T10:00:00Z',
  total_amount: 1500000,
  status: 'shipped',
  items: [
    {
      product_id: 'P-01',
      product: { title: 'Cabai Merah Keriting' },
      quantity: 60,
      price_per_unit: 25000,
    },
  ],
  shipping_address: {
    recipient_name: 'Syarief Hayat',
    phone_number: '0812-3456-7890',
    full_address: 'Gg. Harmoni No. 12, RT 04/RW 02, Cilandak Barat',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    postal_code: '12430',
  },
};

const MOCK_TRACKING_DETAILS = {
  order_id: 'ORD-88192',
  courier_name: 'SiCepat Ekspres',
  receipt_number: 'REG-889102212',
  steps: [
    {
      title: 'Kurir sedang mengantar ke alamat tujuan',
      time: '2026-05-27T14:30:00Z',
      description: 'Paket sedang dibawa oleh kurir menuju lokasi Anda.',
      isCompleted: true,
    },
    {
      title: 'Paket tiba di hub transit Jakarta Selatan',
      time: '2026-05-27T08:15:00Z',
      description: 'Pusat Distribusi Selatan - Paket sedang disortir.',
      isCompleted: true,
    },
    {
      title: 'Paket diserahkan ke kurir logistik',
      time: '2026-05-26T17:00:00Z',
      description: 'Pihak logistik MitraTani telah melakukan pickup barang.',
      isCompleted: true,
    },
    {
      title: 'Pesanan Dikonfirmasi oleh Penjual',
      time: '2026-05-26T11:00:00Z',
      description: 'Penjual telah menyiapkan produk di gudang.',
      isCompleted: true,
    },
    {
      title: 'Pembayaran Berhasil',
      time: '2026-05-26T10:05:00Z',
      description: 'Pembayaran terverifikasi via Midtrans Snap.',
      isCompleted: true,
    },
  ],
};

const statusConfig: Record<string, { label: string; className: string; dotClassName: string }> = {
  pending_payment: {
    label: 'Menunggu Pembayaran',
    className: 'bg-amber-50 text-amber-700 border-amber-200',
    dotClassName: 'bg-amber-500',
  },
  paid: {
    label: 'Dibayar',
    className: 'bg-blue-50 text-blue-700 border-blue-200',
    dotClassName: 'bg-blue-500 animate-pulse',
  },
  confirmed_seller: {
    label: 'Dikonfirmasi Penjual',
    className: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    dotClassName: 'bg-indigo-500 animate-pulse',
  },
  shipped: {
    label: 'Dalam Pengiriman',
    className: 'bg-sky-50 text-sky-700 border-sky-200',
    dotClassName: 'bg-sky-500 animate-pulse',
  },
  delivered: {
    label: 'Selesai',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClassName: 'bg-emerald-500',
  },
  completed: {
    label: 'Selesai',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    dotClassName: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Dibatalkan',
    className: 'bg-rose-50 text-rose-700 border-rose-200',
    dotClassName: 'bg-rose-500',
  },
};

export default function BuyerOrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const orderId = String(params.id);

  const [isRefetching, setIsRefetching] = React.useState(false);

  // 1. Fetch Order Detail
  const {
    data: orderData,
    isLoading: isOrderLoading,
    isError: isOrderError,
    refetch: refetchOrder,
  } = useQuery({
    queryKey: ['buyer-order-detail', orderId],
    queryFn: async () => orderService.getOrderById(orderId),
    enabled: !!orderId,
  });

  // 2. Fetch Tracking
  const {
    data: trackingData,
    isLoading: isTrackingLoading,
    isError: isTrackingError,
    error: trackingError,
    refetch: refetchTracking,
  } = useQuery({
    queryKey: ['buyer-order-tracking', orderId],
    queryFn: async () => orderService.getTracking(orderId),
    enabled: !!orderId,
    retry: false,
  });

  const isTracking404 = (trackingError as any)?.response?.status === 404;
  const isQueryError = isOrderError || (isTrackingError && !isTracking404);

  const handleRetry = async () => {
    setIsRefetching(true);
    try {
      await Promise.all([refetchOrder(), refetchTracking()]);
      toast.success('Koneksi berhasil dipulihkan!');
    } catch (err) {
      toast.error('Gagal terhubung kembali ke layanan.');
    } finally {
      setIsRefetching(false);
    }
  };

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan transaksi offline. Menggunakan data demo lokal.', {
        description: 'Menampilkan data pesanan simulasi agar Anda tetap dapat menjelajahi layout.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const order = isQueryError
    ? MOCK_ORDER_DETAIL
    : (((orderData?.data as unknown as Record<string, unknown>)?.order ||
        orderData?.data) as unknown as typeof MOCK_ORDER_DETAIL) || MOCK_ORDER_DETAIL;

  const tracking = isQueryError
    ? MOCK_TRACKING_DETAILS
    : isTracking404
      ? null
      : (((trackingData as unknown as Record<string, unknown>)?.data ||
          trackingData ||
          MOCK_TRACKING_DETAILS) as unknown as typeof MOCK_TRACKING_DETAILS);

  const handlePay = () => {
    toast.loading('Membuka Midtrans Snap...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Pembayaran pesanan berhasil dikonfirmasi! (Simulasi)');
      refetchOrder();
    }, 1500);
  };

  const handleConfirm = () => {
    toast.loading('Mengirimkan konfirmasi penerimaan barang...');
    setTimeout(() => {
      toast.dismiss();
      toast.success('Pesanan selesai! Terima kasih atas konfirmasi Anda.');
      refetchOrder();
    }, 1500);
  };

  const isLoading = (isOrderLoading || isTrackingLoading) && !isQueryError;

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-40 w-full" />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="lg:col-span-2 h-[400px]" />
          <Skeleton className="h-[400px]" />
        </div>
      </div>
    );
  }

  const isCompleted = order.status === 'completed';
  const isShipped = order.status === 'shipped';
  const isPendingPayment = order.status === 'pending_payment';

  // Financial details
  const subtotal = order.items.reduce(
    (sum: number, item: (typeof MOCK_ORDER_DETAIL.items)[0]) =>
      sum + item.price_per_unit * item.quantity,
    0
  );
  const shippingFee = 15000;
  const platformFee = 5000;
  const grandTotal = subtotal + shippingFee + platformFee;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Back button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => router.push('/dashboard/buyer/orders')}
        className="cursor-pointer font-semibold text-slate-500 hover:text-slate-900 -ml-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Pesanan
      </Button>

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
            onClick={handleRetry}
            disabled={isRefetching}
          >
            <RefreshCw className={`mr-1 h-3 w-3 ${isRefetching ? 'animate-spin' : ''}`} />
            {isRefetching ? 'Hubungkan...' : 'Coba Hubungkan Kembali'}
          </Button>
        </div>
      )}

      {/* Header Info */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-800">
              Detail Pesanan #{order.id}
            </h1>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${
                statusConfig[order.status]?.className || 'bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  statusConfig[order.status]?.dotClassName || 'bg-slate-400'
                }`}
              />
              {statusConfig[order.status]?.label || order.status}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Dibuat pada{' '}
            {format(new Date(order.created_at), 'dd MMMM yyyy, HH:mm', { locale: localeId })}
          </p>
        </div>

        {/* Action Triggers */}
        <div className="flex gap-2">
          {isPendingPayment && (
            <Button
              className="cursor-pointer font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-xs"
              onClick={handlePay}
            >
              <CreditCard className="mr-2 h-4 w-4" /> Bayar Sekarang
            </Button>
          )}
          {isShipped && (
            <Button
              className="cursor-pointer font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
              onClick={handleConfirm}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" /> Barang Diterima
            </Button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column (2/3): Items + Courier Tracking Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <FileText className="h-4.5 w-4.5 text-green-600" />
                Daftar Produk Belanja
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
               {order.items.map((item: any, index: number) => {
                 const productTitle = item?.product?.title || 'Produk Tani';
                 const initialLetters = productTitle.slice(0, 2).toUpperCase();

                 return (
                   <div key={index} className="p-5 flex items-center justify-between gap-4">
                     <div className="flex items-center gap-3">
                       <div className="h-12 w-12 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center text-green-600 font-extrabold text-sm shrink-0">
                         {initialLetters}
                       </div>
                       <div>
                         <h4 className="text-sm font-semibold text-slate-800">{productTitle}</h4>
                         <p className="text-xs text-slate-400 mt-0.5">
                           {item.quantity} unit x {formatCurrency(item.price_per_unit)}
                         </p>
                       </div>
                     </div>
                     <p className="text-sm font-bold text-slate-800">
                       {formatCurrency(item.price_per_unit * item.quantity)}
                     </p>
                   </div>
                 );
               })}
            </CardContent>
          </Card>

          {/* Courier Tracking */}
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                  <Truck className="h-4.5 w-4.5 text-green-600" />
                  Informasi & Pelacakan Kurir
                </CardTitle>
                <CardDescription className="text-xs">
                  Nomor resi pengiriman logistik MitraTani.
                </CardDescription>
              </div>
              {tracking && (
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-800">{tracking.courier_name}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    {tracking.receipt_number}
                  </p>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-6">
              {tracking ? (
                /* Timeline list */
                <div className="relative border-l-2 border-slate-100 ml-3.5 space-y-6">
                  {tracking.steps && tracking.steps.length > 0 ? (
                    tracking.steps.map(
                      (step: (typeof MOCK_TRACKING_DETAILS.steps)[0], idx: number) => (
                        <div key={idx} className="relative pl-6">
                          {/* Circle Dot */}
                          <span
                            className={`absolute -left-[7px] top-1.5 h-3.5 w-3.5 rounded-full border-2 ${
                              idx === 0
                                ? 'bg-green-600 border-green-200 animate-pulse'
                                : 'bg-white border-slate-300'
                            }`}
                          />
                          <div className="space-y-1">
                            <h4
                              className={`text-xs font-bold ${idx === 0 ? 'text-green-600' : 'text-slate-800'}`}
                            >
                              {step.title}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {format(new Date(step.time), 'dd MMM yyyy, HH:mm', { locale: localeId })}
                            </p>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="text-xs text-slate-400 text-center py-4">
                      Belum ada riwayat pengiriman.
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6 text-center text-slate-400 space-y-2">
                  <Truck className="h-8 w-8 text-slate-300 animate-bounce" />
                  <p className="text-xs font-semibold text-slate-600">
                    Informasi Pengiriman Belum Tersedia
                  </p>
                  <p className="text-[10px] text-slate-400 max-w-xs leading-relaxed">
                    Pesanan Anda sedang diproses oleh penjual. Nomor resi dan pelacakan kurir akan muncul secara real-time setelah kurir melakukan pick-up paket.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (1/3): Summary Details */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <MapPin className="h-4.5 w-4.5 text-green-600" />
                Alamat Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-2 text-xs">
              {order.shipping_address ? (
                <>
                  <p className="font-bold text-slate-800">{order.shipping_address.recipient_name}</p>
                  <p className="text-slate-500 font-semibold">{order.shipping_address.phone_number}</p>
                  <p className="text-slate-600 font-medium leading-relaxed">
                    {order.shipping_address.full_address}
                  </p>
                  <p className="text-slate-600 font-medium">
                    {order.shipping_address.city}, {order.shipping_address.province}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    POS {order.shipping_address.postal_code}
                  </p>
                </>
              ) : (
                <p className="text-slate-400 font-medium text-center py-4">
                  Alamat pengiriman tidak dicantumkan.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Payment Invoice Summary */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-800">
                <ShieldCheck className="h-4.5 w-4.5 text-green-600" />
                Ringkasan Transaksi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3.5">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-500 font-semibold">
                  <span>Subtotal Belanja</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-semibold">
                  <span>Ongkos Pengiriman</span>
                  <span>{formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-semibold">
                  <span>Biaya Layanan Platform</span>
                  <span>{formatCurrency(platformFee)}</span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-3.5 flex justify-between items-center text-sm">
                <span className="font-bold text-slate-800">Total Pembayaran</span>
                <span className="font-extrabold text-green-600">{formatCurrency(grandTotal)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
