'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface StockHeaderProps {
  onExport?: () => void;
}

export function StockHeader({ onExport }: StockHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Stok Produk</h1>
        <p className="text-sm text-slate-500 mt-1">
          Pantau dan kelola persediaan produk pertanian Anda di berbagai lokasi.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onExport} className="cursor-pointer">
          <Download /> Export
        </Button>
      </div>
    </div>
  );
}
