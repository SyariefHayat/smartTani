'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { orderService, Order } from '@/services/order';
import { OrderListCard } from '@/components/features/order/OrderListCard';
import { OrderFilter } from '@/components/features/order/OrderFilter';
import { Skeleton } from '@/components/ui/skeleton';
import { ShoppingBag, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function OrdersPage() {
  const [status, setStatus] = useState<string>('all');

  const { data: ordersData, isLoading, isError } = useQuery({
    queryKey: ['orders', status],
    queryFn: () => orderService.getOrders({ 
      status: status === 'all' ? undefined : status 
    }),
  });

  const orders: Order[] = ordersData?.data?.orders || [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8">Daftar Pesanan</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold">Gagal memuat daftar pesanan</h2>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Muat Ulang
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Daftar Pesanan</h1>
      </div>

      <OrderFilter status={status} onStatusChange={setStatus} />

      {orders.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center">
          <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-10 h-10 text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Belum Ada Pesanan</h2>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Sepertinya Anda belum melakukan pemesanan. Ayo mulai belanja produk agrikultur terbaik sekarang!
          </p>
          <Link href="/marketplace">
            <Button className="mt-8 bg-green-600 hover:bg-green-700">
              Belanja Sekarang
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {orders.map((order) => (
            <OrderListCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
