'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { distributorService, Supplier } from '@/services/distributor';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  User,
  MapPin,
  Handshake,
  Sprout,
  TrendingUp,
  ArrowUpDown,
  ArrowRight,
} from 'lucide-react';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _MOCK_SUPPLIERS = [
  {
    farmer_id: 'farmer-1',
    name: 'Budi Santoso',
    location: 'Banyuwangi, Jawa Timur',
    total_transactions: 12,
    total_amount: 45000000,
    products_count: 8,
    last_order_date: '2026-05-27T08:00:00Z',
    joined_at: '2025-01-10',
  },
  {
    farmer_id: 'farmer-2',
    name: 'Siti Aminah',
    location: 'Garut, Jawa Barat',
    total_transactions: 8,
    total_amount: 32000000,
    products_count: 5,
    last_order_date: '2026-05-25T14:30:00Z',
    joined_at: '2025-02-15',
  },
  {
    farmer_id: 'farmer-3',
    name: 'Agus Salim',
    location: 'Boyolali, Jawa Tengah',
    total_transactions: 5,
    total_amount: 20500000,
    products_count: 6,
    last_order_date: '2026-05-20T10:00:00Z',
    joined_at: '2025-03-01',
  },
  {
    farmer_id: 'farmer-4',
    name: 'Suryo Putro',
    location: 'Sleman, D.I. Yogyakarta',
    total_transactions: 3,
    total_amount: 12000000,
    products_count: 4,
    last_order_date: '2026-05-10T11:00:00Z',
    joined_at: '2025-04-12',
  },
];

export default function DistributorSuppliersPage() {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortOption, setSortOption] = React.useState('transactions');

  // Fetch suppliers
  const {
    data: suppliersResponse,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['distributor-suppliers'],
    queryFn: async () => {
      const res = await distributorService.getSuppliers();
      if (!res || !res.suppliers || res.suppliers.length === 0) throw new Error('Empty');
      return res;
    },
  });

  React.useEffect(() => {
    if (isError) {
      toast.error('Koneksi ke server terputus. Gagal memuat data teraktual.');
    }
  }, [isError]);

  const activeSuppliers = suppliersResponse?.suppliers || [];

  // Filter and Sort suppliers list
  const filteredSuppliers = activeSuppliers
    .filter((sup) => {
      return (
        sup.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sup.location.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      if (sortOption === 'amount') return b.total_amount - a.total_amount;
      if (sortOption === 'products') return b.products_count - a.products_count;
      return b.total_transactions - a.total_transactions; // default transactions desc
    });

  const totalPartners = activeSuppliers.length;
  const grandTransactionsSum = activeSuppliers.reduce((sum, s) => sum + s.total_amount, 0);

  const kpis = [
    {
      title: 'Kemitraan Petani Aktif',
      value: `${totalPartners} Petani`,
      footer: 'Petani aktif mensuplai komoditas grosir B2B',
      icon: Handshake,
      iconColorClass: 'text-emerald-500',
    },
    {
      title: 'Akumulasi Belanja Kemitraan',
      value: formatCurrency(grandTransactionsSum),
      footer: 'Total transaksi pembelian grosir selesai',
      icon: TrendingUp,
      iconColorClass: 'text-emerald-500',
    },
  ] as const;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl text-slate-900">
            Daftar Mitra Petani / Supplier
          </h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Daftar petani produsen yang terhubung langsung dalam sistem pengadaan grosir B2B Anda.
          </p>
        </div>
      </div>

      {/* Offline banner removed to use per-section red dashed error blocks */}

      {/* Control panel */}
      <div className="grid gap-4 sm:grid-cols-3 bg-white p-4 border border-slate-200/60 rounded-2xl shadow-xs items-end">
        {/* Search */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Cari Nama Petani / Kota
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari Budi, Banyuwangi, Garut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-xs font-semibold border-slate-200 focus-visible:ring-emerald-500/30 focus-visible:border-emerald-500 w-full rounded-xl"
            />
          </div>
        </div>

        {/* Sorting options */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
            Urutkan Berdasarkan
          </label>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="h-10 border-slate-200 text-xs font-semibold focus:border-emerald-500 w-full cursor-pointer rounded-xl">
              <span className="flex items-center gap-1.5">
                <ArrowUpDown className="h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Urutkan" />
              </span>
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="transactions" className="text-xs cursor-pointer rounded-lg">
                Transaksi Terbanyak
              </SelectItem>
              <SelectItem value="amount" className="text-xs cursor-pointer rounded-lg">
                Modal Belanja Terbesar
              </SelectItem>
              <SelectItem value="products" className="text-xs cursor-pointer rounded-lg">
                Jenis Komoditas Terbanyak
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid: Partners Stats Summary */}
      {isError ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat data statistik B2B / Koneksi ke server terputus
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {kpis.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="min-w-0">
                <CardHeader className="gap-1">
                  <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    {card.title}
                  </CardDescription>
                  <CardTitle
                    className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800"
                    title={card.value}
                  >
                    {card.value}
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                    <Icon className={`size-4 shrink-0 ${card.iconColorClass}`} />
                    <span className="truncate text-muted-foreground">{card.footer}</span>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Grid: Supplier Cards */}
      {isError ? (
        <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
          Gagal memuat daftar mitra petani B2B / Koneksi ke server terputus
        </div>
      ) : isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <Card
              key={n}
              className="border-slate-100 shadow-xs bg-white overflow-hidden rounded-2xl p-5 space-y-4"
            >
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3.5 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-12 w-full rounded-xl" />
              <div className="flex justify-between items-center">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
              </div>
              <Skeleton className="h-8 w-full rounded-xl" />
            </Card>
          ))}
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="py-16 text-center bg-white border border-slate-200/60 rounded-2xl shadow-xs">
          <div className="mx-auto h-14 w-14 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100">
            <User className="h-6 w-6 text-slate-400" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-800">Petani tidak ditemukan</h3>
          <p className="mt-1 text-xs text-slate-500 font-medium max-w-xs mx-auto">
            Coba ubah kata kunci pencarian nama atau kota petani untuk menemukan mitra penyuplai.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSuppliers.map((sup: Supplier) => (
            <Card
              key={sup.farmer_id}
              className="border-slate-100 hover:border-emerald-500/30 shadow-xs hover:shadow-lg hover:shadow-emerald-500/5 bg-white overflow-hidden flex flex-col justify-between group rounded-2xl transition-all duration-300 relative"
            >
              <CardContent className="pt-5 px-5 pb-0 space-y-4">
                {/* Header Bio */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-sm font-bold text-emerald-700 border border-emerald-100/60">
                    {sup.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-850 group-hover:text-emerald-600 transition-colors leading-snug">
                      {sup.name}
                    </h3>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border border-slate-100 bg-slate-50/50 text-[9.5px] font-semibold text-slate-500 mt-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{sup.location}</span>
                    </div>
                  </div>
                </div>

                {/* Substats (Ticket Stub Design) */}
                <div className="grid grid-cols-2 gap-2 bg-slate-50/80 p-3 rounded-xl border border-slate-100/80 divide-x divide-slate-200/80 text-xs font-semibold text-slate-500">
                  <div className="pr-1">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Transaksi
                    </span>
                    <span className="text-xs font-bold text-slate-750 block mt-0.5">
                      {sup.total_transactions} Transaksi
                    </span>
                  </div>
                  <div className="pl-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Komoditas Suplai
                    </span>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Sprout className="h-3 w-3 text-emerald-600 shrink-0" />
                      <span className="text-xs font-bold text-slate-750">
                        {sup.products_count} Produk
                      </span>
                    </div>
                  </div>
                </div>

                {/* Amount details */}
                <div className="flex justify-between items-center text-xs font-bold text-slate-500 border-t border-slate-100 pt-3">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Belanja Kemitraan
                  </span>
                  <span className="text-sm font-extrabold text-emerald-600">
                    {formatCurrency(sup.total_amount)}
                  </span>
                </div>
              </CardContent>

              {/* Action */}
              <CardFooter className="pt-4 pb-4 px-5 border-t border-slate-50 bg-slate-50/10">
                <Link
                  href={`/dashboard/distributor/suppliers/${sup.farmer_id}`}
                  className="block w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full border-slate-200 hover:border-emerald-600 hover:bg-emerald-50/30 text-slate-750 hover:text-emerald-700 font-bold text-xs h-9 rounded-xl cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-300"
                  >
                    Profil Petani{' '}
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
