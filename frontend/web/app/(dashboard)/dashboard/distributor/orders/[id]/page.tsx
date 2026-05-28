'use client';

import * as React from 'react';
import Link from 'next/link';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/order';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ChevronLeft,
  Truck,
  MapPin,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  Phone,
  Building,
} from 'lucide-react';

interface OrderItem {
  id: string;
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
}

interface OrderDetail {
  id: string;
  total_amount: number;
  created_at: string;
  status: string;
  payment_method: string;
  shipping_address: {
    full_name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postal_code: string;
  };
  seller: {
    id: string;
    full_name: string;
    phone: string;
    location: string;
  };
  items: OrderItem[];
  fee: number;
  shipping_cost: number;
}

const MOCK_ORDER_DETAIL: OrderDetail = {
  id: 'ORD-98822',
  total_amount: 14500000,
  created_at: '2026-05-27T08:00:00Z',
  status: 'shipped',
  payment_method: 'midtrans',
  shipping_address: {
    full_name: 'Distributor Sembako Mandiri',
    phone: '0812-3456-7890',
    address: 'Gudang Utama Blok C, Jl. Raya Industri No. 45',
    city: 'Surabaya',
    province: 'Jawa Timur',
    postal_code: '60112',
  },
  seller: {
    id: 'farmer-1',
    full_name: 'Budi Santoso',
    phone: '0821-2233-4455',
    location: 'Banyuwangi, Jawa Timur',
  },
  items: [
    {
      id: 'item-1',
      product_id: 'prod-1',
      title: 'Beras Pandan Wangi Organik',
      price: 18000,
      quantity: 500, // bulk quantity
      unit: 'kg',
      image: 'https://placehold.co/600x400?text=Beras+Pandan+Wangi',
    },
    {
      id: 'item-2',
      product_id: 'prod-2',
      title: 'Tomat Merah Segar',
      price: 12000,
      quantity: 300,
      unit: 'kg',
      image: 'https://placehold.co/600x400?text=Tomat+Segar',
    },
    {
      id: 'item-3',
      product_id: 'prod-3',
      title: 'Cabai Rawit Merah Super',
      price: 45000,
      quantity: 40,
      unit: 'kg',
      image: 'https://placehold.co/600x400?text=Cabai+Rawit',
    },
  ],
  fee: 10000,
  shipping_cost: 170000,
};

export default function DistributorOrderDetailPage({ params }: { params: { order_id: string } }) {
  const orderId = params.order_id || 'ORD-98822';
  const queryClient = useQueryClient();
  const [isOffline, setIsOffline] = React.useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ['distributor-order-detail', orderId],
    queryFn: async () => {
      try {
        const res = await orderService.getOrderById(orderId);
        if (!res) throw new Error('Not Found');
        return res;
      } catch {
        setIsOffline(true);
        return MOCK_ORDER_DETAIL;
      }
    },
  });

  // Payment mutation
  const payMutation = useMutation({
    mutationFn: async () => {
      try {
        await orderService.initiatePayment(orderId);
        toast.success('Menginisiasi gateway pembayaran...');
      } catch {
        // Local simulation fallback: update query client cache directly
        queryClient.setQueryData(['distributor-order-detail', orderId], (old: unknown) => {
          const currentDetail =
            (old as OrderDetail) || (MOCK_ORDER_DETAIL as unknown as OrderDetail);
          return { ...currentDetail, status: 'paid' } as OrderDetail;
        });
        toast.success('[Simulasi] Pembayaran grosir sukses!', {
          description: 'Status diperbarui menjadi Dibayar.',
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor-order-detail', orderId] });
    },
  });

  // Confirm receipt mutation
  const confirmMutation = useMutation({
    mutationFn: async () => {
      try {
        await orderService.confirmReceipt(orderId);
        toast.success('Pesanan berhasil diselesaikan!');
      } catch {
        // Local simulation fallback: update query client cache directly
        queryClient.setQueryData(['distributor-order-detail', orderId], (old: unknown) => {
          const currentDetail =
            (old as OrderDetail) || (MOCK_ORDER_DETAIL as unknown as OrderDetail);
          return { ...currentDetail, status: 'completed' } as OrderDetail;
        });
        toast.success('[Simulasi] Pengiriman telah diterima distributor!', {
          description: 'Sisa stok produk otomatis terisi di persediaan gudang.',
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['distributor-order-detail', orderId] });
    },
  });

  if (isLoading || !order) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  const localDetail = order as OrderDetail;

  // Cost calculations
  const subtotal = localDetail.items.reduce(
    (sum: number, item: OrderItem) => sum + item.price * item.quantity,
    0
  );
  const platformFee = localDetail.fee || 10000;
  const shippingCost = localDetail.shipping_cost || 170000;
  const totalPayable = subtotal + platformFee + shippingCost;

  const statusColors: Record<string, string> = {
    pending_payment: 'bg-amber-50 text-amber-700 border-amber-200/50',
    paid: 'bg-blue-50 text-blue-700 border-blue-200/50',
    confirmed: 'bg-purple-50 text-purple-700 border-purple-200/50',
    shipped: 'bg-indigo-50 text-indigo-700 border-indigo-200/50',
    completed: 'bg-green-50 text-green-700 border-green-200/50',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200/50',
  };

  const statusLabels: Record<string, string> = {
    pending_payment: 'Menunggu Pembayaran',
    paid: 'Telah Dibayar (Menunggu Konfirmasi)',
    confirmed: 'Dikonfirmasi Petani (Menunggu Pickup)',
    shipped: 'Dalam Pengiriman Kurir',
    completed: 'Selesai (Diterima)',
    cancelled: 'Dibatalkan',
  };

  // Tracking Timeline steps
  const trackingTimeline = [
    { label: 'Pesanan Dibuat', done: true, time: '2026-05-27T08:00:00Z' },
    {
      label: 'Pembayaran Sukses',
      done: ['paid', 'confirmed', 'shipped', 'completed'].includes(localDetail.status),
      time: '2026-05-27T08:15:00Z',
    },
    {
      label: 'Pesanan Dikonfirmasi Petani',
      done: ['confirmed', 'shipped', 'completed'].includes(localDetail.status),
      time: '2026-05-27T10:30:00Z',
    },
    {
      label: 'Diserahkan ke Logistik / Dikirim',
      done: ['shipped', 'completed'].includes(localDetail.status),
      time: '2026-05-28T09:00:00Z',
    },
    {
      label: 'Selesai / Diterima',
      done: localDetail.status === 'completed',
      time: localDetail.status === 'completed' ? '2026-05-28T15:00:00Z' : undefined,
    },
  ];

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/distributor/orders"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali ke Daftar Pesanan
        </Link>
      </div>

      {/* Header Title */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              Detail Pesanan {localDetail.id}
            </h1>
            <span
              className={`inline-flex items-center rounded-lg border px-2.5 py-0.5 text-[10px] font-bold ${statusColors[localDetail.status] || 'bg-slate-50 text-slate-600'}`}
            >
              {statusLabels[localDetail.status] || localDetail.status}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            Dibuat pada:{' '}
            {new Date(localDetail.created_at).toLocaleString('id-ID', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>

        <div className="flex gap-2 shrink-0">
          {localDetail.status === 'pending_payment' && (
            <Button
              onClick={() => payMutation.mutate()}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs h-10 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
              disabled={payMutation.isPending}
            >
              <CreditCard className="w-4 h-4" /> Bayar Sekarang
            </Button>
          )}

          {localDetail.status === 'shipped' && (
            <Button
              onClick={() => confirmMutation.mutate()}
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-10 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
              disabled={confirmMutation.isPending}
            >
              <CheckCircle2 className="w-4 h-4" /> Konfirmasi Diterima
            </Button>
          )}

          {localDetail.status === 'completed' && (
            <Link href="/dashboard/distributor/finance/invoices">
              <Button
                variant="outline"
                className="border-slate-200 text-slate-700 font-bold text-xs h-10 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-4 h-4" /> Lihat Invoice PDF
              </Button>
            </Link>
          )}
        </div>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] text-amber-600/90 font-medium mt-0.5 leading-relaxed">
              Mutasi pembayaran dan konfirmasi selesai pesanan disimulasikan secara memori luring
              lokal.
            </p>
          </div>
        </div>
      )}

      {/* Grid: Address Information and Tracking Timeline */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Order Addresses & Details */}
        <div className="md:col-span-2 space-y-6">
          {/* Card 1: Order Items Table */}
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-50">
              <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Daftar Komoditas Grosir
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider py-3 pl-4">
                        Produk
                      </th>
                      <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right">
                        Harga Unit
                      </th>
                      <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-center">
                        Jumlah Grosir
                      </th>
                      <th className="text-[10px] font-bold text-slate-500 uppercase tracking-wider text-right pr-4">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {localDetail.items.map((item: OrderItem) => (
                      <tr key={item.id} className="hover:bg-slate-50/20">
                        <td className="py-3.5 pl-4 flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200/60 bg-slate-50">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                              {item.title}
                            </h4>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                              Satuan: per {item.unit}
                            </p>
                          </div>
                        </td>
                        <td className="text-xs font-semibold text-slate-600 text-right">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="text-xs font-bold text-slate-800 text-center">
                          {item.quantity} {item.unit}
                        </td>
                        <td className="text-xs font-bold text-slate-800 text-right pr-4">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Total Summary Breakdown */}
              <div className="p-4 bg-slate-50/50 border-t border-slate-100 space-y-2.5 text-xs font-semibold text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal Barang</span>
                  <span className="text-slate-800 font-bold">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Logistik Rantai Pasok (Bulk Delivery)</span>
                  <span className="text-slate-800 font-bold">{formatCurrency(shippingCost)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Layanan Platform (B2B Bidding Fee)</span>
                  <span className="text-slate-800 font-bold">{formatCurrency(platformFee)}</span>
                </div>
                <div className="flex justify-between pt-2.5 border-t border-slate-200/80 text-sm font-bold text-slate-800">
                  <span>Total Pembayaran Grosir</span>
                  <span className="text-green-600 text-base">{formatCurrency(totalPayable)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Shipper & Recipient details */}
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Sender / Farmer */}
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/20 flex flex-row items-center gap-2 space-y-0">
                <Building className="h-4 w-4 text-green-600" />
                <CardTitle className="text-[11.5px] font-bold text-slate-700 uppercase tracking-wider block">
                  Asal Pengiriman (Supplier)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="font-bold text-slate-800">{localDetail.seller.full_name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="font-medium">{localDetail.seller.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">
                    Greenhouse Petani Mandiri, {localDetail.seller.location}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recipient / Distributor */}
            <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
              <CardHeader className="pb-3 border-b border-slate-50 bg-slate-50/20 flex flex-row items-center gap-2 space-y-0">
                <Truck className="h-4 w-4 text-blue-600" />
                <CardTitle className="text-[11.5px] font-bold text-slate-700 uppercase tracking-wider block">
                  Tujuan Pengiriman (Gudang)
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="font-bold text-slate-800">
                    {localDetail.shipping_address.full_name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span className="font-medium">{localDetail.shipping_address.phone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">
                    {localDetail.shipping_address.address}, {localDetail.shipping_address.city},{' '}
                    {localDetail.shipping_address.province},{' '}
                    {localDetail.shipping_address.postal_code}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side: Tracking Stage Timeline */}
        <Card className="border-slate-200 shadow-sm bg-white h-fit">
          <CardHeader className="pb-3 border-b border-slate-50">
            <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Status Garis Waktu
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="relative border-l border-slate-200 ml-3.5 space-y-6">
              {trackingTimeline.map((step, idx) => (
                <div key={idx} className="relative pl-6">
                  {/* Blinking indicator or check */}
                  <div
                    className={`absolute -left-3.5 top-0.5 flex h-7 w-7 items-center justify-center rounded-full border bg-white ${
                      step.done
                        ? 'border-green-600 text-green-600 bg-green-50'
                        : 'border-slate-200 text-slate-400'
                    }`}
                  >
                    {step.done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 fill-green-50" />
                    ) : (
                      <Calendar className="h-3.5 w-3.5 shrink-0" />
                    )}
                  </div>

                  <div>
                    <h4
                      className={`text-xs font-bold ${step.done ? 'text-slate-800' : 'text-slate-400'}`}
                    >
                      {step.label}
                    </h4>
                    {step.time && (
                      <p className="text-[10px] font-semibold text-slate-400 mt-1">
                        {new Date(step.time).toLocaleString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit',
                          day: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
