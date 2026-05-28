'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { logisticsService, IShipment } from '@/services/logistics';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import {
  AlertTriangle,
  RefreshCw,
  Calendar,
  MapPin,
  Clock,
  Search,
  BookOpen,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

const MOCK_HISTORY = [
  {
    id: 'SH-7690',
    order_id: 'ORD-98781',
    logistic_id: 'L-01',
    status: 'delivered' as const,
    items_count: 2,
    pickup_address: {
      province: 'Jawa Timur',
      city: 'Lamongan',
      full_address: 'Lahan Agus, Tikung',
    },
    delivery_address: {
      province: 'Jawa Timur',
      city: 'Mojokerto',
      full_address: 'Pahlawan Square No. 1',
      recipient_name: 'Rudi Hermawan',
    },
    picked_up_at: '2026-05-24T12:00:00Z',
    delivered_at: '2026-05-25T09:30:00Z', // 21h 30m
    created_at: '2026-05-24T10:00:00Z',
    updated_at: '2026-05-25T09:30:00Z',
  },
  {
    id: 'SH-7681',
    order_id: 'ORD-98765',
    logistic_id: 'L-01',
    status: 'delivered' as const,
    items_count: 1,
    pickup_address: {
      province: 'Jawa Timur',
      city: 'Lamongan',
      full_address: 'Lahan Siti, Paciran',
    },
    delivery_address: {
      province: 'Jawa Timur',
      city: 'Gresik',
      full_address: 'Jl. Samanhudi 12',
      recipient_name: 'Imron Rosadi',
    },
    picked_up_at: '2026-05-22T08:00:00Z',
    delivered_at: '2026-05-22T14:15:00Z', // 6h 15m
    created_at: '2026-05-22T06:00:00Z',
    updated_at: '2026-05-22T14:15:00Z',
  },
  {
    id: 'SH-7650',
    order_id: 'ORD-98700',
    logistic_id: 'L-01',
    status: 'delivered' as const,
    items_count: 4,
    pickup_address: {
      province: 'Jawa Timur',
      city: 'Lamongan',
      full_address: 'Greenhouse Budi, Karang',
    },
    delivery_address: {
      province: 'Jawa Timur',
      city: 'Surabaya',
      full_address: 'Gubeng Kertajaya 5',
      recipient_name: 'Lilis Suryani',
    },
    picked_up_at: '2026-05-20T09:00:00Z',
    delivered_at: '2026-05-21T08:45:00Z', // 23h 45m
    created_at: '2026-05-20T08:00:00Z',
    updated_at: '2026-05-21T08:45:00Z',
  },
];

export default function LogisticsHistoryPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [page, setPage] = React.useState(1);

  const {
    data: shipmentsResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['logistics-history-list', page],
    queryFn: () => logisticsService.getShipments({ status: 'delivered', page, limit: 15 }),
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan riwayat offline. Menggunakan data demo lokal.', {
        description:
          'Menampilkan data riwayat pengiriman simulasi agar Anda tetap dapat menjelajahi layout.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const rawHistory = (
    isQueryError ? MOCK_HISTORY : shipmentsResponse?.data?.shipments || MOCK_HISTORY
  ) as IShipment[];

  // Filter list
  const processedHistory = React.useMemo(() => {
    let result = [...rawHistory];

    if (searchQuery.trim() !== '') {
      result = result.filter(
        (ship) =>
          ship.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ship.delivery_address.recipient_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ship.delivery_address.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return result;
  }, [rawHistory, searchQuery]);

  // Calculate averages
  const durationStats = React.useMemo(() => {
    let totalMinutes = 0;
    let count = 0;

    processedHistory.forEach((ship) => {
      if (ship.picked_up_at && ship.delivered_at) {
        const diff = new Date(ship.delivered_at).getTime() - new Date(ship.picked_up_at).getTime();
        totalMinutes += diff / (1000 * 60);
        count++;
      }
    });

    const averageMinutes = count > 0 ? totalMinutes / count : 0;
    const avgHours = Math.floor(averageMinutes / 60);
    const avgMins = Math.round(averageMinutes % 60);

    return {
      avgStr: count > 0 ? `${avgHours} jam ${avgMins} menit` : '0 jam',
      count,
    };
  }, [processedHistory]);

  const getDurationStr = (pickup?: string, deliver?: string) => {
    if (!pickup || !deliver) return '-';

    const minutes = (new Date(deliver).getTime() - new Date(pickup).getTime()) / (1000 * 60);
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);

    return `${hours} jam ${mins} menit`;
  };

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-[400px] w-full" />
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
              <p className="text-xs font-bold">Layanan Riwayat Offline</p>
              <p className="text-[10px] text-amber-600 font-medium">
                Menampilkan data mutasi riwayat simulasi. Koneksi dibatasi.
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
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Riwayat Pengiriman</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Daftar arsip seluruh tugas pengiriman pesanan yang telah sukses Anda tuntaskan.
        </p>
      </div>

      {/* Career summaries */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pl-6">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Paket Terkirim
            </CardDescription>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent className="space-y-1 pl-6">
            <CardTitle className="text-xl font-bold text-slate-800 tabular-nums lg:text-2xl">
              {durationStats.count} Paket
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">Pengiriman selesai tersaring</p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-all relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 pl-6">
            <CardDescription className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rata-rata Waktu Kirim
            </CardDescription>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent className="space-y-1 pl-6">
            <CardTitle className="text-xl font-bold text-slate-800 tabular-nums lg:text-2xl">
              {durationStats.avgStr}
            </CardTitle>
            <p className="text-[10px] font-bold text-slate-400">
              Dihitung sejak pickup s.d delivered
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filter toolbar */}
      <div className="flex gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Cari ID Pesanan, Kota, atau Penerima..."
            className="pl-10 h-10 border-slate-200 text-xs font-medium focus:border-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Table grid */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          {processedHistory.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300 opacity-60" />
              <p className="text-xs font-bold text-slate-700">Tidak Ada Riwayat Ditemukan</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                Anda belum memiliki pengiriman berstatus terkirim pada filter ini.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/75 border-b border-slate-100">
                  <TableRow>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs pl-6">
                      Order ID
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs">
                      Hijau / Asal
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs">
                      Alamat Penerima
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs">
                      Waktu Terkirim
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs">
                      Durasi Kirim
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs text-right pr-6">
                      Rincian
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedHistory.map((ship) => {
                    const pickupDateFormatted = ship.picked_up_at
                      ? new Date(ship.picked_up_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-';
                    const deliverDateFormatted = ship.delivered_at
                      ? new Date(ship.delivered_at).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : '-';

                    return (
                      <TableRow
                        key={ship.id}
                        className="hover:bg-slate-50/50 transition-colors border-b border-slate-100 last:border-0"
                      >
                        <TableCell className="py-4 pl-6">
                          <span className="font-mono text-xs font-semibold text-slate-700 block">
                            #{ship.order_id}
                          </span>
                          <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                            ID: #{ship.id}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-xs font-medium text-slate-800">
                          <span className="flex items-center gap-1 font-bold text-slate-700 text-xs">
                            <MapPin className="h-3 w-3 text-slate-400" />
                            {ship.pickup_address.city}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium block mt-0.5 max-w-[180px] truncate">
                            {ship.pickup_address.full_address}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-xs font-medium text-slate-800">
                          <span className="font-bold text-slate-800 block text-xs">
                            {ship.delivery_address.recipient_name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5 max-w-[180px] truncate">
                            {ship.delivery_address.full_address} ({ship.delivery_address.city})
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-xs font-semibold text-slate-600">
                          <span className="block">{deliverDateFormatted} WIB</span>
                          <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                            Pickup: {pickupDateFormatted} WIB
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-xs font-bold text-slate-800 tabular-nums">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-blue-500" />
                            {getDurationStr(ship.picked_up_at, ship.delivered_at)}
                          </span>
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6">
                          <Link href={`/dashboard/logistik/shipments/${ship.order_id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                              Histori Timeline
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
