'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logisticsService, IShipment } from '@/services/logistics';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  AlertTriangle,
  RefreshCw,
  ClipboardList,
  MapPin,
  User,
  ArrowRight,
  Package,
} from 'lucide-react';
import Link from 'next/link';

export default function LogisticsPendingPage() {
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const queryClient = useQueryClient();
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);
  const [pickupNotes, setPickupNotes] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Fetch pending shipments with a 30s auto-polling interval
  const {
    data: shipmentsResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['logistics-pending-shipments'],
    queryFn: () => logisticsService.getShipments({ status: 'pending_pickup', limit: 30 }),
    refetchInterval: 30000,
  });

  const isQueryError = isError;

  const rawPending = (shipmentsResponse?.data?.shipments || []) as IShipment[];

  const pickupMutation = useMutation({
    mutationFn: ({ orderId, notes }: { orderId: string; notes?: string }) =>
      logisticsService.pickupShipment(orderId, notes),
    onSuccess: (response, variables) => {
      toast.success(`Paket #${variables.orderId} berhasil di-pickup!`, {
        description: 'Status berubah menjadi Diambil. Mulai pengiriman di menu Dalam Perjalanan.',
      });
      // Invalidate queries to refresh state
      queryClient.invalidateQueries({ queryKey: ['logistics-pending-shipments'] });
      queryClient.invalidateQueries({ queryKey: ['logistics-analytics-overview'] });
      setDialogOpen(false);
      setPickupNotes('');
      setSelectedOrderId(null);
    },
    onError: () => {
      toast.error('Gagal memproses pickup paket. Silakan coba lagi.');
    },
  });

  const triggerPickup = (orderId: string) => {
    setSelectedOrderId(orderId);
    setDialogOpen(true);
  };

  const handleConfirmPickup = () => {
    if (!selectedOrderId) return;

    pickupMutation.mutate({ orderId: selectedOrderId, notes: pickupNotes });
  };

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Menunggu Pickup</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Daftar paket pesanan hasil tani yang siap diambil di lahan/greenhouse petani Lamongan.
          </p>
        </div>
        <div className="text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
          Auto-update antrean aktif (Polling 30s)
        </div>
      </div>

      {/* Query Error State */}
      {isQueryError ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 p-8 text-center text-red-500 font-semibold text-sm">
          <AlertTriangle className="h-8 w-8 text-red-600 mb-2 animate-pulse" />
          <p className="font-bold">Gagal memuat data antrean pickup</p>
          <p className="text-xs text-red-400 font-normal mt-1 mb-4">
            Koneksi ke server Layanan Logistik terputus. Silakan periksa jaringan Anda atau coba
            hubungkan kembali.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold text-xs"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Coba Hubungkan Kembali
          </Button>
        </div>
      ) : rawPending.length === 0 ? (
        /* Empty State */
        <div className="py-24 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
          <ClipboardList className="w-12 h-12 mx-auto mb-4 text-slate-300 opacity-60" />
          <p className="text-xs font-bold text-slate-700">Semua Paket Selesai Di-pickup! 🎉</p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            Tidak ada paket pesanan baru menunggu pickup saat ini.
          </p>
        </div>
      ) : (
        /* Cards list */
        <div className="grid gap-6 md:grid-cols-2">
          {rawPending.map((ship) => {
            const timeAgo = Math.round((now - new Date(ship.created_at).getTime()) / (1000 * 60));
            const relativeTimeStr =
              timeAgo < 60 ? `${timeAgo} menit lalu` : `${Math.round(timeAgo / 60)} jam lalu`;

            return (
              <Card
                key={ship.id}
                className="border-slate-200 shadow-xs bg-white hover:border-slate-300 transition-all flex flex-col justify-between rounded-xl"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-50 border border-slate-200 rounded-md px-2 py-0.5">
                      Order ID: #{ship.order_id}
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-bold flex items-center gap-1 shrink-0">
                      Tugas Masuk: {relativeTimeStr}
                    </span>
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-800">
                    Pickup Lahan Petani
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-4 space-y-4 flex-1">
                  {/* Pickup address */}
                  <div className="flex gap-2.5 items-start">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Alamat Ambil (Petani)
                      </span>
                      <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                        {ship.pickup_address.city}
                      </span>
                      <span className="text-[11px] text-slate-500 block leading-normal mt-0.5">
                        {ship.pickup_address.full_address}
                      </span>
                    </div>
                  </div>

                  {/* Delivery address */}
                  <div className="flex gap-2.5 items-start">
                    <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Tujuan (Pembeli)
                      </span>
                      <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                        {ship.delivery_address.recipient_name}
                      </span>
                      <span className="text-[11px] text-slate-500 block leading-normal mt-0.5">
                        Kirim ke: {ship.delivery_address.city}
                      </span>
                    </div>
                  </div>

                  {/* Divider line */}
                  <div className="border-t border-slate-100" />

                  {/* Package Qty */}
                  <div className="flex gap-2.5 items-center">
                    <Package className="w-4 h-4 text-slate-400 shrink-0" />
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
                      <span>Kuantitas Paket:</span>
                      <span className="text-slate-800 font-bold">
                        {ship.items_count} Item Tanaman
                      </span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-3 border-t border-slate-100 flex gap-3">
                  <Link href={`/dashboard/logistik/shipments/${ship.order_id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full text-xs font-bold text-slate-700 border-slate-200 hover:bg-slate-50 cursor-pointer h-10 rounded-lg"
                    >
                      Rincian
                    </Button>
                  </Link>
                  <Button
                    onClick={() => triggerPickup(ship.order_id)}
                    className="flex-1 bg-green-700 hover:bg-green-800 text-white font-bold text-xs h-10 cursor-pointer flex items-center justify-center gap-1.5 rounded-lg"
                    disabled={pickupMutation.isPending}
                  >
                    Pickup Paket <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pickup Notes Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-slate-900 bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-800">
              Konfirmasi Pickup Paket
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Apakah Anda sudah sampai di greenhouse dan mengambil paket pesanan ini secara fisik?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
              Catatan Tambahan (Opsional)
            </label>
            <Textarea
              placeholder="Contoh: Kondisi paket rapi, siap jalan, dikemas kotak kardus..."
              className="text-xs font-medium border-slate-200 focus:border-green-500 min-h-[90px]"
              value={pickupNotes}
              onChange={(e) => setPickupNotes(e.target.value)}
            />
          </div>
          <DialogFooter className="flex sm:justify-end gap-3 border-t border-slate-50 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setPickupNotes('');
              }}
              className="text-xs font-bold border-slate-200 text-slate-700 cursor-pointer hover:bg-slate-100"
              disabled={pickupMutation.isPending}
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmPickup}
              className="bg-green-700 hover:bg-green-800 text-white font-bold text-xs cursor-pointer"
              disabled={pickupMutation.isPending}
            >
              {pickupMutation.isPending ? 'Memproses...' : 'Ya, Sudah Diambil'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
