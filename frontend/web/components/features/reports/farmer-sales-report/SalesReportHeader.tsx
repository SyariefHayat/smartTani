'use client';

import { Button } from '@/components/ui/button';
import { Download, FileDown, Printer } from 'lucide-react';
import { DatePickerWithRange } from '@/components/sections/dashboard/farmer/DatePickerRange';

export function SalesReportHeader() {
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
        <Button variant="outline" size="icon" title="Cetak Laporan">
          <Printer className="h-4 w-4" />
        </Button>
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          PDF
        </Button>
        <Button className="bg-green-600 hover:bg-green-700">
          <Download className="mr-2 h-4 w-4" />
          Export CSV
        </Button>
      </div>
    </div>
  );
}
