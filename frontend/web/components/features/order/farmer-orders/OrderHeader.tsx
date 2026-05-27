'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface OrderHeaderProps {
  onExport: () => void;
}

export function OrderHeader({ onExport }: OrderHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pesanan Masuk</h1>
        <p className="text-muted-foreground">
          Kelola pesanan dari pembeli dan konfirmasi pengiriman produk Anda.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="cursor-pointer bg-white" onClick={onExport}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
