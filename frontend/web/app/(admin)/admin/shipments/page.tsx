'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logisticsService } from '@/services/logistics';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminStatsCards, AdminStatItem } from '@/components/features/admin/shared/AdminStatsCards';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  Truck,
  Search,
  Eye,
  AlertTriangle,
  UserCheck,
  ShieldAlert,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import Link from 'next/link';

interface Shipment {
  id: string;
  order_id: string;
  courier_id?: string;
  courier_name?: string;
  address: string;
  status: 'pending_pickup' | 'in_transit' | 'delivered';
  created_at: string;
}

const MOCK_SHIPMENTS: Shipment[] = [
  {
    id: 'ship-1',
    order_id: 'order-1',
    courier_id: 'usr-6',
    courier_name: 'Kurir Kilat Lamongan',
    address: 'Jl. Pemuda No. 12, Lamongan, Jawa Timur',
    status: 'delivered',
    created_at: '2026-05-28T09:00:00Z',
  },
  {
    id: 'ship-2',
    order_id: 'order-2',
    address: 'Kec. Sukodadi, Lamongan, Jawa Timur',
    status: 'pending_pickup',
    created_at: '2026-05-28T10:00:00Z',
  },
  {
    id: 'ship-3',
    order_id: 'order-4',
    courier_id: 'usr-6',
    courier_name: 'Kurir Kilat Lamongan',
    address: 'Jl. Veteran No. 45, Gresik, Jawa Timur',
    status: 'in_transit',
    created_at: '2026-05-26T11:00:00Z',
  },
];

export default function AdminShipmentsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [isOffline, setIsOffline] = React.useState(false);
  const [couriers] = React.useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      const storedUsers = JSON.parse(localStorage.getItem('admin-users') || '[]');
      const loggedCouriers = storedUsers.filter((u: any) => u.role === 'logistik');
      return loggedCouriers.length > 0
        ? loggedCouriers
        : [{ id: 'usr-6', full_name: 'Kurir Kilat Lamongan' }];
    }
    return [{ id: 'usr-6', full_name: 'Kurir Kilat Lamongan' }];
  });
  const [assigningShipId, setAssigningShipId] = React.useState<string | null>(null);

  const status = searchParams.get('status') || 'all';

  // Initialize localStorage for shipments
  React.useEffect(() => {
    if (!localStorage.getItem('admin-shipments')) {
      localStorage.setItem('admin-shipments', JSON.stringify(MOCK_SHIPMENTS));
    }
  }, []);

  // Fetch Shipments
  const { data: shipments = [], isLoading } = useQuery<Shipment[]>({
    queryKey: ['admin-shipments-list', status],
    queryFn: async () => {
      try {
        const res = await logisticsService.getShipments();
        const apiShipments = res.data?.shipments || [];
        let list: Shipment[] = apiShipments.map((s: any) => ({
          id: s.id,
          order_id: s.order_id,
          courier_id: s.logistic_id,
          courier_name: s.courier_name || '',
          address: s.delivery_address?.full_address || '',
          status:
            s.status === 'picked_up'
              ? 'pending_pickup'
              : s.status === 'in_transit'
                ? 'in_transit'
                : 'delivered',
          created_at: s.created_at,
        }));
        if (status !== 'all') {
          if (status === 'unassigned') {
            list = list.filter((s: Shipment) => !s.courier_id);
          } else {
            list = list.filter((s: Shipment) => s.status === status);
          }
        }
        return list;
      } catch {
        setIsOffline(true);
        const stored = JSON.parse(localStorage.getItem('admin-shipments') || '[]');
        let filtered = [...stored];
        if (status !== 'all') {
          if (status === 'unassigned') {
            filtered = filtered.filter((s: Shipment) => !s.courier_id);
          } else {
            filtered = filtered.filter((s: Shipment) => s.status === status);
          }
        }
        return filtered;
      }
    },
  });

  // Calculate statistics from localStorage
  const stats = React.useMemo(() => {
    const stored = JSON.parse(
      (typeof window !== 'undefined' && localStorage.getItem('admin-shipments')) ||
        JSON.stringify(MOCK_SHIPMENTS)
    );
    const total = stored.length;
    const pending = stored.filter((s: any) => s.status === 'pending_pickup').length;
    const active = stored.filter((s: any) => s.status === 'in_transit').length;
    const unassigned = stored.filter((s: any) => !s.courier_id).length;
    return { total, pending, active, unassigned };
  }, [shipments]);

  const updateFilters = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === 'all') params.delete('status');
    else params.set('status', newStatus);
    router.push(`/admin/shipments?${params.toString()}`);
  };

  // Assign Courier mutation
  const assignCourierMutation = useMutation({
    mutationFn: async ({
      shipId,
      courierId,
      courierName,
    }: {
      shipId: string;
      courierId: string;
      courierName: string;
    }) => {
      // Offline fallback persistent assign
      const stored: Shipment[] = JSON.parse(localStorage.getItem('admin-shipments') || '[]');
      const updated = stored.map((s) =>
        s.id === shipId
          ? {
              ...s,
              courier_id: courierId,
              courier_name: courierName,
              status: 'pending_pickup' as any,
            }
          : s
      );
      localStorage.setItem('admin-shipments', JSON.stringify(updated));
    },
    onSuccess: () => {
      toast.success('Kurir berhasil ditugaskan ke pengiriman!');
      setAssigningShipId(null);
      queryClient.invalidateQueries({ queryKey: ['admin-shipments-list'] });
    },
  });

  const getStatusBadge = (ship: Shipment) => {
    if (!ship.courier_id) {
      return <Badge className="bg-red-100 text-red-700 border-red-200">Belum Ada Kurir</Badge>;
    }
    switch (ship.status) {
      case 'pending_pickup':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Menunggu Pickup</Badge>
        );
      case 'in_transit':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">Dalam Perjalanan</Badge>
        );
      case 'delivered':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Delivered</Badge>;
      default:
        return <Badge variant="outline">{ship.status}</Badge>;
    }
  };

  const statCards: AdminStatItem[] = [
    {
      label: 'Total Pengiriman',
      value: stats.total,
      icon: Truck,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      description: 'Volume pengiriman berjalan',
    },
    {
      label: 'Belum Di-assign',
      value: stats.unassigned,
      icon: ShieldAlert,
      color: 'text-red-700',
      bgColor: 'bg-red-100',
      description: 'Segera tentukan kurir pengantar',
    },
    {
      label: 'Menunggu Pickup',
      value: stats.pending,
      icon: Clock,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
      description: 'Kurir menuju lokasi petani',
    },
    {
      label: 'Dalam Perjalanan',
      value: stats.active,
      icon: Truck,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      description: 'Paket sedang diantarkan ke tujuan',
    },
  ];

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Kelola Pengiriman (Logistik) 🚚
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Awasi kelancaran pengiriman logistik, tugaskan kurir logistik unassigned, and lacak
            status pengiriman B2B and B2C.
          </p>
        </div>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Logistics Service sedang tidak terhubung. Seluruh penugasan kurir logistik disimpan di
              database peramban Anda.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <AdminStatsCards stats={statCards} loading={isLoading} />

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex justify-between items-center">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          Daftar Manifest Pengiriman
        </span>
        <div>
          <Select value={status} onValueChange={updateFilters}>
            <SelectTrigger className="w-[180px] bg-white border-slate-200 text-xs rounded-xl focus:ring-green-500 h-10">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-xl">
              <SelectItem value="all" className="text-xs cursor-pointer">
                Semua Status
              </SelectItem>
              <SelectItem value="unassigned" className="text-xs cursor-pointer">
                Belum Di-assign Kurir
              </SelectItem>
              <SelectItem value="pending_pickup" className="text-xs cursor-pointer">
                Menunggu Pickup
              </SelectItem>
              <SelectItem value="in_transit" className="text-xs cursor-pointer">
                Dalam Perjalanan
              </SelectItem>
              <SelectItem value="delivered" className="text-xs cursor-pointer">
                Diterima
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Shipments Table */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/70 border-b border-slate-100">
            <TableRow>
              <TableHead className="text-xs font-bold text-slate-700 p-4">Order ID</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Kurir Pengantar</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Alamat Pengiriman</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Status</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Tanggal Pengiriman</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 text-right p-4">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs font-semibold text-slate-700">
            {isLoading ? (
              [...Array(2)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="p-4">
                    <div className="h-4 bg-slate-100 rounded w-24 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-28 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-44 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-20 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-24 animate-pulse" />
                  </TableCell>
                  <TableCell className="text-right p-4">
                    <div className="h-8 bg-slate-100 rounded w-20 ml-auto animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : shipments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-400 font-semibold">
                  Tidak ada data pengiriman aktif.
                </TableCell>
              </TableRow>
            ) : (
              shipments.map((ship) => (
                <TableRow key={ship.id} className="hover:bg-slate-50/40 border-b border-slate-100">
                  <TableCell className="p-4 font-mono text-slate-800">{ship.order_id}</TableCell>
                  <TableCell>
                    {ship.courier_id ? (
                      <span className="text-slate-800 font-bold">{ship.courier_name}</span>
                    ) : (
                      <span className="text-red-500 font-bold">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{ship.address}</TableCell>
                  <TableCell>{getStatusBadge(ship)}</TableCell>
                  <TableCell>
                    {new Date(ship.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </TableCell>
                  <TableCell className="text-right p-4 space-x-2">
                    <Link href={`/admin/shipments/${ship.order_id}`} passHref legacyBehavior>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-600 border-slate-200 hover:bg-slate-50 gap-1 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> Detail
                      </Button>
                    </Link>

                    {!ship.courier_id && (
                      <Button
                        size="sm"
                        onClick={() => setAssigningShipId(ship.id)}
                        className="bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                      >
                        <UserCheck className="h-3.5 w-3.5 mr-1" /> Assign Kurir
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Inline Assign Courier Dialog */}
      {assigningShipId && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm border-slate-200 bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">
                Tugaskan Kurir Logistik
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                Pilih Kurir Aktif
              </span>
              <div className="space-y-2">
                {couriers.map((c) => (
                  <button
                    key={c.id}
                    onClick={() =>
                      assignCourierMutation.mutate({
                        shipId: assigningShipId,
                        courierId: c.id,
                        courierName: c.full_name,
                      })
                    }
                    className="w-full p-3 text-left bg-slate-50 hover:bg-green-50 border border-slate-100 hover:border-green-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>{c.full_name}</span>
                    <span className="text-[9px] text-green-700 uppercase bg-green-100 px-2 py-0.5 rounded-md font-mono">
                      Aktif
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t border-slate-100 p-3.5 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setAssigningShipId(null)}
                size="sm"
                className="text-xs font-bold border-slate-200 rounded-xl cursor-pointer"
              >
                Batal
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
