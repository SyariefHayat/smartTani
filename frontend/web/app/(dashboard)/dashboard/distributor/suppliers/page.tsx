'use client';

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { distributorService, Supplier } from '@/services/distributor';
import { formatCurrency } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
  AlertTriangle,
  ArrowUpDown,
  ArrowRight,
} from 'lucide-react';

const MOCK_SUPPLIERS = [
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
  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch suppliers
  const { data: suppliersResponse, isLoading } = useQuery({
    queryKey: ['distributor-suppliers'],
    queryFn: async () => {
      try {
        const res = await distributorService.getSuppliers();
        if (!res || !res.suppliers || res.suppliers.length === 0) throw new Error('Empty');
        return res;
      } catch {
        setIsOffline(true);
        return { suppliers: MOCK_SUPPLIERS };
      }
    },
  });

  const activeSuppliers = suppliersResponse?.suppliers || MOCK_SUPPLIERS;

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

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Daftar Mitra Petani / Supplier
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-1">
          Daftar petani produsen yang terhubung langsung dalam sistem pengadaan grosir B2B Anda.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] text-amber-600/90 font-medium mt-0.5 leading-relaxed">
              Arsip relasi data supplier tani disimulasikan menggunakan penyimpanan offline lokal.
            </p>
          </div>
        </div>
      )}

      {/* Control panel */}
      <div className="grid gap-4 sm:grid-cols-3 bg-white p-4 border border-slate-200 rounded-xl shadow-sm items-end">
        {/* Search */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Cari Nama Petani / Kota
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari Budi, Banyuwangi, Garut..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 text-xs font-semibold border-slate-200 focus:border-green-500 w-full"
            />
          </div>
        </div>

        {/* Sorting options */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
            Urutkan Berdasarkan
          </label>
          <Select value={sortOption} onValueChange={setSortOption}>
            <SelectTrigger className="h-10 border-slate-200 text-xs font-semibold focus:border-green-500 w-full cursor-pointer">
              <span className="flex items-center gap-1.5">
                <ArrowUpDown className="h-4 w-4 text-slate-400" />
                <SelectValue placeholder="Urutkan" />
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transactions" className="text-xs cursor-pointer">
                Transaksi Terbanyak
              </SelectItem>
              <SelectItem value="amount" className="text-xs cursor-pointer">
                Modal Belanja Terbesar
              </SelectItem>
              <SelectItem value="products" className="text-xs cursor-pointer">
                Jenis Komoditas Terbanyak
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid: Partners Stats Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Kemitraan Petani Aktif
            </span>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Handshake className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-xl font-bold text-slate-800">{totalPartners} Petani</div>
              <p className="text-[10.5px] font-semibold text-slate-500 mt-0.5">
                Petani yang mensuplai komoditas
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Akumulasi Belanja Kemitraan
            </span>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-xl font-bold text-slate-800">
                {formatCurrency(grandTransactionsSum)}
              </div>
              <p className="text-[10.5px] font-semibold text-slate-500 mt-0.5">
                Total transaksi beli selesai
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid: Supplier Cards */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-48" />
        </div>
      ) : filteredSuppliers.length === 0 ? (
        <div className="py-20 text-center bg-white border border-slate-200 rounded-xl shadow-sm">
          <User className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-xs font-bold text-slate-800">Petani tidak ditemukan</h3>
          <p className="mt-1 text-[11px] text-slate-500 font-semibold">
            Coba ubah nama pencarian petani.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSuppliers.map((sup: Supplier) => (
            <Card
              key={sup.farmer_id}
              className="border-slate-200 hover:border-green-300 hover:shadow-md transition-all duration-300 bg-white overflow-hidden flex flex-col justify-between group"
            >
              <CardContent className="pt-5 space-y-4">
                {/* Header Bio */}
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-50 text-sm font-bold text-green-600 border border-green-100">
                    {sup.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 group-hover:text-green-600 transition-colors">
                      {sup.name}
                    </h3>
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold mt-1">
                      <MapPin className="h-3.5 w-3.5" />
                      <span>{sup.location}</span>
                    </div>
                  </div>
                </div>

                {/* Substats */}
                <div className="grid grid-cols-2 gap-3 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 text-xs font-semibold text-slate-500">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Total Transaksi
                    </span>
                    <span className="text-xs font-bold text-slate-700">
                      {sup.total_transactions} Kali
                    </span>
                  </div>
                  <div className="border-l border-slate-200 pl-3">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                      Komoditas Suplai
                    </span>
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      <Sprout className="h-3.5 w-3.5 text-green-600 shrink-0" />{' '}
                      {sup.products_count} Jenis
                    </span>
                  </div>
                </div>

                {/* Amount details */}
                <div className="flex justify-between items-center text-[10.5px] font-bold text-slate-500">
                  <span>Akumulasi Modal Belanja</span>
                  <span className="text-slate-800 font-extrabold">
                    {formatCurrency(sup.total_amount)}
                  </span>
                </div>
              </CardContent>

              {/* Action */}
              <CardFooter className="pt-2 pb-4 border-t border-slate-50 bg-slate-50/10">
                <Link
                  href={`/dashboard/distributor/suppliers/${sup.farmer_id}`}
                  className="block w-full"
                >
                  <Button
                    variant="outline"
                    className="w-full border-slate-200 text-slate-700 hover:border-green-600 hover:text-green-600 font-bold text-xs h-8.5 cursor-pointer flex items-center justify-center gap-1"
                  >
                    Profil Petani <ArrowRight className="w-3.5 h-3.5" />
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
