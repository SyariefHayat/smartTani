'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { logisticsService } from '@/services/logistics';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Truck,
  MapPin,
  Calendar,
  UserCheck,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Mail,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ order_id: string }>;
}

export default function AdminShipmentDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { order_id } = React.use(params);
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
  const [showAssignModal, setShowAssignModal] = React.useState(false);

  // Fetch Shipment Details
  const { data: shipment, isLoading } = useQuery<any>({
    queryKey: ['admin-shipment-detail', order_id],
    queryFn: async () => {
      try {
        const res = await logisticsService.getShipmentByOrderId(order_id);
        return res;
      } catch {
        setIsOffline(true);
        // Fallback from localStorage
        const stored = JSON.parse(localStorage.getItem('admin-shipments') || '[]');
        const found = stored.find((s: any) => s.order_id === order_id);
        if (!found) throw new Error('Shipment not found');
        return found;
      }
    },
  });

  // Assign courier mutation
  const assignCourierMutation = useMutation({
    mutationFn: async ({ courierId, courierName }: { courierId: string; courierName: string }) => {
      const stored = JSON.parse(localStorage.getItem('admin-shipments') || '[]');
      const updated = stored.map((s: any) =>
        s.order_id === order_id
          ? { ...s, courier_id: courierId, courier_name: courierName, status: 'pending_pickup' }
          : s
      );
      localStorage.setItem('admin-shipments', JSON.stringify(updated));
    },
    onSuccess: () => {
      toast.success('Kurir berhasil ditugaskan ke manifest pengiriman!');
      setShowAssignModal(false);
      queryClient.invalidateQueries({ queryKey: ['admin-shipment-detail', order_id] });
      queryClient.invalidateQueries({ queryKey: ['admin-shipments-list'] });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_pickup':
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Menunggu Pickup</Badge>
        );
      case 'in_transit':
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">Dalam Perjalanan</Badge>
        );
      case 'delivered':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Diterima</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-80 md:col-span-2 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!shipment) {
    return (
      <div className="w-full text-center py-20">
        <h3 className="text-sm font-bold text-slate-700">Pengiriman Tidak Ditemukan</h3>
        <Link href="/admin/shipments">
          <Button size="sm" className="mt-4 bg-green-600 text-white rounded-xl">
            Kembali ke Daftar
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Back button */}
      <div>
        <Link
          href="/admin/shipments"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali ke Manifest Pengiriman
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
          Detail Pengiriman: #{shipment.order_id} {getStatusBadge(shipment.status)}
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Ulas rincian manifes ekspedisi, pantau kurir pengantar komoditas, and assign petugas
          unassigned secara aman.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Logistics Service sedang tidak terhubung. Seluruh histori penugasan kurir di-update
              secara luring.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Columns: Shipment and Address details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">
                Detail Manifes Pengiriman
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5 text-xs font-semibold text-slate-700">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block">Tujuan Alamat Penerima</span>
                  <span className="text-slate-800 flex items-start gap-1.5 leading-relaxed">
                    <MapPin className="h-4.5 w-4.5 text-slate-400 shrink-0 mt-0.5" />
                    {shipment.address}
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block">Tanggal Dibuat Manifest</span>
                  <span className="text-slate-800 flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {new Date(shipment.created_at).toLocaleString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <span className="text-xs font-bold text-slate-800 block">
                  Status Lacak Pengiriman
                </span>
                <div className="relative border-l border-slate-150 pl-5 ml-2.5 space-y-6">
                  {/* Step Delivered */}
                  <div className="relative flex gap-3">
                    <div
                      className={`absolute -left-7.5 top-0.5 h-5 w-5 rounded-full border border-white flex items-center justify-center shadow-sm ${shipment.status === 'delivered' ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Barang Diterima Pelanggan
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        Paket diserahkan dengan tanda tangan penerima.
                      </p>
                    </div>
                  </div>

                  {/* Step Transit */}
                  <div className="relative flex gap-3">
                    <div
                      className={`absolute -left-7.5 top-0.5 h-5 w-5 rounded-full border border-white flex items-center justify-center shadow-sm ${['in_transit', 'delivered'].includes(shipment.status) ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                    >
                      <Truck className="h-3 w-3" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Paket Dalam Transit Perjalanan
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        Kurir logistik mengantarkan ke alamat tujuan.
                      </p>
                    </div>
                  </div>

                  {/* Step Pickup */}
                  <div className="relative flex gap-3">
                    <div
                      className={`absolute -left-7.5 top-0.5 h-5 w-5 rounded-full border border-white flex items-center justify-center shadow-sm ${shipment.courier_id ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-400'}`}
                    >
                      <Clock className="h-3 w-3" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">
                        Menunggu Kurir Melakukan Pickup
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                        Order terkonfirmasi, barang siap dipickup di gudang petani.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Courier assignment info */}
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-800">
                Kurir Pengirim (Logistik)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs font-semibold text-slate-700">
              {shipment.courier_id ? (
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold block">Nama Lengkap Kurir</span>
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <User className="h-4 w-4 text-slate-400" /> {shipment.courier_name}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold block">Kontak Layanan Telepon</span>
                    <span className="text-slate-800 flex items-center gap-1.5">
                      <Phone className="h-4 w-4 text-slate-400" /> +62 823-2695-2833
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5">
                  <div className="p-3 bg-red-50 border border-red-100 text-red-800 rounded-xl">
                    <p className="text-[10px] font-bold">Peringatan: Belum Ada Kurir Ditugaskan</p>
                  </div>
                  <Button
                    onClick={() => setShowAssignModal(true)}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold gap-1.5 py-4 cursor-pointer"
                  >
                    <UserCheck className="h-4.5 w-4.5" /> Tugaskan Kurir Sekarang
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assign Courier Modal popup */}
      {showAssignModal && (
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
                        courierId: c.id,
                        courierName: c.full_name,
                      })
                    }
                    className="w-full p-3 text-left bg-slate-50 hover:bg-green-50 border border-slate-100 hover:border-green-200 rounded-xl text-xs font-bold text-slate-700 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span>{c.full_name}</span>
                    <span className="text-[9px] text-green-700 bg-green-100 px-2 py-0.5 rounded-md">
                      Logistik
                    </span>
                  </button>
                ))}
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50 border-t border-slate-100 p-3.5 flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowAssignModal(false)}
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
