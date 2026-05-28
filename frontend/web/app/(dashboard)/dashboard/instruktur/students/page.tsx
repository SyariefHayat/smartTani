'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { instructorService } from '@/services/instructor';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Users,
  Search,
  Mail,
  GraduationCap,
  Calendar,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';

interface GlobalStudent {
  id: string;
  name: string;
  email: string;
  course_id: string;
  course_title: string;
  progress: number;
  status: 'active' | 'completed' | 'dropped';
  enrolled_at: string;
}

const MOCK_GLOBAL_STUDENTS: GlobalStudent[] = [
  {
    id: 'siswa-1',
    name: 'Farhan Setiawan',
    email: 'farhan@gmail.com',
    course_id: 'course-001',
    course_title: 'Budidaya Hidroponik Modern untuk Pemula',
    progress: 75,
    status: 'active',
    enrolled_at: '2026-05-15T08:00:00Z',
  },
  {
    id: 'siswa-2',
    name: 'Dewi Lestari',
    email: 'dewi.l@yahoo.com',
    course_id: 'course-001',
    course_title: 'Budidaya Hidroponik Modern untuk Pemula',
    progress: 100,
    status: 'completed',
    enrolled_at: '2026-05-18T10:00:00Z',
  },
  {
    id: 'siswa-3',
    name: 'Ahmad Ghozali',
    email: 'ghozali@agri.id',
    course_id: 'course-004',
    course_title: 'Pencegahan Hama Organik Terpadu',
    progress: 45,
    status: 'active',
    enrolled_at: '2026-05-20T14:30:00Z',
  },
  {
    id: 'siswa-4',
    name: 'Siti Aminah',
    email: 'siti.aminah@gmail.com',
    course_id: 'course-001',
    course_title: 'Budidaya Hidroponik Modern untuk Pemula',
    progress: 15,
    status: 'active',
    enrolled_at: '2026-05-22T08:00:00Z',
  },
  {
    id: 'siswa-5',
    name: 'Budi Raharjo',
    email: 'budi.raharjo@outlook.com',
    course_id: 'course-004',
    course_title: 'Pencegahan Hama Organik Terpadu',
    progress: 10,
    status: 'dropped',
    enrolled_at: '2026-05-10T11:00:00Z',
  },
];

export default function GlobalStudentsPage() {
  const user = getStoredAuthUser();
  const [isOffline, setIsOffline] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [courseFilter, setCourseFilter] = React.useState<string>('all');

  const { data: students, isLoading } = useQuery<GlobalStudent[]>({
    queryKey: ['instructor-global-students', user?.id],
    queryFn: async () => {
      // Offline fallback
      setIsOffline(true);
      return MOCK_GLOBAL_STUDENTS;
    },
  });

  const activeStudents = students || MOCK_GLOBAL_STUDENTS;

  const filteredStudents = React.useMemo(() => {
    return activeStudents.filter((std) => {
      const matchSearch =
        std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        std.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCourse = courseFilter === 'all' || std.course_id === courseFilter;

      return matchSearch && matchCourse;
    });
  }, [activeStudents, searchQuery, courseFilter]);

  // Unique course options
  const courseOptions = React.useMemo(() => {
    const list: Array<{ id: string; title: string }> = [];
    activeStudents.forEach((std) => {
      if (!list.some((c) => c.id === std.course_id)) {
        list.push({ id: std.course_id, title: std.course_title });
      }
    });
    return list;
  }, [activeStudents]);

  // Global aggregate stats
  const stats = React.useMemo(() => {
    const total = activeStudents.length;
    const completed = activeStudents.filter((s) => s.status === 'completed').length;
    const active = activeStudents.filter((s) => s.status === 'active').length;

    const avgProg =
      total > 0 ? Math.round(activeStudents.reduce((acc, s) => acc + s.progress, 0) / total) : 0;
    const compRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    return { total, active, completed, avgProg, compRate };
  }, [activeStudents]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-50 border border-green-150 text-green-700 text-[9px] font-bold rounded-lg uppercase">
            Lulus
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
            Belajar
          </Badge>
        );
    }
  };

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
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Master Peserta SiTani 👥
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Daftar komprehensif seluruh murid yang terdaftar di seluruh kelas ajar Anda.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Academy Service sedang tidak terhubung. Menampilkan rangkuman peserta luring.
            </p>
          </div>
        </div>
      )}

      {/* Global Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1 */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{stats.total}</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Unique Murid
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 2 */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{stats.active}</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Aktif Belajar
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 3 */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <CheckCircle className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{stats.completed}</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Lulus Ujian
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Card 4 */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{stats.compRate}%</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Completion Rate
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

        <div className="w-full sm:max-w-xs">
          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-full bg-white border-slate-200 text-xs rounded-xl focus:ring-green-500">
              <SelectValue placeholder="Filter Berdasarkan Kelas..." />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-xl text-slate-700">
              <SelectItem value="all" className="text-xs cursor-pointer rounded-lg">
                Semua Kelas
              </SelectItem>
              {courseOptions.map((opt) => (
                <SelectItem
                  key={opt.id}
                  value={opt.id}
                  className="text-xs cursor-pointer rounded-lg"
                >
                  {opt.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Aggregated Table list */}
      {filteredStudents.length === 0 ? (
        <Card className="border-dashed border-slate-200 bg-slate-50/50 py-12 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-semibold text-slate-400">
            Tidak ada murid yang sesuai filter.
          </p>
        </Card>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-150 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-4">Nama Murid</th>
                  <th className="py-3 px-4">Judul Kelas</th>
                  <th className="py-3 px-4">Kemajuan</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Tanggal Enroll</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
                {filteredStudents.map((std, idx) => {
                  const enrollDate = new Date(std.enrolled_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <tr key={idx} className="hover:bg-slate-50/30 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-800">{std.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                            <Mail className="h-3 w-3 text-slate-300" />
                            {std.email}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-500 font-medium">{std.course_title}</td>
                      <td className="py-3.5 px-4 w-44">
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-500">
                            {std.progress}%
                          </div>
                          <Progress
                            value={std.progress}
                            className="h-1.5 w-full bg-slate-100 [&>div]:bg-green-600 rounded-full"
                          />
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{getStatusBadge(std.status)}</td>
                      <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[10px] flex items-center justify-end gap-1 mt-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-350 shrink-0" />
                        {enrollDate}
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
