'use client';

import { Order } from '@/services/order';
import { Card, CardContent } from '@/components/ui/card';
import { OrderStatusBadge } from './OrderStatusBadge';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface OrderListCardProps {
  order: Order;
}

export function OrderListCard({ order }: OrderListCardProps) {
  const otherItemsCount = order.items.length - 1;

  return (
    <Link href={`/orders/${order.id}`}>
      <Card className="hover:border-green-500 transition-colors cursor-pointer overflow-hidden">
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-gray-400" />
              <span className="text-xs font-medium text-gray-500">
                {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
              </span>
            </div>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                Pesanan #{order.id.slice(0, 8)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {otherItemsCount > 0 
                  ? `Berisi ${order.items.length} produk`
                  : 'Berisi 1 produk'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Total Belanja</p>
              <p className="text-sm font-bold text-green-600">
                Rp {order.total_amount.toLocaleString('id-ID')}
              </p>
            </div>
            <div className="flex items-center text-gray-400">
              <ChevronRight className="w-5 h-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
