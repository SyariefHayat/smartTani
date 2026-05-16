'use client';

import { CheckCircle2, Clock, Ticket, TrendingDown } from 'lucide-react';
import { Promotion } from './types';

interface PromotionStatsProps {
  promos: Promotion[];
}

export function PromotionStats({ promos }: PromotionStatsProps) {
  // In a real app, these would come from an API or derived from promos
  const activeCount = promos.filter(p => p.status === 'active').length;
  
  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      <div className="rounded-lg border border-green-100 bg-green-50 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-green-600">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-green-700">
              Promo Aktif
            </p>
            <p className="mt-1 text-xl font-semibold text-green-800">{activeCount}</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600">
            <Ticket className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-blue-700">
              Voucher Digunakan
            </p>
            <p className="mt-1 text-xl font-semibold text-blue-800">1,482</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-amber-600">
            <TrendingDown className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-amber-700">
              Total Diskon
            </p>
            <p className="mt-1 text-xl font-semibold text-amber-800">Rp 4.2M</p>
          </div>
        </div>
      </div>
      <div className="rounded-lg border border-violet-100 bg-violet-50 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-violet-700">
              Segera Berakhir
            </p>
            <p className="mt-1 text-xl font-semibold text-violet-800">3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
