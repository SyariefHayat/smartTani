'use client';

import { Warehouse } from './types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Info, MapPin, Layers, Layout, Clock, Activity, Edit, ShieldAlert } from 'lucide-react';

interface WarehouseDetailDialogProps {
  warehouse?: Warehouse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

export function WarehouseDetailDialog({
  warehouse,
  open,
  onOpenChange,
  onEdit,
}: WarehouseDetailDialogProps) {
  if (!warehouse) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <div className="flex h-40 items-center justify-center">
            <span className="text-sm text-muted-foreground animate-pulse">
              Memuat detail gudang...
            </span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  let capacityColor = 'text-emerald-600';
  let barColor = 'bg-emerald-500';
  if (warehouse.capacity >= 90) {
    capacityColor = 'text-red-600';
    barColor = 'bg-red-500';
  } else if (warehouse.capacity >= 70) {
    capacityColor = 'text-amber-600';
    barColor = 'bg-amber-500';
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl text-slate-900 overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Detail Informasi Gudang
          </DialogTitle>
          <DialogDescription className="mt-1">ID Gudang: {warehouse.id}</DialogDescription>
        </DialogHeader>

        {/* Scrollable grid info card */}
        <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-2 space-y-6 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3 col-span-2">
              <Layout className="h-4.5 w-4.5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Nama Gudang / Penyimpanan</p>
                <p className="font-bold text-base mt-0.5 text-slate-800">{warehouse.name}</p>
                <span className="inline-block text-[11px] font-semibold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full mt-1.5">
                  Tipe Storage: {warehouse.type}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3 col-span-2">
              <ShieldAlert className="h-4.5 w-4.5 text-indigo-500 mt-0.5 shrink-0" />
              <div className="w-full">
                <p className="text-xs font-semibold text-slate-500">Keterisian Kapasitas</p>
                <div className="flex items-center justify-between mt-1">
                  <p className={`font-bold text-sm ${capacityColor}`}>
                    {warehouse.capacity}% Terpakai
                  </p>
                  <p className="text-xs text-slate-400">Tersisa {100 - warehouse.capacity}%</p>
                </div>
                <Progress value={warehouse.capacity} className={`h-2 mt-1.5 [&>div]:${barColor}`} />
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <Layers className="h-4.5 w-4.5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Komoditas</p>
                <p className="font-semibold text-sm mt-0.5 text-slate-800">
                  {warehouse.totalItems} SKU terdaftar
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <Clock className="h-4.5 w-4.5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Update Terakhir</p>
                <p className="font-semibold text-sm mt-0.5 text-slate-850">
                  {new Date(warehouse.lastUpdate).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3 col-span-2">
              <MapPin className="h-4.5 w-4.5 text-teal-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Lokasi Fisik / Alamat</p>
                <p className="font-semibold text-sm mt-0.5 text-slate-800">{warehouse.location}</p>
              </div>
            </div>
          </div>

          {/* Status operasional */}
          <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4 bg-white">
            <div className="flex items-start gap-2.5">
              <Activity className="h-4.5 w-4.5 text-rose-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Status Gudang</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Kondisi operasional gudang penyimpanan saat ini.
                </p>
              </div>
            </div>
            {warehouse.status === 'active' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Aktif
              </span>
            ) : warehouse.status === 'full' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                Penuh
              </span>
            ) : warehouse.status === 'maintenance' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Perbaikan
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                <span className="h-2 w-2 rounded-full bg-slate-400" />
                Nonaktif
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            variant="outline"
            className="cursor-pointer font-semibold text-slate-700"
            onClick={() => onOpenChange(false)}
          >
            Tutup
          </Button>
          <Button
            className="bg-slate-900 text-white hover:bg-slate-800 cursor-pointer font-semibold"
            onClick={onEdit}
          >
            <Edit className="mr-1.5 h-4 w-4" /> Ubah Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
