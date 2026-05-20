'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PurchaseForm } from './PurchaseForm';

export function PurchaseHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Catatan Pengeluaran</h1>
        <p className="text-sm text-slate-500">
          Pantau dan kelola biaya pembelian benih, pupuk, dan kebutuhan tani lainnya.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="border-slate-200">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 shadow-sm transition-all hover:shadow-md">
              <Plus className="mr-2 h-4 w-4" />
              Tambah Catatan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tambah Catatan Pengeluaran</DialogTitle>
              <DialogDescription>
                Catat pengeluaran Anda untuk mempermudah pemantauan keuangan usaha tani.
              </DialogDescription>
            </DialogHeader>
            <PurchaseForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
