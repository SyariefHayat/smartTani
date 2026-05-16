'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

export function OrderHeader() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Pesanan Masuk</h1>
        <p className="text-muted-foreground">
          Kelola pesanan dari pembeli dan konfirmasi pengiriman produk Anda.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
    </div>
  );
}
