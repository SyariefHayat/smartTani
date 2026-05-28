'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logisticsService, IShipment } from '@/services/logistics';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
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
} from 'lucide-react';
import Link from 'next/link';

const MOCK_ACTIVE = [
  {
    id: 'SH-7702',
    order_id: 'ORD-98822',
    logistic_id: 'L-01',
    status: 'picked_up' as const,
    items_count: 1,
    pickup_address: {
      province: 'Jawa Timur',
      city: 'Lamongan',
      full_address: 'Lahan Siti Aminah, Desa Paciran',
    },
    delivery_address: {
      province: 'Jawa Timur',
      city: 'Sidoarjo',
      full_address: 'Perum Asri B3, Sidoarjo Kota',
      recipient_name: 'Dewi Lestari',
      phone_number: '0812-9988-7766',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // Picked up 45m ago
  },
  {
    id: 'SH-7703',
    order_id: 'ORD-98810',
    logistic_id: 'L-01',
    status: 'in_transit' as const,
    items_count: 5,
    pickup_address: {
      province: 'Jawa Timur',
      city: 'Lamongan',
      full_address: 'Gudang Tani Sentosa, Glagah',
    },
    delivery_address: {
      province: 'Jawa Timur',
      city: 'Gresik',
      full_address: 'Jl. Raya Kebomas 54, Kebomas',
      recipient_name: 'Hadi Susanto',
      phone_number: '0856-7788-9900',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // Transit 3h ago
  },
];

export default function LogisticsActivePage() {
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

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan pengiriman offline. Menggunakan data demo lokal.', {
        description: 'Menampilkan antrean paket aktif simulasi agar layout tetap interaktif.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const rawActive = (
    isQueryError ? MOCK_ACTIVE : shipmentsResponse?.data?.shipments || MOCK_ACTIVE
  ) as IShipment[];

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

    if (isQueryError) {
      // Local memory mutation fallback
      const mockIndex = MOCK_ACTIVE.findIndex((item) => item.order_id === selectedOrderId);
      if (mockIndex !== -1) {
        if (actionType === 'transit') {
          MOCK_ACTIVE[mockIndex] = {
            ...MOCK_ACTIVE[mockIndex],
            status: 'in_transit',
            updated_at: new Date().toISOString(),
          };
          toast.success(`[Simulasi] Paket #${selectedOrderId} mulai dikirim!`, {
            description: 'Status berubah menjadi Transit. (Simulasi memori)',
          });
        } else {
          MOCK_ACTIVE.splice(mockIndex, 1);
          toast.success(`[Simulasi] Paket #${selectedOrderId} sukses terkirim! 🎉`, {
            description: 'Status berubah menjadi Terkirim. (Simulasi memori)',
          });
        }
      }

      queryClient.invalidateQueries({ queryKey: ['logistics-active-shipments'] });
      setDialogOpen(false);
      setActionNotes('');
      setSelectedOrderId(null);
      setActionType(null);
      return;
    }

    if (actionType === 'transit') {
      transitMutation.mutate({ orderId: selectedOrderId, notes: actionNotes });
    } else {
      deliverMutation.mutate({ orderId: selectedOrderId, notes: actionNotes });
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'picked_up') {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
          Diambil
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
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
      {/* Offline Alert */}
      {isQueryError && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Layanan Pengiriman Offline</p>
              <p className="text-[10px] text-amber-600 font-medium">
                Menampilkan data simulasi kurir aktif lokal. Auto-polling dinonaktifkan.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-7 text-[10px] font-bold border-amber-300 text-amber-700 bg-white hover:bg-amber-100 hover:text-amber-800 cursor-pointer flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="h-3 w-3" /> Coba Hubungkan Kembali
          </Button>
        </div>
      )}

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
        <div className="text-[10px] font-bold text-slate-500 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 shrink-0">
          Auto-update antrean aktif (Polling 30s)
        </div>
      </div>

      {/* Cards list */}
      {rawActive.length === 0 ? (
        <div className="py-24 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
          <Truck className="w-12 h-12 mx-auto mb-4 text-slate-300 opacity-60 animate-bounce" />
          <p className="text-xs font-bold text-slate-700">Tidak Ada Paket Aktif 🎉</p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            Anda tidak memiliki tugas pengiriman berjalan. Ambil baru di menu Menunggu Pickup.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {rawActive.map((ship) => {
            const isPickedUp = ship.status === 'picked_up';
            const actionLabel = isPickedUp ? 'Mulai Kirim' : 'Selesaikan Pengiriman';
            // eslint-disable-next-line react-hooks/purity
            const timeAgo = Math.round(
              (Date.now() - new Date(ship.updated_at).getTime()) / (1000 * 60)
            );
            const relativeTimeStr =
              timeAgo < 60 ? `${timeAgo} menit lalu` : `${Math.round(timeAgo / 60)} jam lalu`;

            return (
              <Card
                key={ship.id}
                className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
              >
                <div
                  className={`absolute top-0 left-0 w-1.5 h-full ${isPickedUp ? 'bg-blue-500' : 'bg-amber-500'}`}
                />
                <CardHeader className="pb-3 pl-6">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5">
                      Order ID: #{ship.order_id}
                    </span>
                    {getStatusBadge(ship.status)}
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-800 line-clamp-1 flex items-center gap-1.5">
                    {isPickedUp ? (
                      <Navigation className="w-4 h-4 text-blue-500 animate-pulse" />
                    ) : (
                      <Truck className="w-4 h-4 text-amber-500 animate-bounce" />
                    )}
                    {isPickedUp ? 'Menunggu Keberangkatan' : 'Sedang Dikirim'}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-4 pl-6 space-y-3 flex-1">
                  {/* Delivery address */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                    <div className="flex items-center text-[10px] text-slate-400 font-bold">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
                      ALAMAT TUJUAN (PEMBELI)
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      {ship.delivery_address.recipient_name} ({ship.delivery_address.phone_number})
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold leading-normal">
                      Tujuan: {ship.delivery_address.city}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      {ship.delivery_address.full_address}
                    </p>
                  </div>

                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                    <span className="flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5" /> Update Terakhir
                    </span>
                    <span className="text-slate-800">{relativeTimeStr}</span>
                  </div>
                </CardContent>

                <CardFooter className="pt-0 pl-6 border-t border-slate-50/50 mt-2 bg-slate-50/30 flex gap-3">
                  <Link href={`/dashboard/logistik/shipments/${ship.order_id}`} className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full text-xs font-bold text-slate-700 border-slate-200 hover:bg-slate-100 cursor-pointer h-10"
                    >
                      Rincian
                    </Button>
                  </Link>
                  <Button
                    onClick={() => triggerAction(ship.order_id, isPickedUp ? 'transit' : 'deliver')}
                    className={`flex-1 font-bold text-xs h-10 cursor-pointer flex items-center justify-center gap-1.5 ${
                      isPickedUp
                        ? 'bg-blue-600 hover:bg-blue-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
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
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
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
