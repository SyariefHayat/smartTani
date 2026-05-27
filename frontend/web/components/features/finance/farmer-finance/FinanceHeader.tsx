'use client';

import { Button } from '@/components/ui/button';
import { Download, ArrowUpRight } from 'lucide-react';

interface FinanceHeaderProps {
  onExport?: () => void;
  onWithdraw?: () => void;
}

export function FinanceHeader({ onExport, onWithdraw }: FinanceHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-900">
          Saldo & Penghasilan
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola pendapatan, monitor histori transaksi, dan tarik saldo hasil penjualan Anda.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          onClick={onExport}
          className="cursor-pointer text-xs font-semibold"
        >
          <Download className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
          Ekspor Laporan
        </Button>
        <Button
          onClick={onWithdraw}
          className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs"
        >
          <ArrowUpRight className="mr-1.5 h-3.5 w-3.5" />
          Tarik Saldo
        </Button>
      </div>
    </div>
  );
}
