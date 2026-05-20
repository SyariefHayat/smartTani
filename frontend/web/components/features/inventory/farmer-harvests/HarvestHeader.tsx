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
import { HarvestForm } from './HarvestForm';

export function HarvestHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-slate-900">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Manajemen Panen</h1>
        <p className="text-sm text-slate-500">
          Catat hasil panen dari lahan pertanian Anda secara akurat dan berkala.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="border-slate-200">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-green-600 hover:bg-green-700 shadow-sm transition-all hover:shadow-md font-medium">
              <Plus className="mr-2 h-4 w-4" />
              Catat Panen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Catat Hasil Panen Baru</DialogTitle>
              <DialogDescription>
                Masukkan data hasil panen dari lahan tani Anda untuk pendataan dan pelaporan yang
                rapi.
              </DialogDescription>
            </DialogHeader>
            <HarvestForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
