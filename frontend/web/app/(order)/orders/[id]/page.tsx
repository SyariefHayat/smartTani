'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order';
import { useParams } from 'next/navigation';
import { OrderStatusBadge } from '@/components/features/order/OrderStatusBadge';
import { OrderItems } from '@/components/features/order/OrderItems';
import { OrderTracking } from '@/components/features/order/OrderTracking';
import { OrderPaymentInfo } from '@/components/features/order/OrderPaymentInfo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertCircle, ExternalLink, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { toast } from 'sonner';

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const queryClient = useQueryClient();

  const { data: orderData, isLoading: isOrderLoading, isError: isOrderError } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
  });

  const { data: trackingData, isLoading: isTrackingLoading } = useQuery({
    queryKey: ['tracking', orderId],
    queryFn: () => orderService.getTracking(orderId),
    retry: false, // Don't retry if shipment doesn't exist yet
  });

  const confirmReceiptMutation = useMutation({
    mutationFn: () => orderService.confirmReceipt(orderId),
    onSuccess: () => {
      toast.success('Pesanan Selesai', { description: 'Terima kasih telah berbelanja di SmartTani!' });
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
    },
    onError: () => {
      toast.error('Gagal', { description: 'Terjadi kesalahan saat mengonfirmasi pesanan.' });
    },
  });

  if (isOrderLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (isOrderError || !orderData?.data) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Order Tidak Ditemukan</h2>
        <Link href="/orders">
          <Button className="mt-4">Kembali ke Daftar Order</Button>
        </Link>
      </div>
    );
  }

  const order = orderData.data;
  const shippingAddress = order.shipping_address;
  const showConfirmButton = order.status === 'shipped';

  return (
    <div className="container mx-auto px-4 py-8">
      <Link 
        href="/orders" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Kembali ke Daftar Pesanan
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Detail Pesanan</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-gray-500">
            Dibuat pada {format(new Date(order.created_at), 'dd MMMM yyyy, HH:mm', { locale: localeId })}
          </p>
        </div>
        {order.status === 'pending_payment' && order.payment_url && (
          <Link href={order.payment_url} target="_blank">
            <Button className="bg-yellow-600 hover:bg-yellow-700">
              Lanjutkan Pembayaran
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Tracking Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Pengiriman</CardTitle>
            </CardHeader>
            <CardContent>
              {isTrackingLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <OrderTracking history={trackingData?.data?.status_history || []} />
              )}
            </CardContent>
          </Card>

          {/* Items Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Daftar Produk</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderItems items={order.items} />
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Pengiriman</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-bold text-gray-900">{shippingAddress.recipient_name}</p>
                <p className="text-sm text-gray-600">{shippingAddress.phone_number}</p>
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">
                {shippingAddress.full_address}<br />
                {shippingAddress.city}, {shippingAddress.province}, {shippingAddress.postal_code}
              </div>
              {order.notes && (
                <div className="bg-gray-50 p-3 rounded-lg border text-sm text-gray-600 italic">
                  &ldquo;{order.notes}&rdquo;
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg">Ringkasan Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderPaymentInfo order={order} />
            </CardContent>
            {showConfirmButton && (
              <CardContent className="pt-0">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 h-11"
                  onClick={() => confirmReceiptMutation.mutate()}
                  disabled={confirmReceiptMutation.isPending}
                >
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Selesaikan Pesanan
                </Button>
                <p className="text-[10px] text-gray-400 mt-3 text-center">
                  Klik tombol di atas jika Anda sudah menerima barang dengan kondisi baik.
                </p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
