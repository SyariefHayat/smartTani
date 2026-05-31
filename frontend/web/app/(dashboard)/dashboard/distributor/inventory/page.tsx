'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { distributorService, InventoryItem } from '@/services/distributor';

import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardDescription,
  CardFooter,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Boxes, Package, AlertTriangle, Scale, Edit, Search } from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'inv-1',
    distributor_id: 'dist-1',
    product_id: 'prod-001',
    product_title: 'Beras Pandan Wangi Organik',
    product_image: 'https://placehold.co/600x400?text=Beras+Pandan+Wangi',
    quantity_received: 1000,
    quantity_distributed: 850,
    unit: 'kg',
    last_received_at: '2026-05-27T08:00:00Z',
    notes: 'Didistribusikan ke Swalayan Maju Bersama.',
  },
  {
    id: 'inv-2',
    distributor_id: 'dist-1',
    product_id: 'prod-002',
    product_title: 'Wortel Brastagi Segar',
    product_image: 'https://placehold.co/600x400?text=Wortel+Brastagi',
    quantity_received: 500,
    quantity_distributed: 490, // sisa 10 (kritis < 20%)
    unit: 'kg',
    last_received_at: '2026-05-25T14:30:00Z',
    notes: 'Didistribusikan ke pasar tradisional Surabaya.',
  },
  {
    id: 'inv-3',
    distributor_id: 'dist-1',
    product_id: 'prod-004',
    product_title: 'Kentang Dieng Super',
    product_image: 'https://placehold.co/600x400?text=Kentang+Dieng',
    quantity_received: 800,
    quantity_distributed: 200,
    unit: 'kg',
    last_received_at: '2026-05-20T10:00:00Z',
    notes: 'Disalurkan ke industri keripik kentang lokal.',
  },
];

export default function DistributorInventoryPage() {
  const queryClient = useQueryClient();

  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Form states
  const [distributeQty, setDistributeQty] = React.useState(0);
  const [distributeNotes, setDistributeNotes] = React.useState('');

  // Search & Pagination states
  const [searchTerm, setSearchTerm] = React.useState('');
  const [pageIndex, setPageIndex] = React.useState(0);
  const [pageSize] = React.useState(5); // 5 items per page

  // Fetch inventory
  const {
    data: inventoryResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['distributor-inventory'],
    queryFn: async () => {
      const res = await distributorService.getInventory();
      if (!res || !res.inventory || res.inventory.length === 0) throw new Error('Empty');
      return res;
    },
  });

  React.useEffect(() => {
    if (isError) {
      toast.error('Koneksi ke server terputus. Gagal memuat data teraktual.');
    }
  }, [isError]);

  const localInventory = React.useMemo(() => {
    return inventoryResponse?.inventory ?? [];
  }, [inventoryResponse]);

  // Search filter
  const filteredInventory = React.useMemo(() => {
    return localInventory.filter((item) =>
      item.product_title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [localInventory, searchTerm]);

  // Reset pageIndex on search change
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageIndex(0);
  }, [searchTerm]);

  const totalRows = filteredInventory.length;
  const fromRow = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const toRow = Math.min((pageIndex + 1) * pageSize, totalRows);
  const totalPages = Math.ceil(totalRows / pageSize);

  const paginatedInventory = React.useMemo(() => {
    const start = pageIndex * pageSize;
    return filteredInventory.slice(start, start + pageSize);
  }, [filteredInventory, pageIndex, pageSize]);

  // Update Inventory mutation
  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      quantityDistributed,
      notes,
    }: {
      id: string;
      quantityDistributed: number;
      notes: string;
    }) => {
      try {
        await distributorService.updateInventory(id, {
          quantity_distributed: quantityDistributed,
          notes,
        });
        toast.success('Penyaluran stok berhasil diperbarui!');
      } catch {
        // Local simulation
        toast.success('[Simulasi] Persediaan disalurkan!', {
          description: 'Sisa stok gudang distributor berhasil dimutasi.',
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor-inventory'] });
      setIsDialogOpen(false);
      setSelectedItem(null);
    },
  });

  const handleOpenDialog = (item: InventoryItem) => {
    setSelectedItem(item);
    setDistributeQty(item.quantity_distributed);
    setDistributeNotes(item.notes || '');
    setIsDialogOpen(true);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    if (distributeQty < selectedItem.quantity_distributed) {
      toast.error('Gagal memperbarui', {
        description: 'Jumlah terdistribusi tidak boleh berkurang dari catatan sebelumnya.',
      });
      return;
    }

    if (distributeQty > selectedItem.quantity_received) {
      toast.error('Gagal memperbarui', {
        description: 'Jumlah terdistribusi melebihi total barang diterima.',
      });
      return;
    }

    updateMutation.mutate({
      id: selectedItem.id,
      quantityDistributed: distributeQty,
      notes: distributeNotes,
    });
  };

  const totalItemsCount = localInventory.length;
  const totalStockKg = localInventory.reduce(
    (sum, item) => sum + (item.quantity_received - item.quantity_distributed),
    0
  );
  const lowStockCount = localInventory.filter((item) => {
    const remaining = item.quantity_received - item.quantity_distributed;
    return remaining <= item.quantity_received * 0.2; // <= 20%
  }).length;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Stok Distribusi Gudang (Inventory)
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Pantau stok produk pertanian masuk (terima grosir) dan kelola penyaluran (distribusi) ke
          retail toko lokal Anda.
        </p>
      </div>

      {/* Offline banner removed to use per-section red dashed error blocks */}

      {/* KPI Cards Panel (Standardised) */}
      {isError ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat data statistik B2B / Koneksi ke server terputus
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {/* KPI 1: Total Items */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Jenis Komoditas
              </CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                title={`${totalItemsCount} Komoditas`}
              >
                {totalItemsCount} Komoditas
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <Package className="size-4 shrink-0 text-emerald-500" />
                <span className="truncate text-muted-foreground">Komoditas terdaftar terlacak</span>
              </div>
            </CardFooter>
          </Card>

          {/* KPI 2: Total Remaining Weight */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Stok di Gudang
              </CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                title={`${totalStockKg} kg/unit`}
              >
                {totalStockKg} kg/unit
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <Scale className="size-4 shrink-0 text-emerald-500" />
                <span className="truncate text-muted-foreground">Sisa persediaan gudang aktif</span>
              </div>
            </CardFooter>
          </Card>

          {/* KPI 3: Critical Stock */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Komoditas Stok Kritis
              </CardDescription>
              <CardTitle
                className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                title={`${lowStockCount} Komoditas`}
              >
                {lowStockCount} Komoditas
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <AlertTriangle
                  className={`size-4 shrink-0 ${lowStockCount > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}
                />
                <span className="truncate text-muted-foreground">
                  Sisa stok gudang di bawah 20%
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Inventory Table Container */}
      <Card className="w-full overflow-hidden rounded-xl border bg-white shadow-xs">
        <CardHeader className="pb-4 border-b border-slate-100 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between p-6">
          <div className="space-y-1">
            <CardTitle className="text-sm font-bold text-slate-800">
              Daftar Stok Komoditas Gudang
            </CardTitle>
            <CardDescription className="text-xs">
              Kelola penyaluran persediaan produk grosir Anda ke outlet retail.
            </CardDescription>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari komoditas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9.5 text-xs font-semibold border-slate-200 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 w-full rounded-lg bg-white"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isError ? (
            <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
              Gagal memuat data stok distribusi gudang / Koneksi ke server terputus
            </div>
          ) : isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="py-20 text-center">
              <Boxes className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-xs font-bold text-slate-800">Komoditas Tidak Ditemukan</h3>
              <p className="mt-1 text-[11px] text-slate-500 font-semibold">
                Tidak ada komoditas persediaan yang cocok dengan kata kunci &ldquo;{searchTerm}
                &rdquo;.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-hidden rounded-xl border bg-white shadow-xs">
                <Table>
                  <TableHeader className="bg-slate-50/50 border-b border-slate-100">
                    <TableRow>
                      <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-3 pl-4">
                        Produk Komoditas
                      </TableHead>
                      <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                        Stok Masuk
                      </TableHead>
                      <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                        Tersalurkan
                      </TableHead>
                      <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                        Sisa Stok
                      </TableHead>
                      <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                        Status
                      </TableHead>
                      <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                        Terakhir Terima
                      </TableHead>
                      <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                        Catatan Penyaluran
                      </TableHead>
                      <TableHead className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-100">
                    {paginatedInventory.map((item) => {
                      const remaining = item.quantity_received - item.quantity_distributed;
                      const isLow = remaining <= item.quantity_received * 0.2;

                      return (
                        <TableRow key={item.id} className="hover:bg-slate-50/20">
                          {/* Title & image */}
                          <TableCell className="py-3.5 pl-4 flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200/60 bg-slate-50">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={
                                  item.product_image || 'https://placehold.co/600x400?text=Produk'
                                }
                                alt={item.product_title}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                                {item.product_title}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                                Satuan: per {item.unit}
                              </p>
                            </div>
                          </TableCell>

                          {/* Received stock */}
                          <TableCell className="text-xs font-bold text-slate-600 text-right">
                            {item.quantity_received} {item.unit}
                          </TableCell>

                          {/* Distributed stock */}
                          <TableCell className="text-xs font-bold text-slate-600 text-right">
                            {item.quantity_distributed} {item.unit}
                          </TableCell>

                          {/* Remaining stock */}
                          <TableCell className="text-xs font-extrabold text-slate-800 text-right">
                            {remaining} {item.unit}
                          </TableCell>

                          {/* Status badge */}
                          <TableCell className="text-center">
                            <span
                              className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9.5px] font-bold ${
                                isLow
                                  ? 'bg-rose-50 text-rose-700 border-rose-200/50 animate-pulse'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                              }`}
                            >
                              {isLow ? 'Stok Kritis' : 'Stok Aman'}
                            </span>
                          </TableCell>

                          {/* Last Update */}
                          <TableCell className="text-xs font-semibold text-slate-500 text-right">
                            {new Date(item.last_received_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </TableCell>

                          {/* Notes */}
                          <TableCell className="text-xs font-medium text-slate-500 text-center max-w-[150px] truncate px-3">
                            {item.notes || '-'}
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="text-center">
                            <Button
                              size="sm"
                              onClick={() => handleOpenDialog(item)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10.5px] h-7.5 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer mx-auto shadow-sm"
                            >
                              <Edit className="w-3.5 h-3.5" /> Mutasi
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100 mt-4">
                <div className="text-xs font-semibold text-slate-500">
                  {isLoading ? (
                    <div className="h-4 w-48 animate-pulse bg-slate-100 rounded inline-block" />
                  ) : totalRows === 0 ? (
                    '0 komoditas ditemukan'
                  ) : (
                    <>
                      Menampilkan{' '}
                      <span className="font-bold text-slate-900">
                        {fromRow}–{toRow}
                      </span>{' '}
                      dari <span className="font-bold text-slate-900">{totalRows}</span> komoditas
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-slate-700 bg-white"
                    onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={isLoading || pageIndex === 0}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer text-slate-700 bg-white"
                    onClick={() => setPageIndex((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={isLoading || pageIndex >= totalPages - 1 || totalPages <= 1}
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialog for update */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md border-slate-200 bg-white text-slate-900 rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-sm font-bold text-slate-800">
              Mutasi Penyaluran Persediaan
            </DialogTitle>
            <DialogDescription className="text-xs">
              Update jumlah barang terdistribusi dari gudang ke pasar retail.
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <form onSubmit={handleUpdateSubmit} className="space-y-4 pt-3">
              {/* Product Info description */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center gap-3">
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded bg-white border border-slate-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedItem.product_image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="text-xs">
                  <h4 className="font-bold text-slate-800">{selectedItem.product_title}</h4>
                  <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                    Total Terima: {selectedItem.quantity_received} {selectedItem.unit}
                  </p>
                </div>
              </div>

              {/* Distributed qty input */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="distributed-qty"
                  className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block"
                >
                  Jumlah Terdistribusi ({selectedItem.unit})
                </Label>
                <Input
                  id="distributed-qty"
                  type="number"
                  value={distributeQty}
                  onChange={(e) => setDistributeQty(Number(e.target.value))}
                  min={selectedItem.quantity_distributed}
                  max={selectedItem.quantity_received}
                  className="h-10 text-xs font-bold border-slate-200 focus:border-green-500"
                />
                <span className="text-[9.5px] font-semibold text-slate-400 leading-none">
                  Catatan sisa saat ini: {selectedItem.quantity_received - distributeQty}{' '}
                  {selectedItem.unit}
                </span>
              </div>

              {/* Destination notes */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="notes"
                  className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block"
                >
                  Keterangan Penyaluran / Logistik
                </Label>
                <Textarea
                  id="notes"
                  value={distributeNotes}
                  onChange={(e) => setDistributeNotes(e.target.value)}
                  placeholder="Contoh: Didistribusikan ke pasar eceran lokal..."
                  rows={2}
                  className="text-xs font-semibold border-slate-200 focus:border-green-500"
                />
              </div>

              <DialogFooter className="pt-2 border-t border-slate-50 gap-2 sm:gap-0 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-slate-200 text-slate-700 font-bold text-xs h-9 cursor-pointer w-full sm:w-auto"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs h-9 cursor-pointer w-full sm:w-auto shadow-sm"
                  disabled={updateMutation.isPending}
                >
                  Update Mutasi
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
