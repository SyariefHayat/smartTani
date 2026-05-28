'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { instructorService, InstructorPerformanceResponse } from '@/services/instructor';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
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
  TrendingUp,
  Award,
  Star,
  Clock,
  BookOpen,
  Users,
  AlertTriangle,
  HelpCircle,
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
  const ratingData = Object.entries(activePerf.rating_distribution).map(([key, val]) => ({
    name: key,
    jumlah: val,
  }));

  const COLORS = ['#10b981', '#34d399', '#f59e0b', '#ef4444', '#b91c1c'];

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

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Academy Service sedang tidak terhubung. Menampilkan grafik data performa luring.
            </p>
          </div>
        </div>
      )}

      {/* Main Charts Row 1: Line & Bar */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Trend Area Chart */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/20">
            <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-green-600 shrink-0" />
              Pendaftaran Murid Baru (Bulanan)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <div className="h-[250px] w-full text-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={activePerf.enrollment_trend}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight="bold"
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight="bold"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      borderColor: '#e2e8f0',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#16a34a"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorCount)"
                    name="Murid Baru"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Completion Rates Chart */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/20">
            <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="h-4.5 w-4.5 text-green-600 shrink-0" />
              Tingkat Kelulusan per Kelas (%)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <div className="h-[250px] w-full text-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={activePerf.courses}
                  margin={{ top: 5, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="id"
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight="bold"
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight="bold"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      borderColor: '#e2e8f0',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                    formatter={(val) => [`${val}%`, 'Kelulusan']}
                  />
                  <Bar
                    dataKey="completion_rate"
                    fill="#059669"
                    radius={[4, 4, 0, 0]}
                    name="Completion Rate"
                  >
                    {activePerf.courses.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#059669' : '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Grid and Ratings Distribution */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Rating distribution pie/bar */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/20">
            <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-500 shrink-0" />
              Sebaran Bintang Penilaian
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-6">
            <div className="h-[220px] w-full text-slate-800">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={ratingData}
                  layout="vertical"
                  margin={{ top: 5, right: 15, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight="bold"
                    tickLine={false}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#94a3b8"
                    fontSize={10}
                    fontWeight="bold"
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#ffffff',
                      borderRadius: '12px',
                      borderColor: '#e2e8f0',
                      fontSize: '11px',
                      fontWeight: 'bold',
                    }}
                  />
                  <Bar dataKey="jumlah" radius={[0, 4, 4, 0]} name="Ulasan">
                    {ratingData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Engagement Stats table */}
        <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden md:col-span-2">
          <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/20">
            <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Clock className="h-4.5 w-4.5 text-green-600 shrink-0" />
              Rincian Efisiensi & Kemajuan per Kelas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-2.5 px-4">Judul Kelas</th>
                    <th className="py-2.5 px-4 text-center">Rerata Kelulusan</th>
                    <th className="py-2.5 px-4 text-center">Drop-Off Rate</th>
                    <th className="py-2.5 px-4 text-right">Rerata Hari Lulus</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                  {activePerf.courses.map((course) => (
                    <tr key={course.id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3 px-4 text-slate-800 font-bold">{course.title}</td>
                      <td className="py-3 px-4 text-center">
                        <Badge className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-[10px]">
                          {course.completion_rate}%
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-center text-red-500 font-bold">
                        {course.drop_rate}%
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-500">
                        {course.avg_completion_days} Hari
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
