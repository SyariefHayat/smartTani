'use client';

import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Eye,
  Layers,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
import { Category } from './types';

interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  return (
    <Card className="overflow-hidden rounded-xl shadow-sm">
      <div className="border-b bg-slate-50/40 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Daftar Kategori</h2>
        <p className="text-xs text-muted-foreground">
          Menampilkan {categories.length} kategori berdasarkan pencarian aktif.
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
            {categories.length > 0 ? (
              categories.map((cat, idx) => (
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
          <span className="font-medium text-slate-900">1 - {categories.length}</span>{' '}
          dari <span className="font-medium text-slate-900">{categories.length}</span>{' '}
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
            <Button
              size="sm"
              className="h-8 w-8 bg-green-700 p-0 text-white hover:bg-green-800"
            >
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
  );
}
