'use client';

import { Button } from '@/components/ui/button';
import { Download, ArrowUpRight } from 'lucide-react';

export function FinanceHeader() {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Saldo & Penghasilan</h1>
        <p className="text-muted-foreground">
          Kelola pendapatan dan tarik saldo hasil penjualan Anda.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Laporan
        </Button>
        <Button className="bg-green-600 hover:bg-green-700">
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Tarik Saldo
        </Button>
      </div>
    </div>
  );
}
