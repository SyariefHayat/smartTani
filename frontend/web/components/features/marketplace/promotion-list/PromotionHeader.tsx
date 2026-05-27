'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PromotionHeaderProps {
  onAddPromo?: () => void;
}

export function PromotionHeader({ onAddPromo }: PromotionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
      <div className="space-y-1">
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Promo & Diskon</h1>
        <p className="text-sm text-muted-foreground">
          Kelola kampanye pemasaran dan kupon diskon Anda.
        </p>
      </div>
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
        <Button className="w-full sm:w-auto cursor-pointer" onClick={onAddPromo}>
          <Plus /> Buat Promo Baru
        </Button>
      </div>
    </div>
  );
}
