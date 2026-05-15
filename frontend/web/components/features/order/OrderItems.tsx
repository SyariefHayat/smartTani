'use client';

import { OrderItem } from '@/services/order';
import { ShoppingBag } from 'lucide-react';

interface OrderItemsProps {
  items: OrderItem[];
}

export function OrderItems({ items }: OrderItemsProps) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4 py-4 border-b last:border-0">
          <div className="relative w-16 h-16 rounded-lg border overflow-hidden flex-shrink-0 bg-gray-50">
            {/* Note: product details like image/title should ideally be joined or fetched. 
                For now we show what we have in OrderItem. 
                Actually OrderItem in Prisma only has IDs. 
                But in MVP we might have added title/image to OrderItem or we fetch it.
                Looking at order.repository.ts, it doesn't include product details.
            */}
            <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-gray-200" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">Produk ID: {item.product_id.slice(0, 8)}</p>
            <p className="text-xs text-gray-500">
              {item.quantity} x Rp {Number(item.price_per_unit).toLocaleString('id-ID')}
            </p>
          </div>
          <div className="text-sm font-bold text-gray-900">
            Rp {Number(item.subtotal).toLocaleString('id-ID')}
          </div>
        </div>
      ))}
    </div>
  );
}
