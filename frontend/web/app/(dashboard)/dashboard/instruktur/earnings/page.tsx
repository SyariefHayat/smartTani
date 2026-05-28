'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { instructorService, InstructorEarningsResponse } from '@/services/instructor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import {
  Wallet,
  Calendar,
  DollarSign,
  TrendingUp,
  Percent,
  AlertTriangle,
  BookOpen,
  ArrowRight,
} from 'lucide-react';

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

  const { data: earnings, isLoading } = useQuery<InstructorEarningsResponse>({
    queryKey: ['instructor-earnings', user?.id],
    queryFn: async () => {
      try {
        return await instructorService.getEarnings();
      } catch {
        setIsOffline(true);
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

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Academy Service sedang tidak terhubung. Menampilkan data buku besar pendapatan luring.
            </p>
          </div>
        </div>
      )}

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1 */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800">
                {formatCurrency(activeEarnings.total_earnings)}
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Total Pendapatan
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2 */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800">
                {formatCurrency(activeEarnings.monthly_earnings)}
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Penghasilan Bulan Ini
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3 */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800">
                {activeEarnings.paid_students} Murid
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Siswa Berbayar
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4 */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <Percent className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xl font-bold text-slate-800">10%</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Biaya Layanan Platform
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Earning Table Ledger */}
      <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/20">
          <CardTitle className="text-sm font-bold text-slate-800">
            Buku Besar Payout Penjualan
          </CardTitle>
          <CardDescription className="text-[10px] font-semibold mt-0.5 uppercase tracking-wide">
            Daftar komisi bersih bagi hasil yang berhak Anda cairkan.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/30 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Nama Kelas Ajar</th>
                  <th className="py-3 px-4 text-center">Harga Jual</th>
                  <th className="py-3 px-4 text-center">Siswa Premium</th>
                  <th className="py-3 px-4 text-center">Pendapatan Kotor</th>
                  <th className="py-3 px-4 text-right">Penghasilan Bersih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {activeEarnings.courses.map((course, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-4 px-4 text-slate-800 font-bold">{course.title}</td>
                    <td className="py-4 px-4 text-center font-mono text-[11px] font-bold">
                      {course.price > 0 ? (
                        formatCurrency(course.price)
                      ) : (
                        <Badge className="bg-green-50 border border-green-150 text-green-700 text-[9px] font-bold rounded-lg uppercase">
                          Gratis
                        </Badge>
                      )}
                    </td>
                    <td className="py-4 px-4 text-center">{course.students} Siswa</td>
                    <td className="py-4 px-4 text-center font-mono text-slate-500 font-bold">
                      {formatCurrency(course.revenue)}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-emerald-600 text-[13px]">
                      {course.price > 0 ? formatCurrency(course.net) : <span>Rp 0</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Info Monetize call-to-action */}
      <Card className="border-emerald-100 bg-emerald-50/20 rounded-2xl p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
            <BookOpen className="h-4.5 w-4.5 text-emerald-700" />
            Ingin Memonetisasi Keahlian Anda Lebih Lanjut?
          </h4>
          <p className="text-[11px] font-semibold text-emerald-600 leading-relaxed max-w-2xl">
            Buat kursus premium berbayar dengan mengubah spec harga di halaman Edit Kursus. Murid
            akan melunasi biaya registrasi di checkout gateway SmartTani, and dana bagi hasil bersih
            akan otomatis tercatat di payout ledger ini.
          </p>
        </div>
        <Link href="/dashboard/instruktur/courses" passHref legacyBehavior>
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm shrink-0 gap-1 mt-2 md:mt-0"
          >
            Mulai Monetisasi
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </Card>
    </div>
  );
}
