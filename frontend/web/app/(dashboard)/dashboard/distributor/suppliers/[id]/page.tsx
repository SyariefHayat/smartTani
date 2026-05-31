'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { distributorService } from '@/services/distributor';
import { marketplaceService } from '@/services/marketplace';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronLeft, MapPin, Handshake, TrendingUp, AlertTriangle } from 'lucide-react';

const MOCK_SUPPLIER_DETAIL = {
  farmer_id: 'farmer-1',
  name: 'Budi Santoso',
  location: 'Banyuwangi, Jawa Timur',
  total_transactions: 12,
  total_amount: 45000000,
  products_count: 8,
  last_order_date: '2026-05-27T08:00:00Z',
  joined_at: '2025-01-10',
  rating: 4.8,
  bio: 'Kelompok Tani Harapan Jaya Makmur Banyuwangi. Berfokus pada pertanian beras padi premium dan umbi-umbian organik bersertifikat dengan luas lahan tanam 5 hektar.',
};

const MOCK_SUPPLIER_PRODUCTS = [
  {
    id: 'prod-001',
    title: 'Beras Pandan Wangi Organik',
    price_per_unit: 18000,
    unit: 'kg',
    stock: 500,
    min_order: 100,
    images: ['https://placehold.co/600x400?text=Beras+Pandan+Wangi'],
    category: 'Biji-bijian & Kacang',
  },
  {
    id: 'prod-004',
    title: 'Kentang Dieng Super',
    price_per_unit: 12000,
    unit: 'kg',
    stock: 350,
    min_order: 100,
    images: ['https://placehold.co/600x400?text=Kentang+Dieng'],
    category: 'Umbi-umbian',
  },
];

const MOCK_SUPPLIER_TRANSACTIONS = [
  {
    id: 'ORD-98822',
    total_amount: 14500000,
    created_at: '2026-05-27T08:00:00Z',
    status: 'shipped',
  },
  {
    id: 'ORD-98755',
    total_amount: 6000000,
    created_at: '2026-05-18T16:00:00Z',
    status: 'completed',
  },
  {
    id: 'ORD-98612',
    total_amount: 22000000,
    created_at: '2026-04-28T11:00:00Z',
    status: 'completed',
  },
];

export default function DistributorSupplierDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = React.use(params);
  const farmerId = resolvedParams.id || 'farmer-1';
  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch supplier
  const { data: supplier } = useQuery({
    queryKey: ['distributor-supplier-detail', farmerId],
    queryFn: async () => {
      try {
        const res = await distributorService.getSupplierById(farmerId);
        if (!res) throw new Error('Not Found');
        return res;
      } catch {
        setIsOffline(true);
        return MOCK_SUPPLIER_DETAIL;
      }
    },
  });

  // Fetch products
  const { data: supplierProducts } = useQuery({
    queryKey: ['distributor-supplier-products', farmerId],
    queryFn: async () => {
      try {
        const res = (await marketplaceService.getProducts({})) as unknown as Record<
          string,
          unknown
        >;
        const resData = res.data as Record<string, unknown> | undefined;
        const productsArr = (resData?.products ||
          res.products ||
          (Array.isArray(res) ? res : [])) as Record<string, unknown>[];
        const filtered = productsArr.filter(
          (p) =>
            p.farmer_id === farmerId ||
            (p.farmer as Record<string, unknown> | undefined)?.id === farmerId
        );
        if (!filtered || filtered.length === 0) throw new Error('Empty');
        return filtered;
      } catch {
        return MOCK_SUPPLIER_PRODUCTS;
      }
    },
  });

  const activeSupplier = (supplier || MOCK_SUPPLIER_DETAIL) as typeof MOCK_SUPPLIER_DETAIL;
  const activeProducts = (supplierProducts ||
    MOCK_SUPPLIER_PRODUCTS) as unknown as typeof MOCK_SUPPLIER_PRODUCTS;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Back link */}
      <div>
        <Link
          href="/dashboard/distributor/suppliers"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors bg-white px-3 py-1.5 rounded-full border border-slate-200/60 shadow-xs hover:border-slate-300"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali ke Daftar Mitra Petani
        </Link>
      </div>

      {isOffline && (
        <div className="flex h-fit flex-col md:flex-row md:items-center justify-between gap-3 rounded-2xl border border-red-200 bg-red-50/80 px-4 py-3.5 text-xs text-red-800 font-semibold shadow-xs">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="h-4.5 w-4.5 shrink-0 text-red-600 mt-0.5 animate-pulse" />
            <div>
              <p className="font-bold text-red-900 text-xs">Layanan Mitra Petani Offline</p>
              <p className="text-[11px] text-red-600 font-medium mt-0.5 leading-relaxed">
                Detail profil petani mitra dan transaksi khusus disimulasikan menggunakan data
                offline lokal.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid: Supplier Info Bio */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Bio Card & Stats */}
        <div className="space-y-6">
          <Card className="border-slate-200/60 shadow-xs bg-white overflow-hidden rounded-2xl">
            <CardContent className="pt-6 space-y-5">
              {/* Header Profile */}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-base font-bold text-emerald-700 border border-emerald-100/60">
                  {activeSupplier.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{activeSupplier.name}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mt-1">
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-100 bg-slate-50/50 text-[9.5px] font-semibold text-slate-500">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span>{activeSupplier.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bio description */}
              <div className="space-y-1.5 pt-4 border-t border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Bio Petani / Produsen
                </h4>
                <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                  {activeSupplier.bio || 'Petani Mandiri berkualitas mitra tepercaya SmartTani.'}
                </p>
              </div>

              {/* Key numbers */}
              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs font-semibold text-slate-500">
                <div className="flex justify-between items-center">
                  <span>Rating Mitra</span>
                  <span className="text-slate-855 font-bold flex items-center gap-1">
                    <span className="text-amber-500 text-sm">★</span> {activeSupplier.rating || 4.8}{' '}
                    / 5.0
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Terdaftar Sejak</span>
                  <span className="text-slate-800 font-bold">
                    {activeSupplier.joined_at || 'Januari 2025'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cumulative Stats */}
          <div className="grid gap-4 grid-cols-2">
            <Card className="border-slate-200/60 shadow-xs bg-white overflow-hidden rounded-2xl">
              <CardContent className="pt-4 flex flex-col justify-between h-24">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Transaksi
                </span>
                <div className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <div className="h-6.5 w-6.5 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/50">
                    <Handshake className="h-3.5 w-3.5 text-emerald-600" />
                  </div>
                  <span>{activeSupplier.total_transactions} Kali</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200/60 shadow-xs bg-white overflow-hidden rounded-2xl">
              <CardContent className="pt-4 flex flex-col justify-between h-24">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                  Total Beli
                </span>
                <div className="text-xs font-bold text-slate-850 flex items-center gap-1 leading-snug">
                  <div className="h-6.5 w-6.5 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100/50">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <span className="truncate">{formatCurrency(activeSupplier.total_amount)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Side: Commodities Provided & Ledger History */}
        <div className="md:col-span-2 space-y-6">
          {/* Card 1: Active supplied products */}
          <Card className="border-slate-200/60 shadow-xs bg-white overflow-hidden rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-100/50">
              <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Komoditas yang Tersedia
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {activeProducts.map((prod: (typeof MOCK_SUPPLIER_PRODUCTS)[number]) => (
                  <div
                    key={prod.id}
                    className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/20"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg border border-slate-200/60 bg-slate-50">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={prod.images?.[0] || 'https://placehold.co/600x400?text=Produk'}
                          alt={prod.title}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                          {prod.title}
                        </h4>
                        <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
                          Kategori: {prod.category}
                        </p>
                      </div>
                    </div>

                    <div className="flex sm:text-right flex-row sm:flex-col justify-between items-center sm:items-end gap-1.5 text-xs font-semibold text-slate-500">
                      <div>
                        <span className="text-emerald-600 font-extrabold">
                          {formatCurrency(prod.price_per_unit)}
                        </span>{' '}
                        / {prod.unit}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[9.5px] text-slate-400">
                          Min. Order: {prod.min_order} {prod.unit}
                        </span>
                        <Link href={`/dashboard/distributor/catalog/${prod.id}`}>
                          <Button
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] h-7 px-3.5 rounded-lg cursor-pointer transition-colors shadow-xs"
                          >
                            Order
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Transaction Ledger list with this specific farmer */}
          <Card className="border-slate-200/60 shadow-xs bg-white overflow-hidden rounded-2xl">
            <CardHeader className="pb-3 border-b border-slate-100/50">
              <CardTitle className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Riwayat Transaksi Kemitraan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="border-b border-slate-100">
                      <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider py-2.5 pl-4">
                        Order ID
                      </TableHead>
                      <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">
                        Total Bayar
                      </TableHead>
                      <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                        Status
                      </TableHead>
                      <TableHead className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right pr-4">
                        Tanggal
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {MOCK_SUPPLIER_TRANSACTIONS.map((tx) => {
                      const isCompleted = tx.status === 'completed';

                      return (
                        <TableRow
                          key={tx.id}
                          className="border-b border-slate-100 hover:bg-slate-50/20"
                        >
                          <TableCell className="font-bold text-xs py-2.5 pl-4 text-slate-800">
                            {tx.id}
                          </TableCell>
                          <TableCell className="text-xs font-bold text-slate-800 text-right">
                            {formatCurrency(tx.total_amount)}
                          </TableCell>
                          <TableCell className="text-center">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-bold ${
                                isCompleted
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                                  : 'bg-indigo-50 text-indigo-700 border-indigo-200/50'
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  isCompleted ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'
                                }`}
                              />
                              {isCompleted ? 'Selesai' : 'Dikirim'}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs font-semibold text-slate-500 text-right pr-4">
                            {new Date(tx.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
