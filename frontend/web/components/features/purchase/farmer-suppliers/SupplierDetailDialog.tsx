'use client';

import { Supplier } from './types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Info, User, Phone, Mail, MapPin, Truck, HelpCircle, Edit } from 'lucide-react';

interface SupplierDetailDialogProps {
  supplier?: Supplier | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

export function SupplierDetailDialog({
  supplier,
  open,
  onOpenChange,
  onEdit,
}: SupplierDetailDialogProps) {
  if (!supplier) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <div className="flex h-40 items-center justify-center">
            <span className="text-sm text-muted-foreground animate-pulse">
              Memuat detail supplier...
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
            Profil Detail Supplier
          </DialogTitle>
          <DialogDescription className="mt-1">ID Supplier: {supplier.id}</DialogDescription>
        </DialogHeader>

        {/* Scrollable container with vertical-only scroll */}
        <div className="max-h-[60vh] overflow-y-auto overflow-x-hidden pr-2 space-y-6 pt-2">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3 col-span-2">
              <User className="h-4.5 w-4.5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Nama Supplier / Perusahaan</p>
                <p className="font-bold text-base mt-0.5 text-slate-800">{supplier.name}</p>
                <span className="inline-block text-[11px] font-semibold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-full mt-1.5">
                  Kategori: {supplier.category}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <HelpCircle className="h-4.5 w-4.5 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Kontak Utama</p>
                <p className="font-semibold text-sm mt-0.5 text-slate-800">
                  {supplier.contactPerson}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <Truck className="h-4.5 w-4.5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Transaksi</p>
                <p className="font-semibold text-sm mt-0.5 text-emerald-600">
                  {supplier.totalOrders} Transaksi
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <Phone className="h-4.5 w-4.5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Nomor Telepon</p>
                <p className="font-semibold text-sm mt-0.5 text-slate-800">{supplier.phone}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <Mail className="h-4.5 w-4.5 text-rose-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Email</p>
                <p
                  className="font-semibold text-sm text-slate-800 truncate max-w-[170px]"
                  title={supplier.email}
                >
                  {supplier.email || '-'}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3 col-span-2">
              <MapPin className="h-4.5 w-4.5 text-teal-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Lokasi / Wilayah</p>
                <p className="font-semibold text-sm mt-0.5 text-slate-800">{supplier.location}</p>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between rounded-lg border border-slate-100 p-4 bg-white">
            <div>
              <p className="text-xs font-semibold text-slate-500">Status Operasional</p>
              <p className="text-xs text-slate-400 mt-0.5">
                Menunjukkan keaktifan supply saat ini.
              </p>
            </div>
            {supplier.status === 'active' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Aktif
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                Nonaktif
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
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
