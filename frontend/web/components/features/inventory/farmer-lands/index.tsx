'use client';

import * as React from 'react';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { LandHeader } from './LandHeader';
import { LandStats } from './LandStats';
import { LandFilters } from './LandFilters';
import { WarehouseTable } from '../farmer-warehouse/WarehouseTable';
import { columns } from './columns';
import { landService } from '@/services/land';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LandForm } from './LandForm';
import { toast } from 'sonner';
import { FarmerLand } from './types';

export function FarmerLandManagement() {
  const queryClient = useQueryClient();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [editingLand, setEditingLand] = React.useState<FarmerLand | null>(null);
  const [deletingLandId, setDeletingLandId] = React.useState<string | null>(null);

  const {
    data: lands = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['farmer-lands'],
    queryFn: () => landService.getLands(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => landService.deleteLand(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-lands'] });
      toast.success('Lahan berhasil dihapus');
      setDeletingLandId(null);
    },
    onError: () => {
      toast.error('Gagal menghapus lahan');
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: lands,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    meta: {
      onEdit: (land: FarmerLand) => setEditingLand(land),
      onDelete: (id: string) => setDeletingLandId(id),
    },
  });

  if (error) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
        <p className="text-destructive font-medium">Gagal mengambil data lahan</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-green-600 hover:underline font-medium"
        >
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        <LandHeader />

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <LandStats lands={lands} />
        )}

        <div className="space-y-4">
          <LandFilters table={table} />
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <WarehouseTable table={table} columnsCount={columns.length} />
          )}
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editingLand} onOpenChange={(open) => !open && setEditingLand(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Data Lahan</DialogTitle>
            <DialogDescription>Perbarui informasi aset lahan tani Anda.</DialogDescription>
          </DialogHeader>
          {editingLand && (
            <LandForm initialData={editingLand} onSuccess={() => setEditingLand(null)} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog
        open={!!deletingLandId}
        onOpenChange={(open) => !open && setDeletingLandId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Data Lahan?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Data lahan akan dihapus secara permanen dari
              sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingLandId && deleteMutation.mutate(deletingLandId)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
