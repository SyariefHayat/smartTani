'use client';

import { Button } from '@/components/ui/button';
import { Download, FileDown } from 'lucide-react';

export function SalesHistoryHeader() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Riwayat Penjualan</h1>
        <p className="text-muted-foreground text-sm">
          Pantau semua transaksi penjualan yang telah selesai maupun dibatalkan.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="h-9 border-slate-200">
          <FileDown className="mr-2 h-4 w-4 text-slate-500" />
          Ekspor PDF
        </Button>
        <Button size="sm" className="h-9 bg-emerald-600 hover:bg-emerald-700">
          <Download className="mr-2 h-4 w-4" />
          Download CSV
        </Button>
      </div>
    </div>
  );
}
