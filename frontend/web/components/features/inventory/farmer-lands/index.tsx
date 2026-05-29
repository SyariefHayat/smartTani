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
import { LandTable } from './LandTable';
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
import { LandDetailDialog } from './LandDetailDialog';
import { toast } from 'sonner';
import { FarmerLand } from './types';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { exportToCSV } from '@/lib/export-csv';

export function FarmerLandManagement() {
  const queryClient = useQueryClient();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Interactive Dialog States
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [detailLand, setDetailLand] = React.useState<FarmerLand | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = React.useState(false);
  const [editingLand, setEditingLand] = React.useState<FarmerLand | null>(null);
  const [deletingLandId, setDeletingLandId] = React.useState<string | null>(null);

  const {
    data: lands = [],
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['farmer-lands'],
    queryFn: () => landService.getLands(),
  });

  const isOffline = !!error;

  React.useEffect(() => {
    if (isOffline) {
      toast.error('Layanan lahan & tanaman sedang offline. Menggunakan data demo lokal.');
    }
  }, [isOffline]);

  const mockLands = React.useMemo<FarmerLand[]>(
    () => [
      {
        id: 'mock-land-1',
        farmer_id: 'mock-farmer',
        name: 'Lahan Sawah Barat',
        location_province: 'Jawa Timur',
        location_city: 'Sidoarjo',
        location_district: 'Krian',
        full_address: 'Jl. Raya Krian No. 12',
        area_ha: 2.5,
        soil_type: 'Tanah Lempung',
        status: 'active' as const,
        current_crop: 'Padi Pandanwangi',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'mock-land-2',
        farmer_id: 'mock-farmer',
        name: 'Lahan Jagung Lereng',
        location_province: 'Jawa Timur',
        location_city: 'Mojokerto',
        location_district: 'Pacet',
        full_address: 'Dusun Pacet Indah RT 01/RW 02',
        area_ha: 1.8,
        soil_type: 'Tanah Vulkanik',
        status: 'active' as const,
        current_crop: 'Jagung Hibrida',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 'mock-land-3',
        farmer_id: 'mock-farmer',
        name: 'Lahan Bera Selatan',
        location_province: 'Jawa Timur',
        location_city: 'Gresik',
        location_district: 'Driyorejo',
        full_address: 'Jl. Southern Gresik Blok B/9',
        area_ha: 3.0,
        soil_type: 'Tanah Pasir',
        status: 'fallow' as const,
        current_crop: 'Tidak Ada',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ],
    []
  );

  const displayedLands = React.useMemo(() => {
    if (isOffline || !lands || lands.length === 0) {
      return mockLands;
    }
    return lands;
  }, [lands, isOffline, mockLands]);

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

  // Export handler
  const handleExport = React.useCallback(() => {
    if (displayedLands.length === 0) {
      toast.error('Tidak ada data lahan untuk diekspor');
      return;
    }

    const statusLabels: Record<string, string> = {
      active: 'Aktif',
      fallow: 'Bera/Kosong',
      rented: 'Disewakan',
    };

    exportToCSV({
      data: displayedLands,
      columns: [
        { header: 'ID Lahan', accessor: (row) => row.id },
        { header: 'Nama Lahan', accessor: (row) => row.name },
        { header: 'Luas Lahan (Ha)', accessor: (row) => row.area_ha },
        { header: 'Provinsi', accessor: (row) => row.location_province },
        { header: 'Kota/Kabupaten', accessor: (row) => row.location_city },
        { header: 'Kecamatan', accessor: (row) => row.location_district },
        { header: 'Tipe Tanah', accessor: (row) => row.soil_type || '' },
        { header: 'Komoditas Tanaman', accessor: (row) => row.current_crop || '' },
        { header: 'Status Lahan', accessor: (row) => statusLabels[row.status] || row.status },
      ],
      filename: 'daftar_lahan_pertanian',
    });
    toast.success('Data lahan berhasil diekspor');
  }, [displayedLands]);

  // Actions meta callbacks passed to useReactTable options
  const tableActions = React.useMemo(
    () => ({
      onViewDetail: (land: FarmerLand) => {
        setDetailLand(land);
        setDetailDialogOpen(true);
      },
      onEdit: (land: FarmerLand) => setEditingLand(land),
      onDelete: (id: string) => setDeletingLandId(id),
    }),
    []
  );

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: displayedLands as FarmerLand[],
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
        <LandHeader onExport={handleExport} onAddLand={() => setCreateDialogOpen(true)} />

        {isOffline && (
          <div className="flex items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-800 font-semibold shadow-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 animate-pulse" />
              <p>
                Layanan Lahan Offline: Gagal memuat data teraktual. Menggunakan data demo lokal.
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
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : (
          <LandStats lands={displayedLands} />
        )}

        <LandTable table={table} columnsCount={columns.length} isLoading={isLoading} />
      </div>

      {/* View Details Dialog */}
      <LandDetailDialog
        land={detailLand}
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onEdit={() => {
          setDetailDialogOpen(false);
          setEditingLand(detailLand);
        }}
      />

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Data Lahan Baru</DialogTitle>
            <DialogDescription>
              Masukkan informasi detail aset lahan tani Anda untuk pendataan yang akurat.
            </DialogDescription>
          </DialogHeader>
          <LandForm onSuccess={() => setCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

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
            <AlertDialogCancel className="cursor-pointer">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingLandId && deleteMutation.mutate(deletingLandId)}
              className="bg-red-650 text-white hover:bg-red-700 cursor-pointer"
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
