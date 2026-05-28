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
  ClipboardList,
  MapPin,
  User,
  ArrowRight,
  Package,
} from 'lucide-react';
import Link from 'next/link';

const MOCK_PENDING = [
  {
    id: 'SH-7701',
    order_id: 'ORD-98831',
    logistic_id: 'L-01',
    status: 'pending_pickup' as const,
    items_count: 3,
    pickup_address: {
      province: 'Jawa Timur',
      city: 'Lamongan',
      full_address: 'Greenhouse Budi Santoso, Desa Karang',
    },
    delivery_address: {
      province: 'Jawa Timur',
      city: 'Surabaya',
      full_address: 'Jl. Pemuda No. 12, Genteng',
      recipient_name: 'Andi Wijaya',
      phone_number: '0812-3456-7890',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
  },
  {
    id: 'SH-7704',
    order_id: 'ORD-98845',
    logistic_id: 'L-01',
    status: 'pending_pickup' as const,
    items_count: 2,
    pickup_address: {
      province: 'Jawa Timur',
      city: 'Lamongan',
      full_address: 'Gudang Agro Utama, Laren',
    },
    delivery_address: {
      province: 'Jawa Timur',
      city: 'Sidoarjo',
      full_address: 'Ruko Mutiara Mas Block C',
      recipient_name: 'Santi Pratiwi',
      phone_number: '0821-9988-1122',
    },
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    updated_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
];

export default function LogisticsPendingPage() {
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

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan pickup offline. Menggunakan data demo lokal.', {
        description:
          'Menampilkan antrean pickup paket pertanian simulasi agar layout tetap interaktif.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const rawPending = (
    isQueryError ? MOCK_PENDING : shipmentsResponse?.data?.shipments || MOCK_PENDING
  ) as IShipment[];

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
      toast.error('Gagal memproses pickup paket. Hubungkan koneksi atau gunakan simulasi.');
    },
  });

  const triggerPickup = (orderId: string) => {
    setSelectedOrderId(orderId);
    setDialogOpen(true);
  };

  const handleConfirmPickup = () => {
    if (!selectedOrderId) return;

    if (isQueryError) {
      // Local memory mutation fallback
      toast.success(`[Simulasi] Paket #${selectedOrderId} di-pickup sukses!`, {
        description: 'Status berubah menjadi Diambil. (Simulasi memori browser)',
      });
      // Filter out item in UI
      const mockIndex = MOCK_PENDING.findIndex((item) => item.order_id === selectedOrderId);
      if (mockIndex !== -1) {
        MOCK_PENDING.splice(mockIndex, 1);
      }
      queryClient.invalidateQueries({ queryKey: ['logistics-pending-shipments'] });
      setDialogOpen(false);
      setPickupNotes('');
      setSelectedOrderId(null);
      return;
    }

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
      {/* Offline Alert */}
      {isQueryError && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Layanan Pickup Offline</p>
              <p className="text-[10px] text-amber-600 font-medium">
                Menampilkan data simulasi antrean pickup kurir lokal. Auto-polling dinonaktifkan.
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">Menunggu Pickup</h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Daftar paket pesanan hasil tani yang siap diambil di lahan/greenhouse petani Lamongan.
          </p>
        </div>
        <div className="text-[10px] font-bold text-slate-500 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 shrink-0">
          Auto-update antrean aktif (Polling 30s)
        </div>
      </div>

      {/* Cards list */}
      {rawPending.length === 0 ? (
        <div className="py-24 text-center bg-white border border-slate-200 rounded-2xl shadow-xs">
          <ClipboardList className="w-12 h-12 mx-auto mb-4 text-slate-300 opacity-60 animate-bounce" />
          <p className="text-xs font-bold text-slate-700">Semua Paket Selesai Di-pickup! 🎉</p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">
            Tidak ada paket pesanan baru menunggu pickup saat ini.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {rawPending.map((ship) => {
            // eslint-disable-next-line react-hooks/purity
            const timeAgo = Math.round(
              (Date.now() - new Date(ship.created_at).getTime()) / (1000 * 60)
            );
            const relativeTimeStr =
              timeAgo < 60 ? `${timeAgo} menit lalu` : `${Math.round(timeAgo / 60)} jam lalu`;

            return (
              <Card
                key={ship.id}
                className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="absolute top-0 left-0 w-1.5 h-full bg-slate-400" />
                <CardHeader className="pb-3 pl-6">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-slate-100 border border-slate-200 rounded-full px-2 py-0.5">
                      Order ID: #{ship.order_id}
                    </span>
                    <span className="text-[9.5px] text-slate-400 font-bold flex items-center gap-1 shrink-0">
                      Tugas Masuk: {relativeTimeStr}
                    </span>
                  </div>
                  <CardTitle className="text-sm font-bold text-slate-800 line-clamp-1">
                    Pickup Lahan Petani
                  </CardTitle>
                </CardHeader>

                <CardContent className="pb-4 pl-6 space-y-3 flex-1">
                  {/* Pickup address */}
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-1">
                    <div className="flex items-center text-[10px] text-slate-400 font-bold">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-red-500" />
                      ALAMAT AMBIL (PETANI)
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      {ship.pickup_address.city}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                      {ship.pickup_address.full_address}
                    </p>
                  </div>

                  {/* Delivery address */}
                  <div className="bg-green-50/20 p-2.5 rounded-lg border border-green-50 space-y-1">
                    <div className="flex items-center text-[10px] text-green-700 font-bold">
                      <User className="w-3.5 h-3.5 mr-1 text-green-600" />
                      TUJUAN (PEMBELI)
                    </div>
                    <p className="text-xs font-semibold text-slate-800">
                      {ship.delivery_address.recipient_name}
                    </p>
                    <p className="text-[10px] text-slate-500 font-bold leading-normal">
                      Kirim ke: {ship.delivery_address.city}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold bg-slate-50 border border-slate-100 rounded-lg p-2">
                    <Package className="w-4 h-4 text-slate-400" />
                    Kuantitas Paket:{' '}
                    <span className="text-slate-800 font-bold">
                      {ship.items_count} Item Tanaman
                    </span>
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
                    onClick={() => triggerPickup(ship.order_id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-10 cursor-pointer flex items-center justify-center gap-1.5"
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
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs cursor-pointer"
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
