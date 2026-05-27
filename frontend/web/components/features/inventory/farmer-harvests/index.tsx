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

import { HarvestHeader } from './HarvestHeader';
import { HarvestStats } from './HarvestStats';
import { HarvestTable } from './HarvestTable';
import { columns } from './columns';
import { harvestService } from '@/services/harvest';
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
import { Button } from '@/components/ui/button';
import { HarvestForm } from './HarvestForm';
import { HarvestDetailDialog } from './HarvestDetailDialog';
import { toast } from 'sonner';
import { FarmerHarvest, HarvestTableActions } from './types';
import { RefreshCw } from 'lucide-react';
import { exportToCSV } from '@/lib/export-csv';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export function FarmerHarvestManagement() {
  const queryClient = useQueryClient();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Interactive Dialog States
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [detailHarvest, setDetailHarvest] = React.useState<FarmerHarvest | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [editingHarvest, setEditingHarvest] = React.useState<FarmerHarvest | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteHarvest, setDeleteHarvest] = React.useState<FarmerHarvest | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const {
    data: harvests = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['farmer-harvests'],
    queryFn: () => harvestService.getHarvests(),
  });

  const deleteMutation = useMutation({
    mutationFn: (harvestId: string) => harvestService.deleteHarvest(harvestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farmer-harvests'] });
      toast.success('Catatan panen berhasil dihapus');
      setDeleteHarvest(null);
      setDeleteDialogOpen(false);
    },
    onError: (err: unknown) => {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const errMsg = axiosError.response?.data?.message || 'Gagal menghapus catatan panen';
      toast.error(errMsg);
    },
  });

  // Export handler
  const handleExport = React.useCallback(() => {
    const qualityLabels: Record<string, string> = {
      A: 'Grade A',
      B: 'Grade B',
      C: 'Grade C',
    };

    exportToCSV({
      data: harvests,
      columns: [
        { header: 'ID Panen', accessor: (row) => row.id },
        { header: 'Lahan', accessor: (row) => row.land?.name || 'Lahan Utama' },
        { header: 'Komoditas', accessor: (row) => row.crop_name },
        {
          header: 'Tanggal Panen',
          accessor: (row) => format(new Date(row.harvest_date), 'dd MMM yyyy', { locale: id }),
        },
        { header: 'Kuantitas', accessor: (row) => row.quantity },
        { header: 'Satuan', accessor: (row) => row.unit },
        {
          header: 'Kualitas',
          accessor: (row) => qualityLabels[row.quality_grade] || row.quality_grade,
        },
        { header: 'Catatan', accessor: (row) => row.notes || '-' },
      ],
      filename: 'daftar_hasil_panen',
    });
    toast.success('Daftar hasil panen berhasil diekspor');
  }, [harvests]);

  // Actions meta callbacks passed to react-table options
  const tableActions: HarvestTableActions = React.useMemo(
    () => ({
      onViewDetail: (harvest) => {
        setDetailHarvest(harvest);
        setDetailDialogOpen(true);
      },
      onEdit: (harvest) => {
        setEditingHarvest(harvest);
        setEditDialogOpen(true);
      },
      onDelete: (harvest) => {
        setDeleteHarvest(harvest);
        setDeleteDialogOpen(true);
      },
    }),
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: harvests as FarmerHarvest[],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    meta: tableActions,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (error) {
    return (
      <div className="flex w-full h-[350px] flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 text-red-500 p-6 text-center text-sm font-medium shadow-xs">
        <svg
          className="w-10 h-10 mb-3 text-red-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="font-semibold text-base mb-1">Gagal Memuat Catatan Panen</p>
        <p className="text-xs text-red-400 max-w-md mb-4">
          Layanan/Service tidak merespon atau sedang tidak aktif. Harap periksa koneksi Anda atau
          hubungi administrator.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer border-red-200 text-red-500 hover:bg-red-100 hover:text-red-600"
          onClick={() => refetch()}
          disabled={isRefetching}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`} />
          {isRefetching ? 'Mencoba ulang...' : 'Coba Lagi'}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        <HarvestHeader onExport={handleExport} onAddHarvest={() => setCreateDialogOpen(true)} />

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <HarvestStats harvests={harvests} />
        )}

        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        ) : (
          <HarvestTable table={table} columnsCount={columns.length} />
        )}
      </div>

      {/* View Details Dialog */}
      <HarvestDetailDialog
        harvest={detailHarvest}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onEdit={() => {
          setDetailDialogOpen(false);
          setEditingHarvest(detailHarvest);
          setEditDialogOpen(true);
        }}
      />

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Catat Hasil Panen Baru</DialogTitle>
            <DialogDescription>
              Masukkan data hasil panen dari lahan tani Anda untuk pendataan dan pelaporan yang
              rapi.
            </DialogDescription>
          </DialogHeader>
          <HarvestForm
            onSuccess={() => {
              setCreateDialogOpen(false);
              queryClient.invalidateQueries({ queryKey: ['farmer-harvests'] });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditingHarvest(null);
        }}
      >
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Catatan Panen</DialogTitle>
            <DialogDescription>Perbarui data panen hasil tani Anda.</DialogDescription>
          </DialogHeader>
          {editingHarvest && (
            <HarvestForm
              initialData={editingHarvest}
              onSuccess={() => {
                setEditDialogOpen(false);
                setEditingHarvest(null);
                queryClient.invalidateQueries({ queryKey: ['farmer-harvests'] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Catatan Panen?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus catatan panen komoditas{' '}
              <strong>{deleteHarvest?.crop_name}</strong> dari sistem? Tindakan ini akan menghapus
              data secara permanen dari daftar panen Anda.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white hover:bg-red-700 cursor-pointer"
              onClick={() => deleteHarvest && deleteMutation.mutate(deleteHarvest.id)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Menghapus...' : 'Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
