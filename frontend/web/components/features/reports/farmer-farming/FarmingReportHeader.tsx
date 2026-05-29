'use client';

import { Button } from '@/components/ui/button';
import { FileText, Filter } from 'lucide-react';
import { DatePickerWithRange } from '@/components/sections/dashboard/farmer/DatePickerRange';

interface FarmingReportHeaderProps {
  onOpenCreateModal: () => void;
  onToggleFilter: () => void;
  isFilterActive: boolean;
}

export function FarmingReportHeader({
  onOpenCreateModal,
  onToggleFilter,
  isFilterActive,
}: FarmingReportHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Laporan Pertanian</h1>
        <p className="text-sm text-slate-500">
          Analisis performa lahan, kesehatan tanaman, dan estimasi hasil panen teraktual.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <DatePickerWithRange />
        <Button
          variant="outline"
          className="cursor-pointer text-xs font-semibold text-slate-700 bg-white border-slate-200 hover:bg-slate-50"
          onClick={onToggleFilter}
        >
          <Filter className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
          Filter
        </Button>
        <Button
          className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs"
          onClick={onOpenCreateModal}
        >
          <FileText className="mr-1.5 h-3.5 w-3.5" />
          Buat Laporan Baru
        </Button>
      </div>
    </div>
  );
}
