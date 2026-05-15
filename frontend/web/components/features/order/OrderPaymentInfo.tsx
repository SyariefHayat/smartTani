'use client';

import { Order } from '@/services/order';

interface OrderPaymentInfoProps {
  order: Order;
}

export function OrderPaymentInfo({ order }: OrderPaymentInfoProps) {
  const subtotal = Number(order.total_amount) - Number(order.platform_fee) - Number(order.shipping_cost);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Total Harga</span>
        <span>Rp {subtotal.toLocaleString('id-ID')}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Biaya Platform</span>
        <span>Rp {Number(order.platform_fee).toLocaleString('id-ID')}</span>
      </div>
      <div className="flex justify-between text-sm text-gray-600">
        <span>Ongkos Kirim</span>
        <span>Rp {Number(order.shipping_cost).toLocaleString('id-ID')}</span>
      </div>
      <div className="pt-3 border-t flex justify-between font-bold text-gray-900">
        <span>Total Belanja</span>
        <span className="text-green-600">Rp {Number(order.total_amount).toLocaleString('id-ID')}</span>
      </div>
    </div>
  );
}
