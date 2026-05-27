'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

interface SalesHistoryHeaderProps {
  onExport: () => void;
}

export function SalesHistoryHeader({ onExport }: SalesHistoryHeaderProps) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Riwayat Penjualan</h1>
        <p className="text-muted-foreground text-sm">
          Pantau semua transaksi penjualan yang telah selesai maupun dibatalkan.
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
