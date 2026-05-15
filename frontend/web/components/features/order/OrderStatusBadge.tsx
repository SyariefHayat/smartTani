'use client';

import { Badge } from '@/components/ui/badge';

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

const statusConfig: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info' }> = {
  pending_payment: { label: 'Menunggu Pembayaran', variant: 'warning' },
  paid: { label: 'Dibayar', variant: 'info' },
  confirmed_seller: { label: 'Dikonfirmasi', variant: 'info' },
  shipped: { label: 'Dikirim', variant: 'info' },
  delivered: { label: 'Selesai', variant: 'success' },
  cancelled: { label: 'Dibatalkan', variant: 'destructive' },
  refund_requested: { label: 'Refund Diajukan', variant: 'warning' },
  refunded: { label: 'Direfund', variant: 'secondary' },
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || { label: status, variant: 'outline' };
  
  return (
    <Badge variant={config.variant as 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'info'}>
      {config.label}
    </Badge>
  );
}
