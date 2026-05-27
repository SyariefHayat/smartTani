'use client';

import { FarmerLand } from './types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Info,
  User,
  Phone,
  Mail,
  MapPin,
  Tractor,
  Sprout,
  Edit,
  FileText,
  ClipboardList,
} from 'lucide-react';

interface LandDetailDialogProps {
  land?: FarmerLand | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

export function LandDetailDialog({ land, open, onOpenChange, onEdit }: LandDetailDialogProps) {
  if (!land) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <div className="flex h-40 items-center justify-center">
            <span className="text-sm text-muted-foreground animate-pulse">
              Memuat detail lahan...
            </span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl text-slate-900 overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Detail Aset Lahan Tani
          </DialogTitle>
          <DialogDescription className="mt-1">ID Lahan: {land.id}</DialogDescription>
        </DialogHeader>

        {/* Scrollable details grid */}
        <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-2 space-y-6 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3 col-span-2">
              <Tractor className="h-4.5 w-4.5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Nama Lahan / Blok</p>
                <p className="font-bold text-base mt-0.5 text-slate-800">{land.name}</p>
                <span className="inline-block text-[11px] font-semibold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full mt-1.5">
                  Luas Wilayah: {land.area_ha} Ha
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <Sprout className="h-4.5 w-4.5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Komoditas Tanaman</p>
                <p className="font-semibold text-sm mt-0.5 text-slate-800">
                  {land.current_crop || 'Bera (Kosong)'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <ClipboardList className="h-4.5 w-4.5 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Kondisi & Tipe Tanah</p>
                <p className="font-semibold text-sm mt-0.5 text-slate-800">
                  {land.soil_type || 'Tidak Terdata'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3 col-span-2">
              <MapPin className="h-4.5 w-4.5 text-teal-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Alamat Lengkap / Koordinat</p>
                <p className="font-semibold text-sm mt-0.5 text-slate-850">
                  Kec. {land.location_district}, {land.location_city}, Prov.{' '}
                  {land.location_province}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          {land.notes && (
            <div className="rounded-lg border border-slate-150 p-4 bg-slate-50/30 flex gap-2.5">
              <FileText className="h-5 w-5 text-slate-450 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Catatan Khusus</p>
                <p className="text-sm leading-relaxed text-slate-750 mt-1 whitespace-pre-wrap">
                  {land.notes}
                </p>
              </div>
            </div>
          )}

          {/* Status operasional */}
          <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4 bg-white">
            <div>
              <p className="text-xs font-semibold text-slate-500">Status Pemanfaatan Lahan</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Menunjukkan status budidaya lahan tani saat ini.
              </p>
            </div>
            {land.status === 'active' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Aktif
              </span>
            ) : land.status === 'fallow' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                Bera/Kosong
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Disewakan
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
