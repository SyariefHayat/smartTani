'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { logisticsService, IShipment } from '@/services/logistics';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, MapPin, MoreHorizontal, Layers, AlertTriangle, Sprout } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
export default function LogisticsShipmentsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('all');
  const [page, setPage] = React.useState(1);

  const {
    data: shipmentsResponse,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['logistics-shipments-browse', page, selectedStatus],
    queryFn: () =>
      logisticsService.getShipments({
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        page,
        limit: 10,
      }),
  });

  const isQueryError = isError;

  const totalPages = shipmentsResponse?.data?.meta?.totalPages || 1;

  // Filter client-side for search queries
  const processedShipments = React.useMemo(() => {
    const rawShipments = (shipmentsResponse?.data?.shipments || []) as IShipment[];
    let result = [...rawShipments];

    // Filter by search query
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

  if (isLoading && !isQueryError) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="flex flex-col md:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-[200px]" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Daftar Semua Pengiriman
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Gunakan tabel ini untuk mencari, menyaring, dan memantau seluruh paket yang ditugaskan
          kepada Anda.
        </p>
      </div>

      {/* Table grid with Unified Filters inside CardHeader matching reference style */}
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <div className="relative w-full sm:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Cari pengiriman..."
                className="pl-9 rounded-sm w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="w-full sm:w-[180px]">
              <Select
                value={selectedStatus}
                onValueChange={(val) => {
                  setSelectedStatus(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="rounded-sm cursor-pointer">
                  <span className="flex items-center gap-1.5 text-xs font-medium">
                    <Layers className="h-4 w-4 text-slate-400" /> Filter Status
                  </span>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="text-xs cursor-pointer">
                    Semua Status
                  </SelectItem>
                  <SelectItem value="pending_pickup" className="text-xs cursor-pointer">
                    Menunggu Pickup
                  </SelectItem>
                  <SelectItem value="picked_up" className="text-xs cursor-pointer">
                    Diambil
                  </SelectItem>
                  <SelectItem value="in_transit" className="text-xs cursor-pointer">
                    Transit
                  </SelectItem>
                  <SelectItem value="delivered" className="text-xs cursor-pointer">
                    Terkirim
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isQueryError ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg border border-dashed border-red-200 bg-red-50">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 mb-3 border border-red-200">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <p className="text-sm font-bold text-red-600">Koneksi ke Server Terputus</p>
              <p className="text-xs text-red-400 font-medium mt-1 mb-4">
                Gagal mengambil data pengiriman terbaru dari server Layanan Logistik.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="border-red-200 text-red-700 bg-white hover:bg-red-50 font-bold text-xs cursor-pointer rounded-lg px-4"
              >
                Coba Hubungkan Kembali
              </Button>
            </div>
          ) : processedShipments.length === 0 ? (
            <div className="py-24 text-center bg-white">
              <Sprout className="w-12 h-12 mx-auto mb-4 text-slate-300 opacity-60" />
              <p className="text-xs font-bold text-slate-700">Tidak Ada Paket Ditemukan</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                Coba sesuaikan kata kunci pencarian atau filter status Anda.
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
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Jumlah Item</TableHead>
                    <TableHead className="text-right"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedShipments.map((ship) => {
                    const statusColors: Record<string, string> = {
                      pending_pickup: 'bg-slate-50 text-slate-700 border-slate-200/50',
                      picked_up: 'bg-blue-50 text-blue-700 border-blue-200/50',
                      in_transit: 'bg-amber-50 text-amber-700 border-amber-200/50',
                      delivered: 'bg-green-50 text-green-700 border-green-200/50',
                    };

                    const statusLabels: Record<string, string> = {
                      pending_pickup: 'Menunggu Pickup',
                      picked_up: 'Diambil',
                      in_transit: 'Transit',
                      delivered: 'Terkirim',
                    };

                    return (
                      <TableRow key={ship.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-medium text-xs">
                          <span className="font-mono text-xs font-bold text-slate-500">
                            #{ship.order_id}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-700">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
                            {ship.pickup_address.city}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-800">
                          {ship.delivery_address.recipient_name}
                        </TableCell>
                        <TableCell className="text-xs font-medium text-slate-700">
                          {ship.delivery_address.city}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10.5px] font-bold ${statusColors[ship.status] || 'bg-slate-50 text-slate-600'}`}
                          >
                            {statusLabels[ship.status] || ship.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-xs font-medium text-slate-600">
                          {ship.items_count} Item
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
                                  Lihat Rincian
                                </Link>
                              </DropdownMenuItem>
                              {ship.status === 'pending_pickup' && (
                                <DropdownMenuItem
                                  asChild
                                  className="cursor-pointer font-semibold text-xs text-green-600 focus:text-green-600 focus:bg-green-50"
                                >
                                  <Link href="/dashboard/logistik/shipments/pending">
                                    Ambil Paket
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              {ship.status === 'picked_up' && (
                                <DropdownMenuItem
                                  asChild
                                  className="cursor-pointer font-semibold text-xs text-blue-600 focus:text-blue-600 focus:bg-blue-50"
                                >
                                  <Link href="/dashboard/logistik/shipments/active">
                                    Kirim Paket
                                  </Link>
                                </DropdownMenuItem>
                              )}
                              {ship.status === 'in_transit' && (
                                <DropdownMenuItem
                                  asChild
                                  className="cursor-pointer font-semibold text-xs text-amber-600 focus:text-amber-600 focus:bg-amber-50"
                                >
                                  <Link href="/dashboard/logistik/shipments/active">
                                    Update Transit
                                  </Link>
                                </DropdownMenuItem>
                              )}
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
          {!isQueryError && processedShipments.length > 0 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <div className="flex-1 text-sm text-muted-foreground">
                ditemukan {(page - 1) * 10 + 1}-{Math.min(page * 10, totalPages * 10)} dari total{' '}
                {totalPages * 10} pengiriman
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
    </div>
  );
}
