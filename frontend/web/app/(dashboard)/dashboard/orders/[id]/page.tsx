'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order';
import { useParams } from 'next/navigation';
import { OrderStatusBadge } from '@/components/features/order/OrderStatusBadge';
import { OrderItems } from '@/components/features/order/OrderItems';
import { OrderTracking } from '@/components/features/order/OrderTracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { toast } from 'sonner';

export default function FarmerOrderDetailPage() {
  const params = useParams();
  const orderId = params.id as string;
  const queryClient = useQueryClient();

  const { data: orderData, isLoading: isOrderLoading, isError: isOrderError } = useQuery({
    queryKey: ['farmer-order', orderId],
    queryFn: () => orderService.getOrderById(orderId),
  });

  const { data: trackingData, isLoading: isTrackingLoading } = useQuery({
    queryKey: ['tracking', orderId],
    queryFn: () => orderService.getTracking(orderId),
    retry: false,
  });

  const confirmOrderMutation = useMutation({
    mutationFn: () => orderService.confirmOrder(orderId),
    onSuccess: () => {
      toast.success('Order Dikonfirmasi', { description: 'Status order telah diperbarui.' });
      queryClient.invalidateQueries({ queryKey: ['farmer-order', orderId] });
    },
    onError: () => {
      toast.error('Gagal', { description: 'Terjadi kesalahan saat mengonfirmasi order.' });
    },
  });

  if (isOrderLoading) {
    return (
      <div className="space-y-8">
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
      <div className="py-20 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Order Tidak Ditemukan</h2>
        <Link href="/dashboard/orders">
          <Button className="mt-4">Kembali ke Daftar Order</Button>
        </Link>
      </div>
    );
  }

  const order = orderData.data;
  const shippingAddress = order.shipping_address;
  const farmerSubtotal = order.items.reduce((acc, item) => acc + Number(item.subtotal), 0);
  const showConfirmButton = order.status === 'paid';

  return (
    <div className="space-y-6">
      <Link 
        href="/dashboard/orders" 
        className="inline-flex items-center text-sm text-gray-500 hover:text-green-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        Kembali ke Daftar Order
      </Link>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Detail Order Masuk</h1>
            <OrderStatusBadge status={order.status} />
          </div>
          <p className="text-sm text-gray-500">
            Diterima pada {format(new Date(order.created_at), 'dd MMMM yyyy, HH:mm', { locale: localeId })}
          </p>
        </div>
        {showConfirmButton && (
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => confirmOrderMutation.mutate()}
            disabled={confirmOrderMutation.isPending}
          >
            <CheckCircle className="w-5 h-5 mr-2" />
            Konfirmasi Order
          </Button>
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
              <CardTitle className="text-lg">Produk Anda dalam Order Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderItems items={order.items} />
              <div className="mt-4 pt-4 border-t flex justify-between items-center">
                <p className="font-medium text-gray-600">Total Penghasilan Anda</p>
                <p className="text-xl font-bold text-green-600">
                  Rp {farmerSubtotal.toLocaleString('id-ID')}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
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
      </div>
    </div>
  );
}
