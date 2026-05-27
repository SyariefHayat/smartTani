'use client';

import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

interface TransactionHeaderProps {
  onExportCSV?: () => void;
  onPrintReport?: () => void;
}

export function TransactionHeader({ onExportCSV, onPrintReport }: TransactionHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-900">
          Riwayat Transaksi
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Pantau semua arus kas masuk dan keluar dari aktivitas pertanian Anda secara rinci.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onPrintReport}
          className="cursor-pointer text-xs font-semibold"
        >
          <FileText className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
          Cetak Laporan
        </Button>
        <Button
          variant="outline"
          onClick={onExportCSV}
          className="cursor-pointer text-xs font-semibold"
        >
          <Download className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
          Ekspor CSV
        </Button>
      </div>
    </div>
  );
}
