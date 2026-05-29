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
import { RefreshCw, AlertTriangle } from 'lucide-react';
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

  const isOffline = !!error;

  React.useEffect(() => {
    if (isOffline) {
      toast.error('Layanan panen sedang offline. Menggunakan data demo lokal.');
    }
  }, [isOffline]);

  const mockHarvests = React.useMemo<FarmerHarvest[]>(
    () => [
      {
        id: 'mock-har-1',
        farmer_id: 'mock-farmer',
        land_id: 'mock-land-1',
        crop_name: 'Padi Pandanwangi',
        quantity: 1200,
        unit: 'kg',
        harvest_date: new Date().toISOString(),
        quality_grade: 'A' as const,
        notes: 'Hasil panen melimpah, kualitas bulir padi sangat baik.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        land: { id: 'mock-land-1', name: 'Lahan Sawah Barat' },
      },
      {
        id: 'mock-har-2',
        farmer_id: 'mock-farmer',
        land_id: 'mock-land-2',
        crop_name: 'Jagung Hibrida',
        quantity: 850,
        unit: 'kg',
        harvest_date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        quality_grade: 'B' as const,
        notes: 'Beberapa jagung terkena ulat tipis, namun secara umum bagus.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        land: { id: 'mock-land-2', name: 'Lahan Jagung Lereng' },
      },
    ],
    []
  );

  const displayedHarvests = React.useMemo(() => {
    if (isOffline || !harvests || harvests.length === 0) {
      return mockHarvests;
    }
    return harvests;
  }, [harvests, isOffline, mockHarvests]);

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
      data: displayedHarvests,
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
  }, [displayedHarvests]);

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
    data: displayedHarvests as FarmerHarvest[],
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
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  React.useEffect(() => {
    table.setPageIndex(0);
  }, [columnFilters]);

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-6">
        <HarvestHeader onExport={handleExport} onAddHarvest={() => setCreateDialogOpen(true)} />

        {isOffline && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 animate-pulse" />
              <p>
                Layanan Panen Offline: Gagal memuat data teraktual. Menggunakan data demo lokal.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold shrink-0 text-[10px] cursor-pointer"
              onClick={() => refetch()}
              disabled={isRefetching}
            >
              {isRefetching ? 'Menghubungkan...' : 'Coba Hubungkan Kembali'}
            </Button>
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 w-full rounded-2xl" />
            ))}
          </div>
        ) : (
          <HarvestStats harvests={displayedHarvests} />
        )}

        <HarvestTable table={table} columnsCount={columns.length} isLoading={isLoading} />
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
