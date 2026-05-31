'use client';

import { useState, useEffect } from 'react';
import {
  Calendar,
  Edit,
  Eye,
  MoreVertical,
  Percent,
  Power,
  Search,
  Tag,
  Ticket,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
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
import { Promotion, PromotionTableActions } from './types';

interface PromotionTableProps {
  promos: Promotion[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  onReset: () => void;
  actions?: PromotionTableActions;
  isLoading?: boolean;
}

export function PromotionTable({
  promos,
  searchTerm,
  setSearchTerm,
  activeTab,
  setActiveTab,
  onReset,
  actions,
  isLoading,
}: PromotionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevSearchTerm, setPrevSearchTerm] = useState(searchTerm);
  const [prevActiveTab, setPrevActiveTab] = useState(activeTab);

  if (searchTerm !== prevSearchTerm || activeTab !== prevActiveTab) {
    setPrevSearchTerm(searchTerm);
    setPrevActiveTab(activeTab);
    setCurrentPage(1);
  }

  const pageSize = 10;

  const totalRows = promos.length;
  const totalPages = Math.ceil(totalRows / pageSize);
  const fromRow = totalRows === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const toRow = Math.min(currentPage * pageSize, totalRows);

  const paginatedPromos = promos.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Aktif
          </span>
        );
      case 'scheduled':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Terjadwal
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Berakhir
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            Nonaktif
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
            {status}
          </span>
        );
    }
  };

  const formatValue = (type: string, value: number) => {
    if (type === 'discount_percent') return `${value}%`;
    return `Rp ${value.toLocaleString('id-ID')}`;
  };

  return (
    <Card className="rounded-xl border border-slate-100 bg-white shadow-sm">
      <CardContent className="space-y-4 pt-4">
        {/* Integrated Filter and Search inside CardContent */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between pb-1">
          {/* Filter Tabs matching premium style */}
          <div className="flex flex-wrap items-center gap-1 rounded-xl border bg-slate-50/70 p-1">
            {[
              { id: 'all', label: 'Semua' },
              { id: 'active', label: 'Aktif' },
              { id: 'scheduled', label: 'Terjadwal' },
              { id: 'expired', label: 'Berakhir' },
              { id: 'inactive', label: 'Nonaktif' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer',
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Cari nama atau kode promo..."
              className="h-10 border-slate-200 bg-white pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table itself */}
        <div className="rounded-lg border border-slate-100 overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/40">
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
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1.5">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-1.5 w-32 rounded-full" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-5 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="ml-auto h-8 w-8 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : paginatedPromos.length > 0 ? (
                paginatedPromos.map((promo) => (
                  <TableRow
                    key={promo._id}
                    className="border-slate-50 transition-colors hover:bg-slate-50/30"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border shadow-sm',
                            promo.type === 'discount_percent'
                              ? 'border-pink-100 bg-pink-50 text-pink-600'
                              : 'border-indigo-100 bg-indigo-50 text-indigo-600'
                          )}
                        >
                          {promo.type === 'discount_percent' ? (
                            <Percent className="h-5 w-5" />
                          ) : (
                            <Tag className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="line-clamp-1 font-semibold text-slate-900">
                            {promo.title}
                          </span>
                          <span className="mt-1 inline-flex rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono tracking-wider uppercase text-slate-500">
                            {promo.code || 'PROMO'}
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900">
                          {formatValue(promo.type, promo.value)}
                        </span>
                        <span className="text-[10px] capitalize text-slate-400">
                          {promo.type === 'discount_percent'
                            ? 'Potongan Harga'
                            : 'Potongan Langsung'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 text-xs text-slate-600">
                        <Calendar className="h-3 w-3 text-slate-400" />
                        <span>
                          {new Date(promo.start_date).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                          })}{' '}
                          -{' '}
                          {new Date(promo.end_date).toLocaleDateString('id-ID', {
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
                            {promo.usageCount || 0} Terpakai
                          </span>
                          <span className="text-slate-400">
                            {Math.round(((promo.usageCount || 0) / (promo.limit || 100)) * 100)}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              (promo.usageCount || 0) / (promo.limit || 100) > 0.8
                                ? 'bg-amber-500'
                                : 'bg-green-500'
                            )}
                            style={{
                              width: `${((promo.usageCount || 0) / (promo.limit || 100)) * 100}%`,
                            }}
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
                            className="h-8 w-8 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 cursor-pointer"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44 text-slate-900 bg-white">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => actions?.onViewDetail(promo)}
                          >
                            <Eye className="mr-2 h-4 w-4" /> Detail Performa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => actions?.onEdit(promo)}
                          >
                            <Edit className="mr-2 h-4 w-4" /> Ubah Promo
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => actions?.onToggleStatus(promo)}
                          >
                            <Power className="mr-2 h-4 w-4" />{' '}
                            {promo.status === 'active' ? 'Nonaktifkan' : 'Aktifkan'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer text-destructive focus:text-destructive animate-fade-in"
                            onClick={() => actions?.onDelete(promo)}
                          >
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
                        className="mt-2 h-auto p-0 text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-semibold"
                        onClick={onReset}
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

        {/* Pagination matching ProductTable style */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="text-sm text-muted-foreground">
            {isLoading ? (
              <div className="h-4 w-48 animate-pulse bg-slate-100 rounded inline-block" />
            ) : totalRows === 0 ? (
              '0 promo ditemukan'
            ) : (
              <>
                Menampilkan{' '}
                <span className="font-semibold text-slate-900">
                  {fromRow}–{toRow}
                </span>{' '}
                dari <span className="font-semibold text-slate-900">{totalRows}</span> promo
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
