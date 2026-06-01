'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { instructorService, InstructorPerformanceResponse } from '@/services/instructor';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import {
  TrendingUp,
  Award,
  Star,
  Clock,
  BookOpen,
  Users,
  AlertTriangle,
  HelpCircle,
  RefreshCw,
} from 'lucide-react';

const MOCK_PERFORMANCE: InstructorPerformanceResponse = {
  courses: [
    {
      id: 'course-001',
      title: 'Budidaya Hidroponik Modern untuk Pemula',
      enrolled_count: 1450,
      completion_rate: 78.5,
      avg_rating: 4.8,
      drop_rate: 5.2,
      avg_completion_days: 14,
      revenue: 0,
    },
    {
      id: 'course-002',
      title: 'Manajemen Keuangan & Bisnis Tani Mandiri',
      enrolled_count: 85,
      completion_rate: 35.0,
      avg_rating: 4.5,
      drop_rate: 15.0,
      avg_completion_days: 20,
      revenue: 0,
    },
    {
      id: 'course-004',
      title: 'Pencegahan Hama Organik Terpadu',
      enrolled_count: 310,
      completion_rate: 82.0,
      avg_rating: 4.6,
      drop_rate: 4.0,
      avg_completion_days: 8,
      revenue: 0,
    },
  ],
  enrollment_trend: [
    { month: 'Jan', count: 120 },
    { month: 'Feb', count: 150 },
    { month: 'Mar', count: 280 },
    { month: 'Apr', count: 320 },
    { month: 'Mei', count: 480 },
  ],
  rating_distribution: {
    '5 Star': 85,
    '4 Star': 30,
    '3 Star': 6,
    '2 Star': 2,
    '1 Star': 1,
  },
};

const chartConfig = {
  count: {
    label: 'Murid Baru',
    color: '#475569',
  },
  completion_rate: {
    label: 'Kelulusan',
    color: '#475569',
  },
  jumlah: {
    label: 'Ulasan',
  },
  star5: {
    label: '5 Bintang',
    color: '#1e293b',
  },
  star4: {
    label: '4 Bintang',
    color: '#334155',
  },
  star3: {
    label: '3 Bintang',
    color: '#475569',
  },
  star2: {
    label: '2 Bintang',
    color: '#64748b',
  },
  star1: {
    label: '1 Bintang',
    color: '#94a3b8',
  },
} satisfies ChartConfig;

export default function InstructorAnalyticsPage() {
  const user = getStoredAuthUser();
  const [isOffline, setIsOffline] = React.useState(false);

  const { data: performance, isLoading } = useQuery<InstructorPerformanceResponse>({
    queryKey: ['instructor-analytics-performance', user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) throw new Error('Unauthenticated');
        return await instructorService.getCoursePerformance(user.id);
      } catch {
        setIsOffline(true);
        toast.error('Koneksi ke server terputus. Gagal memuat data teraktual.');
        return MOCK_PERFORMANCE;
      }
    },
  });

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-[300px]" />
          <Skeleton className="h-[300px]" />
        </div>
      </div>
    );
  }

  const activePerf = performance || MOCK_PERFORMANCE;

  // Transform rating distribution for Recharts
  const ratingData = Object.entries(activePerf.rating_distribution).map(([key, val]) => {
    const keyMap: Record<string, string> = {
      '5 Star': 'star5',
      '4 Star': 'star4',
      '3 Star': 'star3',
      '2 Star': 'star2',
      '1 Star': 'star1',
    };
    const keyId = keyMap[key] || 'star5';
    return {
      stars: key,
      jumlah: val,
      fill: `var(--color-${keyId})`,
    };
  });

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Analisis Kelas & Murid 📈
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Ukur tingkat penyelesaian materi, trend registrasi bulanan, and distribusi bintang
          kepuasan belajar.
        </p>
      </div>

      {/* Main Charts Row 1: Line & Bar */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Trend Area Chart */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/20">
            <CardTitle className="text-xs font-black text-slate-850 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              Pendaftaran Murid Baru (Bulanan)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            {isOffline ? (
              <div className="flex h-[250px] items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-xs px-4 text-center">
                Gagal memuat data statistik pendaftaran / Koneksi ke server Academy terputus
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[250px] w-full text-slate-800">
                <AreaChart
                  accessibilityLayer
                  data={activePerf.enrollment_trend}
                  margin={{
                    left: 12,
                    right: 12,
                  }}
                >
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight="bold"
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" />} />
                  <Area
                    dataKey="count"
                    type="natural"
                    fill="var(--color-count)"
                    fillOpacity={0.2}
                    stroke="var(--color-count)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="border-t border-slate-100 bg-slate-50/20 p-4 mt-auto">
            <div className="flex w-full items-start gap-2 text-xs">
              <div className="grid gap-1">
                <div className="flex items-center gap-1.5 leading-none font-bold text-slate-800">
                  Pendaftaran meningkat 50% bulan ini{' '}
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-center gap-1.5 leading-none text-slate-400 font-semibold">
                  Januari - Mei 2026
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Completion Rates Chart */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/20">
            <CardTitle className="text-xs font-black text-slate-850 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              Tingkat Kelulusan per Kelas (%)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            {isOffline ? (
              <div className="flex h-[250px] items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-xs px-4 text-center">
                Gagal memuat data statistik kelulusan / Koneksi ke server Academy terputus
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[250px] w-full text-slate-800">
                <BarChart accessibilityLayer data={activePerf.courses}>
                  <CartesianGrid vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="id"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight="bold"
                  />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="completion_rate" fill="var(--color-completion_rate)" radius={8} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="border-t border-slate-100 bg-slate-50/20 p-4 mt-auto">
            <div className="flex w-full items-start gap-2 text-xs">
              <div className="grid gap-1">
                <div className="flex items-center gap-1.5 leading-none font-bold text-slate-800">
                  Rata-rata tingkat kelulusan stabil{' '}
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-center gap-1.5 leading-none text-slate-400 font-semibold">
                  Berdasarkan seluruh materi kelas
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Row 2: Grid and Ratings Distribution */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Rating distribution pie/bar */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/20">
            <CardTitle className="text-xs font-black text-slate-850 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              Sebaran Bintang Penilaian
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            {isOffline ? (
              <div className="flex h-[220px] items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-xs px-4 text-center">
                Gagal memuat data sebaran bintang / Koneksi ke server Academy terputus
              </div>
            ) : (
              <ChartContainer config={chartConfig} className="h-[220px] w-full text-slate-800">
                <BarChart
                  accessibilityLayer
                  data={ratingData}
                  layout="vertical"
                  margin={{
                    left: 0,
                  }}
                >
                  <YAxis
                    dataKey="stars"
                    type="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => {
                      const keyMap: Record<string, string> = {
                        '5 Star': 'star5',
                        '4 Star': 'star4',
                        '3 Star': 'star3',
                        '2 Star': 'star2',
                        '1 Star': 'star1',
                      };
                      const keyId = keyMap[value] || 'star5';
                      return (
                        (chartConfig[keyId as keyof typeof chartConfig]?.label as string) || value
                      );
                    }}
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight="bold"
                  />
                  <XAxis dataKey="jumlah" type="number" hide />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Bar dataKey="jumlah" radius={5} />
                </BarChart>
              </ChartContainer>
            )}
          </CardContent>
          <CardFooter className="border-t border-slate-100 bg-slate-50/20 p-4 mt-auto">
            <div className="flex w-full items-start gap-2 text-xs">
              <div className="grid gap-1">
                <div className="flex items-center gap-1.5 leading-none font-bold text-slate-800">
                  Kepuasan belajar sangat tinggi{' '}
                  <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                </div>
                <div className="flex items-center gap-1.5 leading-none text-slate-400 font-semibold">
                  Berdasarkan penilaian terbaru peserta
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>

        {/* Engagement Stats table */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden md:col-span-2 flex flex-col justify-between">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/20">
            <CardTitle className="text-xs font-black text-slate-850 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-slate-400 shrink-0" />
              Rincian Efisiensi & Kemajuan per Kelas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            {isOffline ? (
              <div className="flex h-[220px] items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-xs px-4 text-center">
                Gagal memuat data rincian efisiensi / Koneksi ke server Academy terputus
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent bg-slate-50/55 border-b border-slate-100 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <TableHead className="py-3 px-4 h-10 font-bold text-slate-500">
                      Judul Kelas
                    </TableHead>
                    <TableHead className="py-3 px-4 h-10 text-center font-bold text-slate-500">
                      Rerata Kelulusan
                    </TableHead>
                    <TableHead className="py-3 px-4 h-10 text-center font-bold text-slate-500">
                      Drop-Off Rate
                    </TableHead>
                    <TableHead className="py-3 px-4 h-10 text-right font-bold text-slate-500">
                      Rerata Hari Lulus
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-xs font-semibold text-slate-700">
                  {activePerf.courses.map((course) => (
                    <TableRow
                      key={course.id}
                      className="hover:bg-slate-50/40 transition-colors border-b border-slate-100"
                    >
                      <TableCell className="py-4 px-4 font-bold text-slate-800 text-xs">
                        {course.title}
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center">
                        <Badge className="bg-slate-100 hover:bg-slate-200 border-none text-slate-700 font-bold text-[10px]">
                          {course.completion_rate}%
                        </Badge>
                      </TableCell>
                      <TableCell className="py-4 px-4 text-center text-slate-500 font-bold font-mono">
                        {course.drop_rate}%
                      </TableCell>
                      <TableCell className="py-4 px-4 text-right font-bold font-mono text-slate-600">
                        {course.avg_completion_days} Hari
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
          <CardFooter className="border-t border-slate-100 bg-slate-50/20 p-4 mt-auto">
            <div className="flex w-full items-start gap-2 text-xs">
              <div className="grid gap-1">
                <div className="flex items-center gap-1.5 leading-none font-bold text-slate-800">
                  Efisiensi belajar kelas di atas rata-rata nasional{' '}
                  <Clock className="h-4 w-4 text-emerald-500" />
                </div>
                <div className="flex items-center gap-1.5 leading-none text-slate-400 font-semibold">
                  Penyelesaian kelas rata-rata dalam 14 hari kerja
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
