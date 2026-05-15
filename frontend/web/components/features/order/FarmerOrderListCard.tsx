'use client';

import { Order } from '@/services/order';
import { Card, CardContent } from '@/components/ui/card';
import { OrderStatusBadge } from './OrderStatusBadge';
import { ShoppingBag, ChevronRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';

interface FarmerOrderListCardProps {
  order: Order;
  onConfirm: (orderId: string) => void;
  isConfirming: boolean;
}

export function FarmerOrderListCard({ order, onConfirm, isConfirming }: FarmerOrderListCardProps) {
  const farmerSubtotal = order.items.reduce((acc, item) => acc + Number(item.subtotal), 0);
  const showConfirmButton = order.status === 'paid';

  return (
    <Card className="hover:border-green-500 transition-colors overflow-hidden">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">
              {format(new Date(order.created_at), 'dd MMM yyyy, HH:mm', { locale: id })}
            </span>
            <span className="text-xs text-gray-300">|</span>
            <span className="text-xs font-bold text-gray-700">#{order.id.slice(0, 8)}</span>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="space-y-1">
              {order.items.map((item) => (
                <p key={item.id} className="text-sm text-gray-600 truncate">
                  {item.quantity} unit x Produk ID: {item.product_id.slice(0, 8)}
                </p>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t">
              <p className="text-xs text-gray-500">Subtotal Anda</p>
              <p className="text-lg font-bold text-green-600">
                Rp {farmerSubtotal.toLocaleString('id-ID')}
              </p>
            </div>
          </div>

          <div className="flex items-end gap-2">
            {showConfirmButton && (
              <Button 
                size="sm" 
                className="bg-green-600 hover:bg-green-700"
                onClick={(e) => {
                  e.preventDefault();
                  onConfirm(order.id);
                }}
                disabled={isConfirming}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Konfirmasi Order
              </Button>
            )}
            <Link href={`/dashboard/orders/${order.id}`}>
              <Button variant="outline" size="sm">
                Detail
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
