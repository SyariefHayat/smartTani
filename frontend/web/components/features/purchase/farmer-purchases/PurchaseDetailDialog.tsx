'use client';

import { PurchaseRecord } from './types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarDays, Store, ShoppingBag, Wallet, FileText, Edit, Info } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface PurchaseDetailDialogProps {
  purchase?: PurchaseRecord | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
}

export function PurchaseDetailDialog({
  purchase,
  open,
  onOpenChange,
  onEdit,
}: PurchaseDetailDialogProps) {
  if (!purchase) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-lg">
          <div className="flex h-40 items-center justify-center">
            <span className="text-sm text-muted-foreground animate-pulse">
              Memuat detail pengeluaran...
            </span>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const amount = parseFloat(String(purchase.total_cost));
  const formattedCost = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount);

  const purchaseDate = new Date(purchase.purchase_date);
  const formattedDate = format(purchaseDate, 'dd MMMM yyyy HH:mm', { locale: id });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl text-slate-900">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <Info className="h-5 w-5 text-blue-500" />
            Detail Catatan Pengeluaran
          </DialogTitle>
          <DialogDescription className="mt-1">ID Catatan: {purchase.id}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <CalendarDays className="h-4.5 w-4.5 text-blue-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Tanggal & Waktu</p>
                <p className="font-semibold text-sm mt-0.5 text-slate-800">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <Wallet className="h-4.5 w-4.5 text-emerald-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Total Pengeluaran</p>
                <p className="font-bold text-sm mt-0.5 text-emerald-600">{formattedCost}</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <ShoppingBag className="h-4.5 w-4.5 text-amber-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Nama Barang</p>
                <p className="font-semibold text-sm mt-0.5 text-slate-800">{purchase.item_name}</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Jumlah: {purchase.quantity} {purchase.unit}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <Store className="h-4.5 w-4.5 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-slate-500">Nama Pemasok</p>
                <p className="font-semibold text-sm mt-0.5 text-slate-800">
                  {purchase.supplier_name}
                </p>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-lg border border-slate-100 p-4 bg-white space-y-1">
            <p className="text-xs font-semibold text-slate-500">Catatan</p>
            <p className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
              {purchase.notes || 'Tidak ada catatan khusus.'}
            </p>
          </div>

          {/* Receipt URL / Bukti Nota */}
          {purchase.receipt_url && (
            <div className="rounded-lg border border-slate-100 p-4 bg-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-600 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-500">Bukti Pembelian / Nota</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tersedia dokumen bukti nota digital.
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="cursor-pointer border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => window.open(purchase.receipt_url, '_blank')}
              >
                Lihat Bukti
              </Button>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              className="cursor-pointer"
              onClick={() => onOpenChange(false)}
            >
              Tutup
            </Button>
            <Button
              className="bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
              onClick={onEdit}
            >
              <Edit className="mr-1.5 h-4 w-4" /> Ubah Data
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
