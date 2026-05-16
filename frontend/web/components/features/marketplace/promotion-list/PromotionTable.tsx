'use client';

import {
  Calendar,
  Edit,
  Eye,
  MoreVertical,
  Percent,
  Power,
  Tag,
  Ticket,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
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
import { Promotion } from './types';

interface PromotionTableProps {
  promos: Promotion[];
  onReset: () => void;
}

export function PromotionTable({ promos, onReset }: PromotionTableProps) {
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
    <Card className="overflow-hidden rounded-xl shadow-sm">
      <div className="border-b bg-slate-50/40 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Daftar Promo</h2>
        <p className="text-xs text-muted-foreground">
          Menampilkan {promos.length} promo berdasarkan filter aktif.
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
            {promos.length > 0 ? (
              promos.map((promo) => (
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
    </Card>
  );
}
