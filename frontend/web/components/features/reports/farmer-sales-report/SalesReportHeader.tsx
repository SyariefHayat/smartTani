'use client';

import { Button } from '@/components/ui/button';
import { Download, FileDown, Printer } from 'lucide-react';
import { DatePickerWithRange } from '@/components/sections/dashboard/farmer/DatePickerRange';

interface SalesReportHeaderProps {
  onExportCSV?: () => void;
  isExporting?: boolean;
}

export function SalesReportHeader({ onExportCSV, isExporting }: SalesReportHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Laporan Penjualan</h1>
        <p className="text-muted-foreground">
          Analisis performa penjualan dan tren pasar produk Anda.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <DatePickerWithRange />
        <Button
          variant="outline"
          className="cursor-pointer text-xs font-semibold text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
          onClick={() => typeof window !== 'undefined' && window.print()}
        >
          <FileDown className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
          PDF
        </Button>
        <Button
          className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
          onClick={onExportCSV}
          disabled={isExporting}
        >
          <Download className="mr-1.5 h-3.5 w-3.5" />
          {isExporting ? 'Mengekspor...' : 'Export CSV'}
        </Button>
      </div>
    </div>
  );
}
