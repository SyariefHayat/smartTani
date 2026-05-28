'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, Truck, ShieldAlert, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface AlertsPanelProps {
  pendingUsers?: number;
  pendingProposals?: number;
  pendingOrders?: number;
  unassignedShipments?: number;
}

export function AlertsPanel({
  pendingUsers = 0,
  pendingProposals = 0,
  pendingOrders = 0,
  unassignedShipments = 0,
}: AlertsPanelProps) {
  const alertsList = [
    {
      id: 'pending-users',
      type: 'warning',
      title: 'Pendaftaran Menunggu Verifikasi',
      description: `${pendingUsers} pengguna baru memerlukan verifikasi dokumen identitas.`,
      count: pendingUsers,
      link: '/admin/users?status=pending_verification',
      icon: ShieldAlert,
      color: 'bg-amber-50 border-amber-200 text-amber-800',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-100',
    },
    {
      id: 'pending-proposals',
      type: 'info',
      title: 'Proposal Proyek Menunggu Review',
      description: `${pendingProposals} proposal penggalangan dana kelompok tani perlu ditinjau kelayakannya.`,
      count: pendingProposals,
      link: '/admin/proposals?status=pending',
      icon: Clock,
      color: 'bg-blue-50 border-blue-200 text-blue-800',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-100',
    },
    {
      id: 'pending-orders',
      type: 'danger',
      title: 'Pesanan Tertahan (>48 Jam)',
      description: `${pendingOrders} pesanan belum diproses oleh mitra penjual.`,
      count: pendingOrders,
      link: '/admin/orders?status=pending',
      icon: AlertTriangle,
      color: 'bg-red-50 border-red-200 text-red-800',
      iconColor: 'text-red-600',
      iconBg: 'bg-red-100',
    },
    {
      id: 'unassigned-shipments',
      type: 'warning',
      title: 'Pengiriman Belum Di-assign Kurir',
      description: `${unassignedShipments} pengiriman barang B2B/B2C belum memiliki kurir pengantar.`,
      count: unassignedShipments,
      link: '/admin/shipments?status=unassigned',
      icon: Truck,
      color: 'bg-orange-50 border-orange-200 text-orange-800',
      iconColor: 'text-orange-600',
      iconBg: 'bg-orange-100',
    },
  ].filter((alert) => alert.count > 0);

  if (alertsList.length === 0) {
    return null;
  }

  return (
    <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <CardTitle className="text-sm font-bold text-slate-800">
            Perhatian Penting (Pusat Kendali Admin)
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-3">
        {alertsList.map((alert) => {
          const IconComponent = alert.icon;
          return (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${alert.color}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 ${alert.iconBg}`}>
                  <IconComponent className={`h-4.5 w-4.5 ${alert.iconColor}`} />
                </div>
                <div>
                  <h4 className="text-xs font-bold">{alert.title}</h4>
                  <p className="text-[11px] font-semibold opacity-90 mt-0.5">{alert.description}</p>
                </div>
              </div>
              <div className="shrink-0 flex self-end md:self-center">
                <Link href={alert.link}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-[10px] font-bold gap-1 rounded-lg border-current hover:bg-black/5"
                  >
                    Tindak Lanjut <ArrowRight className="h-3 w-3" />
                  </Button>
                </Link>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
