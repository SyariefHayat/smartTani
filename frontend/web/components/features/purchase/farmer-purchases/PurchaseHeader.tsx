'use client';

import { useState } from 'react';
import { Download, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PurchaseForm } from './PurchaseForm';

interface PurchaseHeaderProps {
  onExport?: () => void;
  onSuccess?: () => void;
}

export function PurchaseHeader({ onExport, onSuccess }: PurchaseHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Catatan Pengeluaran</h1>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Button variant="outline" onClick={onExport} className="cursor-pointer">
          <Download /> Export
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus /> Tambah Catatan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tambah Catatan Pengeluaran</DialogTitle>
              <DialogDescription>
                Catat pengeluaran Anda untuk mempermudah pemantauan keuangan usaha tani.
              </DialogDescription>
            </DialogHeader>
            <PurchaseForm
              onSuccess={() => {
                setOpen(false);
                onSuccess?.();
              }}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
