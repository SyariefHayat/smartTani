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
  Truck,
  MapPin,
  User,
  ArrowRight,
  CheckCircle2,
  Navigation,
  Package,
} from 'lucide-react';
import Link from 'next/link';

export default function LogisticsActivePage() {
  // eslint-disable-next-line react-hooks/purity
  const now = Date.now();
  const queryClient = useQueryClient();
  const [selectedOrderId, setSelectedOrderId] = React.useState<string | null>(null);
  const [actionType, setActionType] = React.useState<'transit' | 'deliver' | null>(null);
  const [actionNotes, setActionNotes] = React.useState('');
  const [dialogOpen, setDialogOpen] = React.useState(false);

  // Fetch active shipments (picked_up or in_transit)
  const {
    data: shipmentsResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['logistics-active-shipments'],
    queryFn: () => logisticsService.getShipments({ status: 'picked_up,in_transit', limit: 30 }),
    refetchInterval: 30000,
  });

  const isQueryError = isError;

  const rawActive = (shipmentsResponse?.data?.shipments || []) as IShipment[];

  const transitMutation = useMutation({
    mutationFn: ({ orderId, notes }: { orderId: string; notes?: string }) =>
      logisticsService.transitShipment(orderId, notes),
    onSuccess: (response, variables) => {
      toast.success(`Paket #${variables.orderId} mulai dikirim!`, {
        description: 'Status berubah menjadi Dalam Perjalanan (Transit). Hati-hati di jalan!',
      });
      queryClient.invalidateQueries({ queryKey: ['logistics-active-shipments'] });
      setDialogOpen(false);
      setActionNotes('');
      setSelectedOrderId(null);
      setActionType(null);
    },
    onError: () => {
      toast.error('Gagal memperbarui status paket.');
    },
  });

  const deliverMutation = useMutation({
    mutationFn: ({ orderId, notes }: { orderId: string; notes?: string }) =>
      logisticsService.deliverShipment(orderId, notes),
    onSuccess: (response, variables) => {
      toast.success(`Paket #${variables.orderId} sukses terkirim! 🎉`, {
        description: 'Status berubah menjadi Terkirim. Terimakasih atas kerja keras Anda!',
      });
      queryClient.invalidateQueries({ queryKey: ['logistics-active-shipments'] });
      queryClient.invalidateQueries({ queryKey: ['logistics-analytics-overview'] });
      setDialogOpen(false);
      setActionNotes('');
      setSelectedOrderId(null);
      setActionType(null);
    },
    onError: () => {
      toast.error('Gagal memperbarui status pengiriman.');
    },
  });

  const triggerAction = (orderId: string, type: 'transit' | 'deliver') => {
    setSelectedOrderId(orderId);
    setActionType(type);
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedOrderId || !actionType) return;

    if (actionType === 'transit') {
      transitMutation.mutate({ orderId: selectedOrderId, notes: actionNotes });
    } else {
      deliverMutation.mutate({ orderId: selectedOrderId, notes: actionNotes });
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'picked_up') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold text-slate-600 bg-slate-50 border border-slate-200">
          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
          Diambil
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-bold text-slate-700 bg-slate-100 border border-slate-300">
        <span className="h-1.5 w-1.5 rounded-full bg-slate-600 animate-pulse" />
        Transit
      </span>
    );
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Dalam Perjalanan (Aktif)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Kelola dan perbarui daur hidup pesanan aktif yang sedang dalam penguasaan atau
            perjalanan Anda.
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
          <p className="font-bold">Gagal memuat data pengiriman aktif</p>
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
      ) : rawActive.length === 0 ? (
        /* Empty State */
        <div className="py-24 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
          <Truck className="w-12 h-12 mx-auto mb-4 text-slate-300 opacity-60" />
          <p className="text-xs font-bold text-slate-700">Tidak Ada Paket Aktif 🎉</p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            Anda tidak memiliki tugas pengiriman berjalan. Ambil baru di menu Menunggu Pickup.
          </p>
        </div>
      ) : (
        /* Cards list */
        <div className="grid gap-6 md:grid-cols-2">
          {rawActive.map((ship) => {
            const isPickedUp = ship.status === 'picked_up';
            const timeAgo = Math.round((now - new Date(ship.updated_at).getTime()) / (1000 * 60));
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
                    {getStatusBadge(ship.status)}
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    {isPickedUp ? (
                      <Navigation className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Truck className="w-4 h-4 text-slate-400" />
                    )}
                    {isPickedUp ? 'Menunggu Keberangkatan' : 'Sedang Dikirim'}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-4 space-y-4 flex-1">
                  {/* Delivery address */}
                  <div className="flex gap-2.5 items-start">
                    <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Alamat Tujuan (Pembeli)
                      </span>
                      <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                        {ship.delivery_address.recipient_name} ({ship.delivery_address.phone_number}
                        )
                      </span>
                      <span className="text-[11px] text-slate-600 block mt-0.5">
                        Kota: {ship.delivery_address.city}
                      </span>
                      <span className="text-[11px] text-slate-500 block leading-normal mt-0.5">
                        {ship.delivery_address.full_address}
                      </span>
                    </div>
                  </div>

                  {/* Pickup address */}
                  <div className="flex gap-2.5 items-start">
                    <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Lokasi Ambil (Petani)
                      </span>
                      <span className="text-xs font-semibold text-slate-800 block mt-0.5">
                        {ship.pickup_address.city}
                      </span>
                      <span className="text-[11px] text-slate-500 block leading-normal mt-0.5">
                        {ship.pickup_address.full_address}
                      </span>
                    </div>
                  </div>

                  {/* Divider line */}
                  <div className="border-t border-slate-100" />

                  {/* Qty & Update */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px]">
                    <div className="flex gap-2.5 items-center">
                      <Package className="w-4 h-4 text-slate-400 shrink-0" />
                      <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                        <span>Paket:</span>
                        <span className="text-slate-800 font-bold">
                          {ship.items_count} Item Tanaman
                        </span>
                      </div>
                    </div>
                    <span className="text-slate-400 font-semibold text-[10px]">
                      Update: {relativeTimeStr}
                    </span>
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
                    onClick={() => triggerAction(ship.order_id, isPickedUp ? 'transit' : 'deliver')}
                    className={`flex-1 font-bold text-xs h-10 cursor-pointer flex items-center justify-center gap-1.5 rounded-lg ${
                      isPickedUp
                        ? 'bg-slate-900 hover:bg-slate-800 text-white'
                        : 'bg-green-700 hover:bg-green-800 text-white'
                    }`}
                    disabled={transitMutation.isPending || deliverMutation.isPending}
                  >
                    {isPickedUp ? (
                      <>
                        Mulai Kirim <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        Selesai Kirim <CheckCircle2 className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Action Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-slate-900 bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-800">
              {actionType === 'transit' ? 'Mulai Pengiriman Paket' : 'Konfirmasi Paket Terkirim'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              {actionType === 'transit'
                ? 'Apakah Anda ingin menandai bahwa Anda sedang berada di jalan menuju alamat pembeli?'
                : 'Apakah paket ini sudah sampai di alamat tujuan dan diterima dengan aman oleh pembeli?'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
              Catatan Lokasi / Penerimaan (Opsional)
            </label>
            <Textarea
              placeholder={
                actionType === 'transit'
                  ? 'Contoh: Sedang dalam perjalanan via rute Babat, estimasi sampai 1 jam...'
                  : 'Contoh: Diterima oleh Pak Budi (Ayah Kandung), kondisi tanaman segar...'
              }
              className="text-xs font-medium border-slate-200 focus:border-green-500 min-h-[90px]"
              value={actionNotes}
              onChange={(e) => setActionNotes(e.target.value)}
            />
          </div>
          <DialogFooter className="flex sm:justify-end gap-3 border-t border-slate-50 pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDialogOpen(false);
                setActionNotes('');
              }}
              className="text-xs font-bold border-slate-200 text-slate-700 cursor-pointer hover:bg-slate-100"
              disabled={transitMutation.isPending || deliverMutation.isPending}
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmAction}
              className={`font-bold text-xs cursor-pointer ${
                actionType === 'transit'
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-green-700 hover:bg-green-800 text-white'
              }`}
              disabled={transitMutation.isPending || deliverMutation.isPending}
            >
              {transitMutation.isPending || deliverMutation.isPending
                ? 'Memproses...'
                : 'Ya, Konfirmasi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
