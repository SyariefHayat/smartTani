'use client';

import { FarmerHarvest } from './types';
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
  Map,
  Sprout,
  Edit,
  FileText,
  CalendarDays,
  BarChart4,
  Award,
  Eye,
} from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface HarvestDetailDialogProps {
  harvest?: FarmerHarvest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

export function HarvestDetailDialog({
  harvest,
  open,
  onOpenChange,
  onEdit,
}: HarvestDetailDialogProps) {
  if (!harvest) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <div className="flex h-40 items-center justify-center">
            <span className="text-sm text-muted-foreground animate-pulse">
              Memuat detail panen...
            </span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const harvestDate = new Date(harvest.harvest_date);
  const formattedDate = format(harvestDate, 'dd MMMM yyyy', { locale: id });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl text-slate-900 overflow-x-hidden">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Detail Catatan Hasil Panen
          </DialogTitle>
          <DialogDescription className="mt-1">ID Panen: {harvest.id}</DialogDescription>
        </DialogHeader>

        {/* Scrollable details grid */}
        <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-2 space-y-6 pt-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3 col-span-2">
              <Map className="h-4.5 w-4.5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Asal Lahan / Blok Tani</p>
                <p className="font-bold text-base mt-0.5 text-slate-800">
                  {harvest.land?.name || 'Lahan Tidak Terdaftar'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <Sprout className="h-4.5 w-4.5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Komoditas Tanaman</p>
                <p className="font-semibold text-sm mt-0.5 text-slate-800">{harvest.crop_name}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <CalendarDays className="h-4.5 w-4.5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Tanggal Panen</p>
                <p className="font-semibold text-sm mt-0.5 text-slate-800">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <BarChart4 className="h-4.5 w-4.5 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Hasil Produksi</p>
                <p className="font-bold text-sm mt-0.5 text-green-600">
                  {harvest.quantity} {harvest.unit}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <Award className="h-4.5 w-4.5 text-rose-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Kualitas Klasifikasi (Grade)</p>
                <div className="mt-1">
                  {harvest.quality_grade === 'A' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Grade A (Sangat Baik)
                    </span>
                  ) : harvest.quality_grade === 'B' ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Grade B (Baik)
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                      Grade C (Cukup)
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {harvest.notes && (
            <div className="rounded-lg border border-slate-150 p-4 bg-slate-50/30 flex gap-2.5">
              <FileText className="h-5 w-5 text-slate-450 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Catatan Khusus</p>
                <p className="text-sm leading-relaxed text-slate-750 mt-1 whitespace-pre-wrap">
                  {harvest.notes}
                </p>
              </div>
            </div>
          )}
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
