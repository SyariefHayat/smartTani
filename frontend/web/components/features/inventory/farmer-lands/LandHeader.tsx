'use client';

import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

interface LandHeaderProps {
  onExport?: () => void;
  onAddLand?: () => void;
}

export function LandHeader({ onExport, onAddLand }: LandHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-900">
          Manajemen Lahan
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola aset lahan tani Anda, pantau luas, dan status pemanfaatan lahan secara terpadu.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onExport} className="cursor-pointer">
          <Download /> Export
        </Button>
        <Button
          onClick={onAddLand}
          className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-semibold"
        >
          <Plus /> Tambah Lahan
        </Button>
      </div>
    </div>
  );
}
