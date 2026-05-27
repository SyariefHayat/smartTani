'use client';

import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';

interface WarehouseHeaderProps {
  onExport?: () => void;
  onAddWarehouse?: () => void;
}

export function WarehouseHeader({ onExport, onAddWarehouse }: WarehouseHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Manajemen Gudang</h1>
        <p className="text-sm text-slate-500 mt-1">
          Kelola lokasi penyimpanan dan kapasitas stok produk Anda.
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onExport} className="cursor-pointer">
          <Download /> Export
        </Button>
        <Button
          onClick={onAddWarehouse}
          className="cursor-pointer bg-slate-900 hover:bg-slate-800 text-white font-semibold"
        >
          <Plus /> Tambah Gudang
        </Button>
      </div>
    </div>
  );
}
