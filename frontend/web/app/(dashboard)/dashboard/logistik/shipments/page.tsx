'use client';

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { logisticsService, IShipment } from '@/services/logistics';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
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
import {
  Search,
  Sprout,
  RefreshCw,
  AlertTriangle,
  ArrowUpDown,
  MapPin,
  Layers,
} from 'lucide-react';
import Link from 'next/link';

const MOCK_SHIPMENTS = [
  {
    id: 'SH-7701',
    order_id: 'ORD-98831',
    logistic_id: 'L-01',
    status: 'pending_pickup' as const,
    items_count: 3,
    pickup_address: {
      province: 'Jawa Timur',
      city: 'Lamongan',
      full_address: 'Greenhouse Budi, Desa Paciran',
    },
    delivery_address: {
      province: 'Jawa Timur',
      city: 'Surabaya',
      full_address: 'Jl. Pemuda No. 12',
      recipient_name: 'Andi Wijaya',
    },
    created_at: '2026-05-27T08:00:00Z',
    updated_at: '2026-05-27T08:00:00Z',
  },
  {
    id: 'SH-7702',
    order_id: 'ORD-98822',
    logistic_id: 'L-01',
    status: 'picked_up' as const,
    items_count: 1,
    pickup_address: {
      province: 'Jawa Timur',
      city: 'Lamongan',
      full_address: 'Lahan Siti, Desa Paciran',
    },
    delivery_address: {
      province: 'Jawa Timur',
      city: 'Sidoarjo',
      full_address: 'Perum Asri B3',
      recipient_name: 'Dewi Lestari',
    },
    created_at: '2026-05-26T10:00:00Z',
    updated_at: '2026-05-26T12:00:00Z',
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
      full_address: 'Jl. Raya Kebomas 54',
      recipient_name: 'Hadi Susanto',
    },
    created_at: '2026-05-25T14:00:00Z',
    updated_at: '2026-05-26T08:00:00Z',
  },
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
    created_at: '2026-05-24T10:00:00Z',
    updated_at: '2026-05-25T09:30:00Z',
  },
];

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
        limit: 15,
      }),
  });

  const isQueryError = isError;

  React.useEffect(() => {
    if (isQueryError) {
      toast.error('Layanan pengiriman offline. Menggunakan data demo lokal.', {
        description:
          'Menampilkan data mutasi pengiriman simulasi agar Anda tetap dapat menjelajahi layout.',
        duration: 5000,
      });
    }
  }, [isQueryError]);

  const rawShipments = (
    isQueryError ? MOCK_SHIPMENTS : shipmentsResponse?.data?.shipments || MOCK_SHIPMENTS
  ) as IShipment[];

  // Filter client-side for search queries
  const processedShipments = React.useMemo(() => {
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
  }, [rawShipments, searchQuery]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_pickup':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Menunggu Pickup
          </span>
        );
      case 'picked_up':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            Diambil
          </span>
        );
      case 'in_transit':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Transit
          </span>
        );
      case 'delivered':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
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
      {/* Offline Alert */}
      {isQueryError && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 text-amber-800 shadow-xs">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0" />
            <div>
              <p className="text-xs font-bold">Layanan Pengiriman Offline</p>
              <p className="text-[10px] text-amber-600 font-medium">
                Menampilkan data simulasi kurir lokal. Kueri server dibatasi.
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
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Daftar Semua Pengiriman
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Gunakan tabel ini untuk mencari, menyaring, dan memantau seluruh paket yang ditugaskan.
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Cari ID Pesanan atau Nama Penerima..."
            className="pl-10 h-10 border-slate-200 text-xs font-medium focus:border-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="w-full md:w-[220px]">
          <Select
            value={selectedStatus}
            onValueChange={(val) => {
              setSelectedStatus(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="h-10 border-slate-200 text-xs font-medium focus:border-green-500 cursor-pointer">
              <span className="flex items-center gap-1.5">
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

      {/* Table grid */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          {processedShipments.length === 0 ? (
            <div className="py-24 text-center bg-white">
              <Sprout className="w-12 h-12 mx-auto mb-4 text-slate-300 opacity-60 animate-bounce" />
              <p className="text-xs font-bold text-slate-700">Tidak Ada Paket Ditemukan</p>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                Coba sesuaikan kata kunci pencarian atau filter status Anda.
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
                    <TableHead className="h-10 text-slate-600 font-bold text-xs">Status</TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs">
                      Jumlah Item
                    </TableHead>
                    <TableHead className="h-10 text-slate-600 font-bold text-xs text-right pr-6">
                      Aksi
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {processedShipments.map((ship) => {
                    const dateFormatted = new Date(ship.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    });

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
                            Diterima: {dateFormatted}
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
                            {ship.delivery_address.recipient_name || 'Hamba Allah'}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold block mt-0.5 max-w-[180px] truncate">
                            {ship.delivery_address.full_address} ({ship.delivery_address.city})
                          </span>
                        </TableCell>
                        <TableCell className="py-4">{getStatusBadge(ship.status)}</TableCell>
                        <TableCell className="py-4 text-xs font-bold text-slate-700 tabular-nums">
                          {ship.items_count} Item
                        </TableCell>
                        <TableCell className="py-4 text-right pr-6">
                          <Link href={`/dashboard/logistik/shipments/${ship.order_id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 text-[10px] font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
                            >
                              Detail & Aksi
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
