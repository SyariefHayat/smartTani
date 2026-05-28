'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { instructorService, StudentPerformanceResponse } from '@/services/instructor';
import { academyService, Course } from '@/services/academy';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Users,
  Award,
  CheckCircle,
  TrendingUp,
  Search,
  BookOpen,
  Calendar,
  AlertTriangle,
  Mail,
  UserCheck,
} from 'lucide-react';

const MOCK_STUDENTS: StudentPerformanceResponse = {
  students: [
    {
      student_id: 'siswa-1',
      student_name: 'Farhan Setiawan',
      student_email: 'farhan@gmail.com',
      enrolled_at: '2026-05-15T08:00:00Z',
      progress_percent: 75,
      status: 'active',
      last_module_title: 'Pembangunan Instalasi NFT & Drip System',
    },
    {
      student_id: 'siswa-2',
      student_name: 'Dewi Lestari',
      student_email: 'dewi.l@yahoo.com',
      enrolled_at: '2026-05-18T10:00:00Z',
      progress_percent: 100,
      status: 'completed',
      last_module_title: 'Ujian Akhir: Pemahaman Hidroponik Dasar',
    },
    {
      student_id: 'siswa-3',
      student_name: 'Ahmad Ghozali',
      student_email: 'ghozali@agri.id',
      enrolled_at: '2026-05-20T14:30:00Z',
      progress_percent: 45,
      status: 'active',
      last_module_title: 'Pengenalan Hidroponik & Jenis Tanaman',
    },
    {
      student_id: 'siswa-4',
      student_name: 'Siti Aminah',
      student_email: 'siti.aminah@gmail.com',
      enrolled_at: '2026-05-22T08:00:00Z',
      progress_percent: 15,
      status: 'active',
      last_module_title: 'Pengenalan Hidroponik & Jenis Tanaman',
    },
    {
      student_id: 'siswa-5',
      student_name: 'Budi Raharjo',
      student_email: 'budi.raharjo@outlook.com',
      enrolled_at: '2026-05-10T11:00:00Z',
      progress_percent: 10,
      status: 'dropped',
      last_module_title: 'Pengenalan Hidroponik & Jenis Tanaman',
    },
  ],
  stats: {
    total: 5,
    active: 3,
    completed: 1,
    dropped: 1,
    avg_progress: 49,
    completion_rate: 20.0,
  },
  meta: {
    page: 1,
    limit: 10,
    total: 5,
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CourseStudentsPage({ params }: PageProps) {
  const { id: courseId } = React.use(params);
  const user = getStoredAuthUser();
  const [isOffline, setIsOffline] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<
    'all' | 'active' | 'completed' | 'dropped'
  >('all');

  // Fetch course details
  const { data: course } = useQuery<Course | null>({
    queryKey: ['instructor-course-students-parent', courseId],
    queryFn: async () => {
      try {
        return await academyService.getCourseById(courseId);
      } catch {
        const key = `courses-${user?.id}`;
        const courses = JSON.parse(localStorage.getItem(key) || '[]');
        return courses.find((c: any) => c.id === courseId) || null;
      }
    },
  });

  // Fetch student performance
  const { data: performance, isLoading } = useQuery<StudentPerformanceResponse>({
    queryKey: ['instructor-course-students-list', courseId, user?.id],
    queryFn: async () => {
      try {
        return await instructorService.getStudents(courseId);
      } catch {
        setIsOffline(true);
        return MOCK_STUDENTS;
      }
    },
  });

  const activeStats = performance?.stats || MOCK_STUDENTS.stats;
  const listStudents = performance?.students || MOCK_STUDENTS.students;

  const filteredStudents = React.useMemo(() => {
    return listStudents.filter((std) => {
      const matchSearch =
        std.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        std.student_email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'all' || std.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [listStudents, searchQuery, statusFilter]);

  const getProgressColorClass = (pct: number) => {
    if (pct >= 75) return 'bg-green-600';
    if (pct >= 25) return 'bg-amber-500';
    return 'bg-red-500';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-50 border border-green-150 text-green-700 text-[9px] font-bold rounded-lg uppercase">
            Selesai
          </Badge>
        );
      case 'dropped':
        return (
          <Badge className="bg-red-50 border border-red-150 text-red-600 text-[9px] font-bold rounded-lg uppercase">
            Dropped
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-50 border border-blue-150 text-blue-700 text-[9px] font-bold rounded-lg uppercase">
            Aktif
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/instruktur/courses"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali ke Daftar Kelas
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Peserta Kelas: {course?.title || 'Memuat...'} 👥
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Monitor tingkat partisipasi, kemajuan materi bab belajar, and tingkat kelulusan murid
          Anda.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Academy Service sedang tidak terhubung. Menampilkan data evaluasi peserta luring.
            </p>
          </div>
        </div>
      )}

      {/* Statistics Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Stat 1 */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{activeStats.total}</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Total Terdaftar
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stat 2 */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{activeStats.active}</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Belajar Aktif
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stat 3 */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{activeStats.completed}</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Telah Lulus
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stat 4 */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{activeStats.avg_progress}%</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Rerata Kemajuan
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Control filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <Input
            placeholder="Cari nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl max-w-fit self-end sm:self-auto">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'ghost'}
            onClick={() => setStatusFilter('all')}
            size="sm"
            className="text-[10px] font-black rounded-lg px-3 py-1"
          >
            Semua
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'ghost'}
            onClick={() => setStatusFilter('active')}
            size="sm"
            className="text-[10px] font-black rounded-lg px-3 py-1"
          >
            Aktif
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'ghost'}
            onClick={() => setStatusFilter('completed')}
            size="sm"
            className="text-[10px] font-black rounded-lg px-3 py-1"
          >
            Selesai
          </Button>
          <Button
            variant={statusFilter === 'dropped' ? 'default' : 'ghost'}
            onClick={() => setStatusFilter('dropped')}
            size="sm"
            className="text-[10px] font-black rounded-lg px-3 py-1"
          >
            Dropped
          </Button>
        </div>
      </div>

      {/* Students Data Grid Table */}
      {filteredStudents.length === 0 ? (
        <Card className="border-dashed border-slate-200 bg-slate-50/50 py-12 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-semibold text-slate-400">
            Tidak ada murid yang cocok dengan filter.
          </p>
        </Card>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Nama Murid</th>
                  <th className="py-3 px-4">Kemajuan Modul</th>
                  <th className="py-3 px-4">Modul Bab Terakhir</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Tanggal Daftar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filteredStudents.map((std) => {
                  const enrolledDate = new Date(std.enrolled_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={std.student_id} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-800">{std.student_name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                            <Mail className="h-3 w-3 text-slate-300" />
                            {std.student_email}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 w-48">
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                            <span>{std.progress_percent}% Progres</span>
                          </div>
                          <Progress
                            value={std.progress_percent}
                            className="h-1.5 w-full bg-slate-100 [&>div]:bg-green-600 rounded-full"
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 max-w-xs truncate italic">
                        {std.last_module_title || '-'}
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(std.status)}</td>
                      <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[10px]">
                        {enrolledDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
