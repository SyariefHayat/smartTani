import { Plus, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SupplierHeaderProps {
  onExport?: () => void;
  onAddSupplier?: () => void;
}

export function SupplierHeader({ onExport, onAddSupplier }: SupplierHeaderProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Daftar Supplier</h1>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Button variant="outline" onClick={onExport} className="cursor-pointer">
          <Download className="mr-2 h-4 w-4" /> Export
        </Button>
        <Button onClick={onAddSupplier} className="cursor-pointer">
          <Plus className="mr-2 h-4 w-4" /> Tambah Supplier
        </Button>
      </div>
    </div>
  );
}
