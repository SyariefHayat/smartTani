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
import { LandForm } from './LandForm';

export function LandHeader() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manajemen Lahan</h1>
        <p className="text-sm text-slate-500">
          Kelola aset lahan tani Anda, pantau luas, dan status pemanfaatan lahan secara terpadu.
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
              Tambah Lahan
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Data Lahan</DialogTitle>
              <DialogDescription>
                Masukkan informasi detail aset lahan tani Anda untuk pendataan yang akurat.
              </DialogDescription>
            </DialogHeader>
            <LandForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
