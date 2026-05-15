'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService, Order } from '@/services/order';
import { FarmerOrderListCard } from '@/components/features/order/FarmerOrderListCard';
import { OrderFilter } from '@/components/features/order/OrderFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function FarmerOrdersPage() {
  const [status, setStatus] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading, isError } = useQuery({
    queryKey: ['farmer-orders', status],
    queryFn: () => orderService.getOrders({ 
      status: status === 'all' ? undefined : status 
    }),
  });

  const confirmOrderMutation = useMutation({
    mutationFn: (orderId: string) => orderService.confirmOrder(orderId),
    onSuccess: () => {
      toast.success('Order Dikonfirmasi', { description: 'Status order telah diperbarui.' });
      queryClient.invalidateQueries({ queryKey: ['farmer-orders'] });
    },
    onError: () => {
      toast.error('Gagal', { description: 'Gagal mengonfirmasi order.' });
    },
  });

  const orders: Order[] = ordersData?.data?.orders || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Order Masuk</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Gagal memuat daftar order</h2>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Muat Ulang
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Order Masuk</h1>

      <OrderFilter status={status} onStatusChange={setStatus} />

      {orders.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Belum Ada Order</h2>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Belum ada pesanan masuk untuk produk Anda. Pastikan produk Anda dalam status aktif dan stok mencukupi.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <FarmerOrderListCard 
              key={order.id} 
              order={order} 
              onConfirm={(id) => confirmOrderMutation.mutate(id)}
              isConfirming={confirmOrderMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}
