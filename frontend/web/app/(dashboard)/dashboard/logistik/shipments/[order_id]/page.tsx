'use client';

import * as React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logisticsService, IShipment, ShipmentStatus } from '@/services/logistics';
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
  MapPin,
  User,
  ArrowLeft,
  CheckCircle2,
  Clock,
  ChevronRight,
  ClipboardList,
  Truck,
  Box,
  CornerDownRight,
  Send,
} from 'lucide-react';
import Link from 'next/link';

const MOCK_SHIPMENT_DETAILS: Record<string, IShipment> = {
  'ORD-98831': {
    id: 'SH-7701',
    order_id: 'ORD-98831',
    logistic_id: 'L-01',
    status: 'pending_pickup',
    items_count: 3,
    pickup_address: {
      province: 'Jawa Timur',
      city: 'Lamongan',
      full_address: 'Greenhouse Budi Santoso, Desa Karang RT 02/RW 03',
    },
    delivery_address: {
      province: 'Jawa Timur',
      city: 'Surabaya',
      full_address: 'Jl. Pemuda No. 12, Genteng',
      recipient_name: 'Andi Wijaya',
      phone_number: '0812-3456-7890',
    },
    status_history: [
      {
        status: 'pending_pickup',
        notes: 'Pesanan telah dikonfirmasi. Menunggu pengambilan paket oleh kurir.',
        timestamp: '2026-05-27T08:00:00Z',
      },
    ],
    created_at: '2026-05-27T08:00:00Z',
    updated_at: '2026-05-27T08:00:00Z',
  },
  'ORD-98822': {
    id: 'SH-7702',
    order_id: 'ORD-98822',
    logistic_id: 'L-01',
    status: 'picked_up',
    items_count: 1,
    pickup_address: {
      province: 'Jawa Timur',
      city: 'Lamongan',
      full_address: 'Lahan Siti Aminah, Desa Paciran KM 3',
    },
    delivery_address: {
      province: 'Jawa Timur',
      city: 'Sidoarjo',
      full_address: 'Perum Asri B3, Sidoarjo Kota',
      recipient_name: 'Dewi Lestari',
      phone_number: '0812-9988-7766',
    },
    status_history: [
      {
        status: 'picked_up',
        notes:
          'Kurir telah mengambil paket di greenhouse petani. Kondisi tanaman segar berkardus tebal.',
        timestamp: '2026-05-26T12:00:00Z',
      },
      {
        status: 'pending_pickup',
        notes: 'Pesanan dikonfirmasi.',
        timestamp: '2026-05-26T10:00:00Z',
      },
    ],
    picked_up_at: '2026-05-26T12:00:00Z',
    created_at: '2026-05-26T10:00:00Z',
    updated_at: '2026-05-26T12:00:00Z',
  },
  'ORD-98810': {
    id: 'SH-7703',
    order_id: 'ORD-98810',
    logistic_id: 'L-01',
    status: 'in_transit',
    items_count: 5,
    pickup_address: {
      province: 'Jawa Timur',
      city: 'Lamongan',
      full_address: 'Gudang Tani Sentosa, Glagah No. 42',
    },
    delivery_address: {
      province: 'Jawa Timur',
      city: 'Gresik',
      full_address: 'Jl. Raya Kebomas 54, Kebomas',
      recipient_name: 'Hadi Susanto',
      phone_number: '0856-7788-9900',
    },
    status_history: [
      {
        status: 'in_transit',
        notes: 'Paket sedang dikirim via rute Glagah-Gresik.',
        timestamp: '2026-05-26T08:00:00Z',
      },
      {
        status: 'picked_up',
        notes: 'Kurir telah mengambil paket di gudang petani.',
        timestamp: '2026-05-25T16:00:00Z',
      },
      {
        status: 'pending_pickup',
        notes: 'Pesanan dikonfirmasi.',
        timestamp: '2026-05-25T14:00:00Z',
      },
    ],
    picked_up_at: '2026-05-25T16:00:00Z',
    created_at: '2026-05-25T14:00:00Z',
    updated_at: '2026-05-26T08:00:00Z',
  },
};

export default function LogisticsShipmentDetailPage({ params }: { params: Promise<{ order_id: string }> }) {
  const resolvedParams = React.use(params);
  const orderId = resolvedParams.order_id;
  const queryClient = useQueryClient();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [actionNotes, setActionNotes] = React.useState('');

  // Independent add note variables
  const [timelineNote, setTimelineNote] = React.useState('');

  const {
    data: shipmentResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['logistics-shipment-detail', orderId],
    queryFn: () => logisticsService.getShipmentByOrderId(orderId),
  });

  const isQueryError = isError || !shipmentResponse;

  React.useEffect(() => {
    if (isQueryError && !isLoading) {
      toast.error('Gagal mengambil rincian paket secara online. Menggunakan data demo lokal.', {
        description: 'Menampilkan data simulasi kurir Lamongan agar layout tetap berjalan.',
        duration: 5000,
      });
    }
  }, [isQueryError, isLoading]);

  const rawDetails = isQueryError
    ? MOCK_SHIPMENT_DETAILS[orderId] || MOCK_SHIPMENT_DETAILS['ORD-98831']
    : shipmentResponse.data;

  // Mutations
  const pickupMutation = useMutation({
    mutationFn: (notes?: string) => logisticsService.pickupShipment(orderId, notes),
    onSuccess: () => {
      toast.success('Paket berhasil di-pickup!');
      queryClient.invalidateQueries({ queryKey: ['logistics-shipment-detail', orderId] });
      setDialogOpen(false);
      setActionNotes('');
    },
    onError: () => toast.error('Gagal memproses pickup.'),
  });

  const transitMutation = useMutation({
    mutationFn: (notes?: string) => logisticsService.transitShipment(orderId, notes),
    onSuccess: () => {
      toast.success('Paket mulai dikirim (Transit)!');
      queryClient.invalidateQueries({ queryKey: ['logistics-shipment-detail', orderId] });
      setDialogOpen(false);
      setActionNotes('');
    },
    onError: () => toast.error('Gagal memperbarui status transit.'),
  });

  const deliverMutation = useMutation({
    mutationFn: (notes?: string) => logisticsService.deliverShipment(orderId, notes),
    onSuccess: () => {
      toast.success('Paket sukses terkirim ke pembeli! 🎉');
      queryClient.invalidateQueries({ queryKey: ['logistics-shipment-detail', orderId] });
      setDialogOpen(false);
      setActionNotes('');
    },
    onError: () => toast.error('Gagal menyelesaikan pengiriman.'),
  });

  const addNoteMutation = useMutation({
    mutationFn: (notes: string) => logisticsService.addNotes(orderId, notes),
    onSuccess: () => {
      toast.success('Catatan perjalanan berhasil ditambahkan ke timeline!');
      queryClient.invalidateQueries({ queryKey: ['logistics-shipment-detail', orderId] });
      setTimelineNote('');
    },
    onError: () => toast.error('Gagal menyimpan catatan baru.'),
  });

  const handleActionClick = () => {
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (isQueryError) {
      // Local memory simulation
      const currentStatus = rawDetails.status;
      let nextStatus: ShipmentStatus = 'pending_pickup';
      let statusStr = '';

      if (currentStatus === 'pending_pickup') {
        nextStatus = 'picked_up';
        statusStr = 'Diambil';
      } else if (currentStatus === 'picked_up') {
        nextStatus = 'in_transit';
        statusStr = 'Transit';
      } else if (currentStatus === 'in_transit') {
        nextStatus = 'delivered';
        statusStr = 'Terkirim';
      }

      // Modify local mock structure
      // eslint-disable-next-line react-hooks/immutability
      rawDetails.status = nextStatus;

      rawDetails.status_history.unshift({
        status: nextStatus,
        notes: actionNotes || `Memperbarui status pengiriman secara fisik menjadi ${statusStr}.`,
        timestamp: new Date().toISOString(),
      });

      toast.success(`[Simulasi] Sukses memperbarui status menjadi ${statusStr}!`, {
        description: 'Data disimpan lokal sementara.',
      });

      queryClient.invalidateQueries({ queryKey: ['logistics-shipment-detail', orderId] });
      setDialogOpen(false);
      setActionNotes('');
      return;
    }

    const currentStatus = rawDetails.status;
    if (currentStatus === 'pending_pickup') {
      pickupMutation.mutate(actionNotes);
    } else if (currentStatus === 'picked_up') {
      transitMutation.mutate(actionNotes);
    } else if (currentStatus === 'in_transit') {
      deliverMutation.mutate(actionNotes);
    }
  };

  const handleAddNotesOnly = (e: React.FormEvent) => {
    e.preventDefault();
    if (timelineNote.trim() === '') return;

    if (isQueryError) {
      rawDetails.status_history.unshift({
        status: rawDetails.status,
        notes: `[Pembaruan Lokasi] ${timelineNote}`,
        timestamp: new Date().toISOString(),
      });
      toast.success('[Simulasi] Catatan lokasi ditambahkan!', {
        description: 'Disimpan di cache peramban.',
      });
      queryClient.invalidateQueries({ queryKey: ['logistics-shipment-detail', orderId] });
      setTimelineNote('');
      return;
    }

    addNoteMutation.mutate(timelineNote);
  };

  const getStatusString = (status: string) => {
    switch (status) {
      case 'pending_pickup':
        return 'Menunggu Pickup';
      case 'picked_up':
        return 'Diambil (Di Kurir)';
      case 'in_transit':
        return 'Transit (Dikirim)';
      case 'delivered':
        return 'Terkirim (Sukses)';
      default:
        return 'Tidak Diketahui';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_pickup':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200">
            Menunggu Pickup
          </span>
        );
      case 'picked_up':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200">
            Diambil
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200">
            Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
            Terkirim
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-96 md:col-span-2 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const isCompleted = rawDetails.status === 'delivered';
  const nextActionLabel =
    rawDetails.status === 'pending_pickup'
      ? 'Ambil (Pickup) Paket'
      : rawDetails.status === 'picked_up'
        ? 'Mulai Kirim (Transit)'
        : 'Tandai Paket Terkirim';

  const nextActionColor =
    rawDetails.status === 'pending_pickup'
      ? 'bg-slate-900 hover:bg-slate-800'
      : rawDetails.status === 'picked_up'
        ? 'bg-blue-600 hover:bg-blue-700'
        : 'bg-emerald-600 hover:bg-emerald-700';

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Offline Alert */}
      {isQueryError && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Rincian Paket Simulasi</p>
              <p className="text-[10px] text-amber-600 font-medium">
                Menampilkan data simulasi lokal untuk mempermudah peragaan alur daur hidup paket.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="h-7 text-[10px] font-bold border-amber-300 text-amber-700 bg-white hover:bg-amber-100 hover:text-amber-800 cursor-pointer flex items-center gap-1 shrink-0"
          >
            <RefreshCw className="h-3 w-3" /> Coba Hubungkan
          </Button>
        </div>
      )}

      {/* Breadcrumb Back Link */}
      <Link
        href="/dashboard/logistik/shipments"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Pengiriman
      </Link>

      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Detail Pengiriman #{rawDetails.order_id}
            </h1>
            {getStatusBadge(rawDetails.status)}
          </div>
          <p className="text-[11px] text-slate-400 font-bold mt-1">
            ID Pengiriman: #{rawDetails.id}
          </p>
        </div>

        {!isCompleted && (
          <Button
            onClick={handleActionClick}
            className={`h-11 px-6 text-xs font-bold text-white cursor-pointer flex items-center gap-2 rounded-xl shrink-0 shadow-sm ${nextActionColor}`}
          >
            <Truck className="h-4 w-4" /> {nextActionLabel}
          </Button>
        )}
      </div>

      {/* Main layout grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left: Timeline & Address Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Address Cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Pickup */}
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="pb-2 border-b border-slate-50">
                <CardTitle className="text-xs font-bold text-red-600 flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> GREENHOUSE ASAL (PETANI)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{rawDetails.pickup_address.city}</span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {rawDetails.pickup_address.province}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium">
                  {rawDetails.pickup_address.full_address}
                </p>
              </CardContent>
            </Card>

            {/* Destination */}
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="pb-2 border-b border-slate-50">
                <CardTitle className="text-xs font-bold text-green-700 flex items-center gap-1">
                  <User className="h-4 w-4" /> TUJUAN PENGIRIMAN (PEMBELI)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-3 space-y-2 text-xs">
                <div className="font-bold text-slate-800 text-xs flex justify-between">
                  <span>{rawDetails.delivery_address.recipient_name}</span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {rawDetails.delivery_address.city}
                  </span>
                </div>
                {rawDetails.delivery_address.phone_number && (
                  <p className="text-[10.5px] text-slate-500 font-semibold">
                    Tlp: {rawDetails.delivery_address.phone_number}
                  </p>
                )}
                <p className="text-[11px] text-slate-500 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100 font-medium">
                  {rawDetails.delivery_address.full_address}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Timeline adapter */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-4 border-b border-slate-50">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-green-600" /> Log Histori & Timeline Pengiriman
              </CardTitle>
              <CardDescription className="text-xs">
                Riwayat pembaruan status dan catatan lokasi kurir.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pl-8">
              <div className="relative border-l border-slate-200 pl-6 space-y-8">
                {rawDetails.status_history.map((hist, index) => {
                  const histDate = new Date(hist.timestamp).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                  });
                  const histTime = new Date(hist.timestamp).toLocaleTimeString('id-ID', {
                    hour: '2-digit',
                    minute: '2-digit',
                  });

                  const isActive = index === 0;

                  return (
                    <div key={index} className="relative group">
                      {/* Timeline dot */}
                      <span
                        className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center shadow-xs shrink-0 ${
                          isActive ? 'bg-green-500 animate-ping' : 'bg-slate-300'
                        }`}
                      />
                      <span
                        className={`absolute -left-[31px] top-1 h-4 w-4 rounded-full border-2 border-white flex items-center justify-center shadow-xs shrink-0 ${
                          isActive ? 'bg-green-600' : 'bg-slate-400'
                        }`}
                      />

                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-bold rounded-full px-2 py-0.5 border ${
                              hist.status === 'delivered'
                                ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                                : hist.status === 'in_transit'
                                  ? 'text-amber-700 bg-amber-50 border-amber-200'
                                  : hist.status === 'picked_up'
                                    ? 'text-blue-700 bg-blue-50 border-blue-200'
                                    : 'text-slate-600 bg-slate-50 border-slate-200'
                            }`}
                          >
                            {getStatusString(hist.status)}
                          </span>
                          <span className="text-[9.5px] font-bold text-slate-400">
                            {histDate}, {histTime} WIB
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                          {hist.notes || 'Status berhasil diperbarui.'}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Notes Update Form */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3 border-b border-slate-50">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Info Ringkas Paket
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-3 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="font-semibold text-slate-500 flex items-center gap-1">
                  <Box className="w-3.5 h-3.5" /> Total Muatan
                </span>
                <span className="font-bold text-slate-800">
                  {rawDetails.items_count} Item Tanaman
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-t border-slate-50">
                <span className="font-semibold text-slate-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Status Daur Hidup
                </span>
                <span className="font-bold text-slate-800">
                  {getStatusString(rawDetails.status)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Location notes updater */}
          {!isCompleted && (
            <Card className="border-slate-200 shadow-sm bg-white">
              <CardHeader className="pb-2 border-b border-slate-50">
                <CardTitle className="text-sm font-bold text-slate-800">
                  Pembaruan Lokasi & Catatan
                </CardTitle>
                <CardDescription className="text-xs">
                  Laporkan posisi kurir atau catatan transit tanpa merubah status paket.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <form onSubmit={handleAddNotesOnly} className="space-y-4">
                  <Textarea
                    placeholder="Contoh: Kurir sedang di SPBU Karangbinangun, isi bahan bakar..."
                    className="text-xs font-medium border-slate-200 focus:border-green-500 min-h-[90px] w-full"
                    value={timelineNote}
                    onChange={(e) => setTimelineNote(e.target.value)}
                    disabled={addNoteMutation.isPending}
                  />
                  <Button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs h-10 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                    disabled={addNoteMutation.isPending || timelineNote.trim() === ''}
                  >
                    <Send className="w-3.5 h-3.5" /> Kirim Update Catatan
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-slate-900 bg-white rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-slate-800">
              Konfirmasi Perubahan Status
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Apakah Anda yakin ingin memproses status paket ini menjadi **
              {rawDetails.status === 'pending_pickup'
                ? 'Diambil'
                : rawDetails.status === 'picked_up'
                  ? 'Dalam Perjalanan (Transit)'
                  : 'Terkirim (Sukses)'}
              **?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <label className="text-[10.5px] font-bold text-slate-500 uppercase tracking-wider block">
              Catatan Opsional
            </label>
            <Textarea
              placeholder="Tambahkan informasi pelengkap untuk penerima..."
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
              disabled={
                pickupMutation.isPending || transitMutation.isPending || deliverMutation.isPending
              }
            >
              Batal
            </Button>
            <Button
              onClick={handleConfirmAction}
              className={`font-bold text-xs cursor-pointer text-white ${nextActionColor}`}
              disabled={
                pickupMutation.isPending || transitMutation.isPending || deliverMutation.isPending
              }
            >
              {pickupMutation.isPending || transitMutation.isPending || deliverMutation.isPending
                ? 'Memproses...'
                : 'Ya, Konfirmasi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
