'use client';

import { useState } from 'react';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  Layers,
  Tag,
} from 'lucide-react';

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

// Mock data for Category implementation
const MOCK_CATEGORIES = [
  {
    id: '1',
    name: 'Pupuk',
    slug: 'pupuk',
    productCount: 154,
    status: 'active',
    description: 'Segala jenis pupuk organik dan anorganik untuk tanaman.',
    icon: '🌱'
  },
  {
    id: '2',
    name: 'Benih',
    slug: 'benih',
    productCount: 89,
    status: 'active',
    description: 'Bibit dan benih tanaman pangan, hortikultura, dan perkebunan.',
    icon: '🌾'
  },
  {
    id: '3',
    name: 'Pestisida',
    slug: 'pestisida',
    productCount: 42,
    status: 'active',
    description: 'Obat-obatan pembasmi hama dan penyakit tanaman.',
    icon: '🧪'
  },
  {
    id: '4',
    name: 'Alat Pertanian',
    slug: 'alat-pertanian',
    productCount: 67,
    status: 'active',
    description: 'Peralatan modern dan tradisional untuk membantu tani.',
    icon: '🚜'
  },
  {
    id: '5',
    name: 'Hortikultura',
    slug: 'hortikultura',
    productCount: 12,
    status: 'inactive',
    description: 'Tanaman sayur, buah, dan tanaman hias.',
    icon: '🍎'
  }
];

export function FarmerCategoryList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = MOCK_CATEGORIES.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <BreadcrumbPage>Kategori Produk</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Kategori Produk</h1>
            <p className="text-sm text-muted-foreground">
              Kelola kategori produk untuk mempermudah pencarian bagi pembeli.
            </p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto">
            <Button variant="outline" className="bg-background">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button className="bg-green-700 text-white hover:bg-green-800">
              <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
            </Button>
          </div>
        </div>

        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Cari nama kategori atau deskripsi..."
                className="h-10 border-slate-200 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 xl:grid-cols-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                  Total Kategori
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {MOCK_CATEGORIES.length}
                </p>
              </div>
              <div className="rounded-lg border border-green-100 bg-green-50 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-green-700">
                  Kategori Aktif
                </p>
                <p className="mt-1 text-xl font-semibold text-green-800">
                  {MOCK_CATEGORIES.filter((cat) => cat.status === 'active').length}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-slate-600">
                  Total Produk
                </p>
                <p className="mt-1 text-xl font-semibold text-slate-900">
                  {MOCK_CATEGORIES.reduce((total, cat) => total + cat.productCount, 0)}
                </p>
              </div>
              <div className="rounded-lg border border-amber-100 bg-amber-50 p-3">
                <p className="text-[11px] font-medium uppercase tracking-wide text-amber-700">
                  Perlu Review
                </p>
                <p className="mt-1 text-xl font-semibold text-amber-800">
                  {MOCK_CATEGORIES.filter((cat) => cat.status !== 'active').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-xl shadow-sm">
          <div className="border-b bg-slate-50/40 px-4 py-3">
            <h2 className="text-sm font-semibold text-slate-900">Daftar Kategori</h2>
            <p className="text-xs text-muted-foreground">
              Menampilkan {filteredCategories.length} kategori berdasarkan pencarian aktif.
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow className="border-slate-100 hover:bg-transparent">
                  <TableHead className="w-[60px] text-center font-semibold text-slate-600">
                    No
                  </TableHead>
                  <TableHead className="font-semibold text-slate-600">Kategori</TableHead>
                  <TableHead className="font-semibold text-slate-600">Deskripsi</TableHead>
                  <TableHead className="font-semibold text-slate-600">Jumlah Produk</TableHead>
                  <TableHead className="font-semibold text-slate-600">Status</TableHead>
                  <TableHead className="w-[80px] text-right font-semibold text-slate-600">
                    Aksi
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.length > 0 ? (
                  filteredCategories.map((cat, idx) => (
                    <TableRow
                      key={cat.id}
                      className="border-slate-50 transition-colors hover:bg-slate-50/30"
                    >
                      <TableCell className="text-center font-medium text-slate-500">
                        {idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-100 text-xl shadow-sm">
                            {cat.icon}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900">{cat.name}</span>
                            <span className="mt-0.5 block text-[10px] font-mono text-slate-400">
                              slug: {cat.slug}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[300px]">
                        <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                          {cat.description}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">
                            {cat.productCount}
                          </div>
                          <span className="text-xs text-slate-400">Produk</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {cat.status === 'active' ? (
                          <Badge className="border-none bg-green-100 font-normal text-green-700 hover:bg-green-100">
                            Aktif
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="border-none bg-slate-100 font-normal text-slate-400"
                          >
                            Nonaktif
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-slate-400 hover:text-slate-600"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem className="cursor-pointer">
                              <Eye className="mr-2 h-4 w-4" /> Lihat Produk
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" /> Hapus
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
                        <Layers className="mb-2 h-12 w-12 opacity-20" />
                        <p className="font-medium text-slate-500">Kategori tidak ditemukan</p>
                        <p className="text-xs">Coba kata kunci lain atau reset pencarian</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-4 border-t bg-slate-50/30 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-slate-500">
              Menampilkan{' '}
              <span className="font-medium text-slate-900">1 - {filteredCategories.length}</span>{' '}
              dari <span className="font-medium text-slate-900">{filteredCategories.length}</span>{' '}
              kategori
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-slate-200 bg-background"
                disabled
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1">
                <Button size="sm" className="h-8 w-8 bg-green-700 p-0 text-white hover:bg-green-800">
                  1
                </Button>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 border-slate-200 bg-background"
                disabled
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="rounded-xl bg-indigo-50 shadow-sm ring-1 ring-indigo-100">
            <CardContent className="flex gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                <Tag className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-indigo-900">Optimalisasi Kategori</h4>
                <p className="mt-1 text-xs leading-relaxed text-indigo-700">
                  Gunakan nama kategori yang umum agar pembeli lebih mudah menemukan produk Anda
                  melalui fitur filter.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl bg-green-50 shadow-sm ring-1 ring-green-100">
            <CardContent className="flex gap-4 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-green-900">Sub-Kategori</h4>
                <p className="mt-1 text-xs leading-relaxed text-green-700">
                  Anda dapat menambahkan sub-kategori untuk klasifikasi produk yang lebih mendalam
                  dan terorganisir.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
