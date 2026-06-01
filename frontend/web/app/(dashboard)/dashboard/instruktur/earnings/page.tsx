'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { instructorService, InstructorEarningsResponse } from '@/services/instructor';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import {
  Wallet,
  Calendar,
  DollarSign,
  TrendingUp,
  Percent,
  AlertTriangle,
  BookOpen,
  ArrowRight,
  Users,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const MOCK_EARNINGS: InstructorEarningsResponse = {
  total_earnings: 2450000,
  monthly_earnings: 450000,
  paid_students: 22,
  courses: [
    {
      id: 'course-001',
      title: 'Budidaya Hidroponik Modern untuk Pemula',
      price: 0,
      students: 1450,
      revenue: 0,
      fee: 10,
      net: 0,
    },
    {
      id: 'course-003',
      title: 'Teknologi IoT & Sensor Tanah Pintar',
      price: 150000,
      students: 22,
      revenue: 3300000,
      fee: 10,
      net: 2970000,
    },
  ],
};

export default function InstructorEarningsPage() {
  const user = getStoredAuthUser();
  const [isOffline, setIsOffline] = React.useState(false);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  const { data: earnings, isLoading } = useQuery<InstructorEarningsResponse>({
    queryKey: ['instructor-earnings', user?.id],
    queryFn: async () => {
      try {
        return await instructorService.getEarnings();
      } catch {
        setIsOffline(true);
        toast.error('Koneksi ke server keuangan terputus. Gagal memuat data teraktual.');
        return MOCK_EARNINGS;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-[250px]" />
      </div>
    );
  }

  const activeEarnings = earnings || MOCK_EARNINGS;

  const totalRows = activeEarnings.courses.length;
  const totalPages = Math.ceil(totalRows / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = activeEarnings.courses.slice(startIndex, startIndex + itemsPerPage);
  const fromRow = totalRows === 0 ? 0 : startIndex + 1;
  const toRow = Math.min(startIndex + itemsPerPage, totalRows);

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Penghasilan & Pendapatan 💰
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Pantau arus bagi hasil, penjualan materi kelas premium, and laporan dana terbayar di
          SiTani Academy.
        </p>
      </div>

      {/* Stats row */}
      {isOffline ? (
        <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-xs px-4 text-center">
          Gagal memuat data statistik pendapatan / Koneksi ke server keuangan terputus
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {/* Metric 1 */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs">Total Pendapatan</CardDescription>
              <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
                {formatCurrency(activeEarnings.total_earnings)}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <Wallet className="size-4 shrink-0 text-slate-400" />
                <span className="truncate text-muted-foreground">Akumulasi pendapatan bersih</span>
              </div>
            </CardFooter>
          </Card>

          {/* Metric 2 */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs">Penghasilan Bulan Ini</CardDescription>
              <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
                {formatCurrency(activeEarnings.monthly_earnings)}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <Calendar className="size-4 shrink-0 text-slate-400" />
                <span className="truncate text-muted-foreground">Periode berjalan Juni 2026</span>
              </div>
            </CardFooter>
          </Card>

          {/* Metric 3 */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs">Siswa Berbayar</CardDescription>
              <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
                {activeEarnings.paid_students} Murid
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <Users className="size-4 shrink-0 text-slate-400" />
                <span className="truncate text-muted-foreground">Materi kelas premium</span>
              </div>
            </CardFooter>
          </Card>

          {/* Metric 4 */}
          <Card className="min-w-0">
            <CardHeader className="gap-1">
              <CardDescription className="truncate text-xs">Biaya Layanan Platform</CardDescription>
              <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
                10%
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                <Percent className="size-4 shrink-0 text-slate-400" />
                <span className="truncate text-muted-foreground">Tarif platform tetap</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Earning Table Ledger */}
      <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/20">
          <CardTitle className="text-xs font-black text-slate-850 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="h-4.5 w-4.5 text-slate-400 shrink-0" />
            Buku Besar Payout Penjualan
          </CardTitle>
          <CardDescription className="text-[10px] font-semibold mt-0.5 uppercase tracking-wide">
            Daftar komisi bersih bagi hasil yang berhak Anda cairkan.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          {isOffline ? (
            <div className="flex h-[250px] items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-xs px-4 text-center">
              Gagal memuat data buku besar payout / Koneksi ke server keuangan terputus
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-slate-50/55 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <TableHead className="py-3 px-4 h-10 font-bold text-slate-500">
                      Nama Kelas Ajar
                    </TableHead>
                    <TableHead className="py-3 px-4 h-10 text-center font-bold text-slate-500">
                      Harga Jual
                    </TableHead>
                    <TableHead className="py-3 px-4 h-10 text-center font-bold text-slate-500">
                      Siswa Premium
                    </TableHead>
                    <TableHead className="py-3 px-4 h-10 text-center font-bold text-slate-500">
                      Pendapatan Kotor
                    </TableHead>
                    <TableHead className="py-3 px-4 h-10 text-right font-bold text-slate-500">
                      Penghasilan Bersih
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs font-semibold text-slate-700">
                  {paginatedCourses.map((course, idx) => (
                    <TableRow
                      key={idx}
                      className="hover:bg-slate-50/40 transition-colors border-b border-slate-100"
                    >
                      <TableCell className="py-4 px-4 font-bold text-slate-800 text-xs">
                        {course.title}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center font-bold">
                        {course.price > 0 ? (
                          <span className="font-mono text-[11px]">
                            {formatCurrency(course.price)}
                          </span>
                        ) : (
                          <Badge className="bg-slate-100 hover:bg-slate-200 border-none text-slate-700 font-bold text-[9px] rounded-lg uppercase">
                            Gratis
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center font-bold text-slate-600">
                        {course.students} Siswa
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center font-bold font-mono text-slate-500">
                        {formatCurrency(course.revenue)}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-right font-bold font-mono text-emerald-600 text-[13px]">
                        {course.price > 0 ? formatCurrency(course.net) : <span>Rp 0</span>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-100 mt-4 bg-slate-50/10">
                <div className="text-xs font-semibold text-slate-500">
                  Menampilkan{' '}
                  <span className="font-bold text-slate-800">
                    {fromRow}–{toRow}
                  </span>{' '}
                  dari <span className="font-bold text-slate-800">{totalRows}</span> kelas
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || totalRows === 0}
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || totalRows === 0}
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
