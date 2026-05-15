'use client';

import { ShipmentStatus } from '@/services/order';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Circle, Package, Truck, Home, LucideIcon } from 'lucide-react';

interface OrderTrackingProps {
  history: ShipmentStatus[];
}

const statusIcons: Record<string, LucideIcon> = {
  pending_pickup: Package,
  picked_up: Truck,
  in_transit: Truck,
  delivered: Home,
};

export function OrderTracking({ history }: OrderTrackingProps) {
  if (!history || history.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500 italic">
        Informasi pengiriman belum tersedia.
      </div>
    );
  }

  // Sort history by timestamp descending
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  return (
    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-green-500 before:via-green-200 before:to-gray-100">
      {sortedHistory.map((step, index) => {
        const Icon = statusIcons[step.status] || Circle;
        const isLatest = index === 0;

        return (
          <div key={index} className="relative flex items-start gap-6">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white ${isLatest ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex flex-col pt-1">
              <p className={`text-sm font-bold ${isLatest ? 'text-green-600' : 'text-gray-900'}`}>
                {step.notes || step.status.replace('_', ' ').toUpperCase()}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {format(new Date(step.timestamp), 'dd MMM yyyy, HH:mm', { locale: id })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
