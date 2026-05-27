'use client';

import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

interface HarvestHeaderProps {
  onExport?: () => void;
  onAddHarvest?: () => void;
}

export function HarvestHeader({ onExport, onAddHarvest }: HarvestHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-900">
          Manajemen Panen
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Catat hasil panen dari lahan pertanian Anda secara akurat dan berkala.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onExport} className="cursor-pointer">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
        <Button
          onClick={onAddHarvest}
          className="cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
        >
          <Plus className="mr-2 h-4 w-4" /> Catat Hasil Panen
        </Button>
      </div>
    </div>
  );
}
