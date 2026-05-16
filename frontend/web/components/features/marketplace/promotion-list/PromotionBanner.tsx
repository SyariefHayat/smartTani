'use client';

import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PromotionBanner() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="flex gap-4 rounded-xl border border-amber-100 bg-amber-50 p-5">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-sm">
          <AlertCircle className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-amber-900">Tips Promo Berhasil</h4>
          <p className="text-xs leading-relaxed text-amber-700">
            Promo dengan kode yang mudah diingat dan nilai diskon minimal 10% terbukti
            meningkatkan konversi penjualan hingga 2.5 kali lipat.
          </p>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-green-800 p-6 text-white shadow-lg">
        <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <h4 className="text-lg font-bold">Butuh Bantuan?</h4>
            <p className="max-w-[240px] text-xs leading-relaxed text-green-100">
              Konsultasikan strategi promosi toko Anda dengan tim ahli marketplace SmartTani.
            </p>
          </div>
          <Button
            size="sm"
            className="h-8 bg-white px-4 text-[10px] font-bold text-green-800 hover:bg-green-50"
          >
            Hubungi Ahli
          </Button>
        </div>
        <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
      </div>
    </div>
  );
}
