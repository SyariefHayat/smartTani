'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Power,
  Calendar,
  Tag,
  Ticket,
  Percent,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

// Mock data for initial implementation
const MOCK_PROMOS = [
  {
    id: '1',
    name: 'Diskon Akhir Tahun Hayati',
    code: 'HAYATI2024',
    type: 'percentage',
    value: 15,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    status: 'active',
    usageCount: 142,
    limit: 500,
  },
  {
    id: '2',
    name: 'Flash Sale Benih Unggul',
    code: 'BENIHFAST',
    type: 'fixed',
    value: 10000,
    startDate: '2024-05-15',
    endDate: '2024-05-16',
    status: 'scheduled',
    usageCount: 0,
    limit: 50,
  },
  {
    id: '3',
    name: 'Promo Ramadhan Berkah',
    code: 'BERKAHRAMADHAN',
    type: 'percentage',
    value: 20,
    startDate: '2024-03-10',
    endDate: '2024-04-10',
    status: 'expired',
    usageCount: 450,
    limit: 450,
  },
  {
    id: '4',
    name: 'Subsidi Ongkir Petani',
    code: 'ONGKIRFREE',
    type: 'fixed',
    value: 20000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    usageCount: 890,
    limit: 1000,
  }
];

export function FarmerPromotionList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredPromos = MOCK_PROMOS.filter((promo) => {
    const matchesSearch =
      promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || promo.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <Badge className="border-none bg-green-100 font-normal text-green-700 hover:bg-green-100">
            Aktif
          </Badge>
        );
      case 'scheduled':
        return (
          <Badge
            variant="outline"
            className="border-blue-200 bg-blue-50 font-normal text-blue-600"
          >
            Terjadwal
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="secondary" className="border-none bg-slate-100 font-normal text-slate-500">
            Berakhir
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatValue = (type: string, value: number) => {
    if (type === 'percentage') return `${value}%`;
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/farmer">Marketplace</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Promo & Diskon</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Promo & Diskon</h1>
            <p className="text-sm text-muted-foreground">
              Kelola kampanye pemasaran dan kupon diskon Anda.
            </p>
          </div>
          <Button className="w-full bg-green-700 text-white hover:bg-green-800 sm:w-auto">
            <Plus className="mr-2 h-4 w-4" /> Buat Promo Baru
          </Button>
        </div>

        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                <div className="rounded-lg border border-green-100 bg-green-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-green-600">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-green-700">
                        Promo Aktif
                      </p>
                      <p className="mt-1 text-xl font-semibold text-green-800">12</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600">
                      <Ticket className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-blue-700">
                        Voucher Digunakan
                      </p>
                      <p className="mt-1 text-xl font-semibold text-blue-800">1,482</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-amber-600">
                      <TrendingDown className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-amber-700">
                        Total Diskon
                      </p>
                      <p className="mt-1 text-xl font-semibold text-amber-800">Rp 4.2M</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border border-violet-100 bg-violet-50 p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-violet-600">
                      <Clock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-violet-700">
                        Segera Berakhir
                      </p>
                      <p className="mt-1 text-xl font-semibold text-violet-800">3</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full flex-col gap-3 lg:w-auto">
                <div className="flex flex-wrap items-center gap-1 rounded-xl border bg-slate-50/70 p-1">
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: 'active', label: 'Aktif' },
                    { id: 'scheduled', label: 'Terjadwal' },
                    { id: 'expired', label: 'Berakhir' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={cn(
                        'rounded-lg px-4 py-2 text-sm font-medium transition-colors',
                        activeTab === tab.id
                          ? 'bg-green-600 text-white'
                          : 'text-slate-500 hover:bg-white hover:text-slate-700'
                      )}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                <div className="relative w-full lg:w-80">
                  <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    placeholder="Cari nama atau kode promo..."
                    className="h-10 border-slate-200 pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-xl shadow-sm">
          <div className="border-b bg-slate-50/40 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">Daftar Promo</h2>
            <p className="text-xs text-muted-foreground">
              Menampilkan {filteredPromos.length} promo berdasarkan filter aktif.
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="font-semibold text-slate-600">Promo</TableHead>
                  <TableHead className="font-semibold text-slate-600">Nilai Promo</TableHead>
                  <TableHead className="font-semibold text-slate-600">Periode</TableHead>
                  <TableHead className="font-semibold text-slate-600">Penggunaan</TableHead>
                  <TableHead className="font-semibold text-slate-600">Status</TableHead>
                  <TableHead className="w-[80px] text-right font-semibold text-slate-600">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPromos.length > 0 ? (
                  filteredPromos.map((promo) => (
                    <TableRow
                      key={promo.id}
                      className="border-slate-50 transition-colors hover:bg-slate-50/30"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border shadow-sm',
                              promo.type === 'percentage'
                                ? 'border-pink-100 bg-pink-50 text-pink-600'
                                : 'border-indigo-100 bg-indigo-50 text-indigo-600'
                            )}
                          >
                            {promo.type === 'percentage' ? (
                              <Percent className="h-5 w-5" />
                            ) : (
                              <Tag className="h-5 w-5" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <span className="line-clamp-1 font-bold text-slate-900">
                              {promo.name}
                            </span>
                            <span className="mt-1 inline-flex rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                              {promo.code}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900">
                            {formatValue(promo.type, promo.value)}
                          </span>
                          <span className="text-[10px] capitalize text-slate-400">
                            {promo.type === 'percentage'
                              ? 'Potongan Harga'
                              : 'Potongan Langsung'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <Calendar className="h-3 w-3 text-slate-400" />
                          <span>
                            {new Date(promo.startDate).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}{' '}
                            -{' '}
                            {new Date(promo.endDate).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex w-32 flex-col gap-1.5">
                          <div className="flex justify-between text-[10px]">
                            <span className="font-medium text-slate-500">
                              {promo.usageCount} Terpakai
                            </span>
                            <span className="text-slate-400">
                              {Math.round((promo.usageCount / promo.limit) * 100)}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={cn(
                                'h-full rounded-full transition-all duration-500',
                                promo.usageCount / promo.limit > 0.8
                                  ? 'bg-amber-500'
                                  : 'bg-green-500'
                              )}
                              style={{ width: `${(promo.usageCount / promo.limit) * 100}%` }}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(promo.status)}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-44">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" /> Detail Performa
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" /> Ubah Promo
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Power className="mr-2 h-4 w-4" />{' '}
                              {promo.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus Promo
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                        <Ticket className="mb-2 h-12 w-12 opacity-20" />
                        <p className="font-medium text-slate-500">Promo tidak ditemukan</p>
                        <p className="text-xs">Coba kata kunci lain atau reset filter</p>
                        <Button
                          variant="link"
                          className="mt-2 h-auto p-0 text-xs text-green-600"
                          onClick={() => {
                            setSearchTerm('');
                            setActiveTab('all');
                          }}
                        >
                          Reset Pencarian
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="flex gap-4 rounded-xl border border-amber-100 bg-amber-50 p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-600 shadow-sm">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-amber-900">Tips Promo Berhasil</h4>
              <p className="text-xs leading-relaxed text-amber-700">
                Promo dengan kode yang mudah diingat dan nilai diskon minimal 10% terbukti
                meningkatkan konversi penjualan hingga 2.5 kali lipat.
              </p>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-green-800 p-6 text-white shadow-lg">
            <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <h4 className="text-lg font-bold">Butuh Bantuan?</h4>
                <p className="max-w-[240px] text-xs leading-relaxed text-green-100">
                  Konsultasikan strategi promosi toko Anda dengan tim ahli marketplace SmartTani.
                </p>
              </div>
              <Button
                size="sm"
                className="h-8 bg-white px-4 text-[10px] font-bold text-green-800 hover:bg-green-50"
              >
                Hubungi Ahli
              </Button>
            </div>
            <div className="absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}
