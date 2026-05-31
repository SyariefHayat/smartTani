'use client';

import { useState, useEffect } from 'react';
import { Eye, Layers, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';
import { Category } from './types';

interface CategoryTableProps {
  categories: Category[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isLoading?: boolean;
}

export function CategoryTable({
  categories,
  searchTerm,
  setSearchTerm,
  isLoading,
}: CategoryTableProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);

  if (searchTerm !== prevSearchTerm) {
    setPrevSearchTerm(searchTerm);
    setCurrentPage(1);
  }

  const pageSize = 10;

  const totalRows = categories.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const fromRow = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toRow = Math.min(currentPage * pageSize, totalRows);

  const paginatedCategories = categories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card className="w-full bg-white">
      <CardContent className="space-y-3">
        {/* Filters integrated inside the container card */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center justify-between w-full pb-1 pt-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="Cari nama kategori atau deskripsi..."
              className="h-9 rounded-md border-slate-200 bg-white pl-9 pr-4 text-sm text-slate-900"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-md border border-slate-100">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] text-center font-semibold">No</TableHead>
                <TableHead className="font-semibold">Kategori</TableHead>
                <TableHead className="font-semibold">Deskripsi</TableHead>
                <TableHead className="font-semibold">Jumlah Produk</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="w-[80px] text-right font-semibold">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                // Beautiful in-table skeletons matching TrackOrderStatus and ProductTable
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-5 w-full animate-pulse bg-slate-100 rounded" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : paginatedCategories.length > 0 ? (
                paginatedCategories.map((cat, idx) => (
                  <TableRow key={cat.id}>
                    <TableCell className="text-center font-medium text-slate-500 text-sm">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-slate-105 text-xl shadow-sm bg-slate-50">
                          {cat.icon}
                        </div>
                        <div className="min-w-0">
                          <span className="truncate font-semibold text-slate-900 text-sm leading-snug">
                            {cat.name}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 tracking-wider uppercase mt-0.5 block">
                            slug: {cat.slug}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[300px]">
                      <p className="text-slate-600 text-sm font-medium line-clamp-2 leading-relaxed">
                        {cat.description}
                      </p>
                    </TableCell>
                    <TableCell>
                      <div className="text-slate-700 text-sm font-semibold">
                        {cat.productCount}{' '}
                        <span className="text-slate-400 font-normal text-xs ml-0.5">Produk</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {cat.status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Aktif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                          Nonaktif
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer text-slate-500 hover:text-slate-900"
                        onClick={() =>
                          router.push(
                            `/dashboard/farmer/products?category=${encodeURIComponent(cat.name)}`
                          )
                        }
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" /> Lihat
                      </Button>
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

        {/* Pagination matching ProductTable style */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              <div className="h-4 w-48 animate-pulse bg-slate-100 rounded inline-block" />
            ) : totalRows === 0 ? (
              '0 kategori ditemukan'
            ) : (
              <>
                Menampilkan{' '}
                <span className="font-semibold text-slate-900">
                  {fromRow}–{toRow}
                </span>{' '}
                dari <span className="font-semibold text-slate-900">{totalRows}</span> kategori
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-slate-700 bg-white"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={isLoading || currentPage === 1}
            >
              Sebelumnya
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer text-slate-700 bg-white"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={isLoading || currentPage === totalPages || totalPages === 0}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
