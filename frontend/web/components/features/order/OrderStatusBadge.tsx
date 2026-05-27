'use client';

import { cn } from '@/lib/utils';

export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'confirmed_seller'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refund_requested'
  | 'refunded';

interface OrderStatusBadgeProps {
  status: string;
}

const statusConfig: Record<
  string,
  {
    label: string;
    containerClass: string;
    dotClass: string;
  }
> = {
  pending_payment: {
    label: 'Menunggu Pembayaran',
    containerClass: 'border-amber-200 bg-amber-50 text-amber-700',
    dotClass: 'bg-amber-500',
  },
  paid: {
    label: 'Dibayar',
    containerClass: 'border-blue-200 bg-blue-50 text-blue-700',
    dotClass: 'bg-blue-500',
  },
  confirmed_seller: {
    label: 'Dikonfirmasi',
    containerClass: 'border-blue-200 bg-blue-50 text-blue-700',
    dotClass: 'bg-blue-500',
  },
  shipped: {
    label: 'Dikirim',
    containerClass: 'border-blue-200 bg-blue-50 text-blue-700',
    dotClass: 'bg-blue-500',
  },
  delivered: {
    label: 'Selesai',
    containerClass: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dotClass: 'bg-emerald-500',
  },
  cancelled: {
    label: 'Dibatalkan',
    containerClass: 'border-slate-200 bg-slate-50 text-slate-600',
    dotClass: 'bg-slate-400',
  },
  refund_requested: {
    label: 'Refund Diajukan',
    containerClass: 'border-amber-200 bg-amber-50 text-amber-700',
    dotClass: 'bg-amber-500',
  },
  refunded: {
    label: 'Direfund',
    containerClass: 'border-slate-200 bg-slate-50 text-slate-600',
    dotClass: 'bg-slate-400',
  },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    containerClass: 'border-slate-200 bg-slate-50 text-slate-600',
    dotClass: 'bg-slate-400',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap',
        config.containerClass
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotClass)} />
      {config.label}
    </span>
  );
}
