'use client';

import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

export function TransactionHeader() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Riwayat Transaksi</h1>
        <p className="text-muted-foreground">
          Pantau semua arus kas masuk dan keluar dari aktivitas pertanian Anda.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          Cetak Laporan
        </Button>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
