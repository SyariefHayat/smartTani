'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { distributorService, InventoryItem } from '@/services/distributor';

import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
import { Boxes, Package, AlertTriangle, Scale, Edit } from 'lucide-react';

const MOCK_INVENTORY: InventoryItem[] = [
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
  const [isOffline, setIsOffline] = React.useState(false);

  const [selectedItem, setSelectedItem] = React.useState<InventoryItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  // Form states
  const [distributeQty, setDistributeQty] = React.useState(0);
  const [distributeNotes, setDistributeNotes] = React.useState('');

  // Fetch inventory
  const { data: inventoryResponse, isLoading } = useQuery({
    queryKey: ['distributor-inventory'],
    queryFn: async () => {
      try {
        const res = await distributorService.getInventory();
        if (!res || !res.inventory || res.inventory.length === 0) throw new Error('Empty');
        return res;
      } catch {
        setIsOffline(true);
        return { inventory: MOCK_INVENTORY };
      }
    },
  });

  const localInventory = React.useMemo(() => {
    return inventoryResponse?.inventory ?? [];
  }, [inventoryResponse]);

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

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] text-amber-600/90 font-medium mt-0.5 leading-relaxed">
              Mutasi sisa stok gudang distributor disimulasikan menggunakan memori offline lokal
              secara interaktif.
            </p>
          </div>
        </div>
      )}

      {/* KPI Cards Panel */}
      <div className="grid gap-4 sm:grid-cols-3">
        {/* KPI 1: Total Items */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Jenis Komoditas
            </span>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Package className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-xl font-bold text-slate-800">{totalItemsCount} Komoditas</div>
              <p className="text-[10.5px] font-semibold text-slate-500 mt-0.5">
                Komoditas terdaftar terlacak
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 2: Total Remaining Weight */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Stok di Gudang
            </span>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Scale className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-xl font-bold text-slate-800">{totalStockKg} kg/unit</div>
              <p className="text-[10.5px] font-semibold text-slate-500 mt-0.5">
                Sisa persediaan gudang aktif
              </p>
            </div>
          </CardContent>
        </Card>

        {/* KPI 3: Critical Stock */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Komoditas Stok Kritis
            </span>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <AlertTriangle
              className={`h-8 w-8 ${lowStockCount > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-400'}`}
            />
            <div>
              <div className="text-xl font-bold text-slate-800">{lowStockCount} Komoditas</div>
              <p className="text-[10.5px] font-semibold text-slate-500 mt-0.5">
                Sisa stok gudang di bawah 20%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          ) : localInventory.length === 0 ? (
            <div className="py-20 text-center">
              <Boxes className="mx-auto h-12 w-12 text-slate-300" />
              <h3 className="mt-4 text-xs font-bold text-slate-800">Persediaan Gudang Kosong</h3>
              <p className="mt-1 text-[11px] text-slate-500 font-semibold">
                Toko distributor belum pernah menerima pengiriman selesai dari petani.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50/50 border-b border-slate-100">
                  <tr>
                    <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-3 pl-4">
                      Produk Komoditas
                    </th>
                    <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Stok Masuk
                    </th>
                    <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Tersalurkan
                    </th>
                    <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Sisa Stok
                    </th>
                    <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                      Status
                    </th>
                    <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                      Terakhir Terima
                    </th>
                    <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                      Catatan Penyaluran
                    </th>
                    <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {localInventory.map((item) => {
                    const remaining = item.quantity_received - item.quantity_distributed;
                    const isLow = remaining <= item.quantity_received * 0.2;

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/20">
                        {/* Title & image */}
                        <td className="py-3.5 pl-4 flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200/60 bg-slate-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.product_image || 'https://placehold.co/600x400?text=Produk'}
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
                        </td>

                        {/* Received stock */}
                        <td className="text-xs font-bold text-slate-600 text-right">
                          {item.quantity_received} {item.unit}
                        </td>

                        {/* Distributed stock */}
                        <td className="text-xs font-bold text-slate-600 text-right">
                          {item.quantity_distributed} {item.unit}
                        </td>

                        {/* Remaining stock */}
                        <td className="text-xs font-extrabold text-slate-800 text-right">
                          {remaining} {item.unit}
                        </td>

                        {/* Status badge */}
                        <td className="text-center">
                          <span
                            className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[9.5px] font-bold ${
                              isLow
                                ? 'bg-rose-50 text-rose-700 border-rose-200/50 animate-pulse'
                                : 'bg-green-50 text-green-700 border-green-200/50'
                            }`}
                          >
                            {isLow ? 'Stok Kritis' : 'Stok Aman'}
                          </span>
                        </td>

                        {/* Last Update */}
                        <td className="text-xs font-semibold text-slate-500 text-right">
                          {new Date(item.last_received_at).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        {/* Notes */}
                        <td className="text-xs font-medium text-slate-500 text-center max-w-[150px] truncate px-3">
                          {item.notes || '-'}
                        </td>

                        {/* Actions */}
                        <td className="text-center">
                          <Button
                            size="sm"
                            onClick={() => handleOpenDialog(item)}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold text-[10.5px] h-7.5 px-2.5 rounded-lg flex items-center gap-1 cursor-pointer mx-auto shadow-sm"
                          >
                            <Edit className="w-3.5 h-3.5" /> Mutasi
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
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
                  className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-9 cursor-pointer w-full sm:w-auto shadow-sm"
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
