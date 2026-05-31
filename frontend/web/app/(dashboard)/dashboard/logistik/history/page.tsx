'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { logisticsService, IShipment } from '@/services/logistics';
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
  MoreHorizontal,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

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
    queryFn: () => logisticsService.getShipments({ status: 'delivered', page, limit: 10 }),
  });

  const isQueryError = isError;

  // Filter list
  const processedHistory = React.useMemo(() => {
    const rawHistory = (shipmentsResponse?.data?.shipments || []) as IShipment[];
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
  }, [shipmentsResponse?.data?.shipments, searchQuery]);

  const totalPages = shipmentsResponse?.data?.meta?.totalPages || 1;

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
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Riwayat Pengiriman</h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Daftar arsip seluruh tugas pengiriman pesanan yang telah sukses Anda tuntaskan.
        </p>
      </div>

      {/* Query Error State */}
      {isQueryError ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 p-8 text-center text-red-500 font-semibold text-sm">
          <AlertTriangle className="h-8 w-8 text-red-600 mb-2 animate-pulse" />
          <p className="font-bold">Gagal memuat data riwayat pengiriman</p>
          <p className="text-xs text-red-400 font-normal mt-1 mb-4">
            Koneksi ke server Layanan Logistik terputus. Silakan periksa jaringan Anda atau coba
            hubungkan kembali.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold text-xs animate-none"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Coba Hubungkan Kembali
          </Button>
        </div>
      ) : (
        <>
          {/* Stats Grid - overview style */}
          <div className="grid gap-4 grid-cols-2">
            {/* Card 1 */}
            <Card className="min-w-0">
              <CardHeader className="gap-1">
                <CardDescription className="truncate text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
                  Total Paket Terkirim
                </CardDescription>
                <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800">
                  {durationStats.count} Paket
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex w-full min-w-0 items-center gap-1.5 font-medium text-xs">
                  <BookOpen className="size-4 shrink-0 text-slate-400" />
                  <span className="truncate text-slate-500">Pengiriman selesai tersaring</span>
                </div>
              </CardFooter>
            </Card>

            {/* Card 2 */}
            <Card className="min-w-0">
              <CardHeader className="gap-1">
                <CardDescription className="truncate text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider">
                  Rata-rata Waktu Kirim
                </CardDescription>
                <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800">
                  {durationStats.avgStr}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex w-full min-w-0 items-center gap-1.5 font-medium text-xs">
                  <Clock className="size-4 shrink-0 text-slate-400" />
                  <span className="truncate text-slate-500">
                    Dihitung sejak pickup s.d delivered
                  </span>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Table grid matching shipments browse table style */}
          <Card className="w-full">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                <div className="relative w-full sm:max-w-sm">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Cari ID Pesanan, Kota, atau Penerima..."
                    className="pl-9 rounded-sm w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {processedHistory.length === 0 ? (
                <div className="py-24 text-center bg-white">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-slate-300 opacity-60" />
                  <p className="text-xs font-bold text-slate-700">Tidak Ada Riwayat Ditemukan</p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1">
                    Anda belum memiliki pengiriman berstatus terkirim pada filter ini.
                  </p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-25">Order ID</TableHead>
                        <TableHead>Asal / Penjemputan</TableHead>
                        <TableHead>Penerima</TableHead>
                        <TableHead>Tujuan</TableHead>
                        <TableHead>Waktu Terkirim</TableHead>
                        <TableHead>Durasi Kirim</TableHead>
                        <TableHead className="text-right"></TableHead>
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
                            className="hover:bg-slate-50/50 transition-colors"
                          >
                            <TableCell className="font-medium text-xs">
                              <span className="font-mono text-xs font-bold text-slate-500 block">
                                #{ship.order_id}
                              </span>
                              <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                                ID: #{ship.id}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-slate-700">
                              <span className="flex items-center gap-1">
                                <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                                {ship.pickup_address.city}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium block mt-0.5 max-w-[180px] truncate">
                                {ship.pickup_address.full_address}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-slate-800">
                              {ship.delivery_address.recipient_name}
                            </TableCell>
                            <TableCell className="text-xs font-medium text-slate-700">
                              <span className="block font-semibold text-slate-800">
                                {ship.delivery_address.city}
                              </span>
                              <span className="text-[10px] text-slate-400 font-medium block mt-0.5 max-w-[180px] truncate">
                                {ship.delivery_address.full_address}
                              </span>
                            </TableCell>
                            <TableCell className="text-xs font-semibold text-slate-600">
                              <span className="block">{deliverDateFormatted} WIB</span>
                              <span className="text-[9px] text-slate-400 font-bold block mt-0.5">
                                Pickup: {pickupDateFormatted} WIB
                              </span>
                            </TableCell>
                            <TableCell className="text-xs font-bold text-slate-800 tabular-nums">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                {getDurationStr(ship.picked_up_at, ship.delivered_at)}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100 cursor-pointer rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0"
                                  >
                                    <MoreHorizontal className="h-4 w-4" />
                                    <span className="sr-only">Menu aksi</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-40 rounded-xl">
                                  <DropdownMenuItem
                                    asChild
                                    className="cursor-pointer font-semibold text-xs"
                                  >
                                    <Link href={`/dashboard/logistik/shipments/${ship.order_id}`}>
                                      Histori Timeline
                                    </Link>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}

              {/* Pagination */}
              {processedHistory.length > 0 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <div className="flex-1 text-sm text-muted-foreground">
                    ditemukan {(page - 1) * 10 + 1}-{Math.min(page * 10, totalPages * 10)} dari
                    total {totalPages * 10} riwayat pengiriman
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page <= 1}
                    >
                      Sebelumnya
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page >= totalPages}
                    >
                      Berikutnya
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
