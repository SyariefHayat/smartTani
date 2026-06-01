'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { instructorService } from '@/services/instructor';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import {
  Users,
  Search,
  Mail,
  GraduationCap,
  Calendar,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  RefreshCw,
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
  const [searchQuery, setSearchQuery] = React.useState('');
  const [courseFilter, setCourseFilter] = React.useState<string>('all');
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 5;

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [searchQuery, courseFilter]);

  const {
    data: students,
    isLoading,
    isError,
    refetch,
  } = useQuery<GlobalStudent[]>({
    queryKey: ['instructor-global-students', user?.id],
    queryFn: async () => {
      // 1. Get instructor's courses
      const coursesRes = await instructorService.getMyCourses();
      if (!coursesRes || !coursesRes.courses || coursesRes.courses.length === 0) {
        return [];
      }

      // 2. Fetch students for all courses in parallel
      const studentPromises = coursesRes.courses.map(async (course) => {
        const res = await instructorService.getStudents(course.id);
        if (res && res.students) {
          return res.students.map((std) => ({
            id: std.student_id,
            name: std.student_name,
            email: std.student_email,
            course_id: course.id,
            course_title: course.title,
            progress: std.progress_percent,
            status: std.status,
            enrolled_at: std.enrolled_at,
          }));
        }
        return [];
      });

      const allStudentsLists = await Promise.all(studentPromises);
      return allStudentsLists.flat();
    },
  });

  React.useEffect(() => {
    if (isError) {
      toast.error('Koneksi ke Layanan Academy terputus.');
    }
  }, [isError]);

  const activeStudents = students || [];

  const filteredStudents = React.useMemo(() => {
    return activeStudents.filter((std) => {
      const matchSearch =
        std.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        std.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCourse = courseFilter === 'all' || std.course_id === courseFilter;

      return matchSearch && matchCourse;
    });
  }, [activeStudents, searchQuery, courseFilter]);

  const totalRows = filteredStudents.length;
  const totalPages = Math.ceil(totalRows / itemsPerPage);
  const fromRow = totalRows === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const toRow = Math.min(currentPage * itemsPerPage, totalRows);

  const paginatedStudents = React.useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(start, start + itemsPerPage);
  }, [filteredStudents, currentPage, itemsPerPage]);

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
          <Badge className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-medium rounded-md">
            Lulus
          </Badge>
        );
      case 'dropped':
        return (
          <Badge className="bg-slate-100 border border-slate-200 text-slate-500 text-[10px] font-medium rounded-md">
            Dropped
          </Badge>
        );
      default:
        return (
          <Badge className="bg-slate-50 border border-slate-200 text-slate-600 text-[10px] font-medium rounded-md">
            Belajar
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-28 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full space-y-6 text-slate-900 pb-12">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Master Peserta SiTani 👥
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Daftar komprehensif seluruh murid yang terdaftar di seluruh kelas ajar Anda.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50 py-16 px-6">
          <AlertTriangle className="h-8 w-8 text-red-400 mb-3 animate-pulse" />
          <p className="text-sm font-bold text-red-500 mb-1">Gagal Memuat Daftar Peserta</p>
          <p className="text-xs text-red-400 mb-4">
            Koneksi ke server Academy terputus. Silakan coba lagi.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-700 bg-white hover:bg-red-100 font-bold text-xs gap-1.5"
            onClick={() => refetch()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Coba Hubungkan Kembali
          </Button>
        </div>
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

      {/* Global Stats Cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {/* Card 1: Total Murid */}
        <Card className="min-w-0">
          <CardHeader className="gap-1">
            <CardDescription className="truncate text-xs">Total Murid</CardDescription>
            <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
              {stats.total}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex w-full min-w-0 items-center gap-1 font-medium">
              <Users className="size-4 shrink-0 text-slate-400" />
              <span className="truncate text-muted-foreground text-xs">
                Terdaftar di semua kelas
              </span>
            </div>
          </CardFooter>
        </Card>

        {/* Card 2: Aktif Belajar */}
        <Card className="min-w-0">
          <CardHeader className="gap-1">
            <CardDescription className="truncate text-xs">Aktif Belajar</CardDescription>
            <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
              {stats.active}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex w-full min-w-0 items-center gap-1 font-medium">
              <GraduationCap className="size-4 shrink-0 text-slate-400" />
              <span className="truncate text-muted-foreground text-xs">Sedang mengikuti modul</span>
            </div>
          </CardFooter>
        </Card>

        {/* Card 3: Lulus Belajar */}
        <Card className="min-w-0">
          <CardHeader className="gap-1">
            <CardDescription className="truncate text-xs">Lulus Belajar</CardDescription>
            <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
              {stats.completed}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex w-full min-w-0 items-center gap-1 font-medium">
              <CheckCircle className="size-4 shrink-0 text-slate-400" />
              <span className="truncate text-muted-foreground text-xs">
                Menyelesaikan seluruh modul
              </span>
            </div>
          </CardFooter>
        </Card>

        {/* Card 4: Rasio Kelulusan */}
        <Card className="min-w-0">
          <CardHeader className="gap-1">
            <CardDescription className="truncate text-xs">Rasio Kelulusan</CardDescription>
            <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
              {stats.compRate}%
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="flex w-full min-w-0 items-center gap-1 font-medium">
              <TrendingUp className="size-4 shrink-0 text-slate-400" />
              <span className="truncate text-muted-foreground text-xs">
                Rasio murid lulus vs total
              </span>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Control filters */}
      {/* Table & Filters Single Container */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        {/* Container Header with Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between bg-slate-50/20">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <Input
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white border-slate-200 text-xs font-semibold rounded-xl h-8.5"
            />
          </div>

          <div className="w-full sm:max-w-xs">
            <Select value={courseFilter} onValueChange={setCourseFilter}>
              <SelectTrigger className="w-full bg-white border-slate-200 text-xs rounded-xl h-8.5">
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
          <CardContent className="py-16 flex flex-col items-center justify-center text-center text-slate-450">
            <p className="text-xs font-semibold">Tidak ada murid yang sesuai filter.</p>
          </CardContent>
        ) : (
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent bg-slate-50/50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <TableHead className="py-3 px-4 h-9">Nama Murid</TableHead>
                  <TableHead className="py-3 px-4 h-9">Judul Kelas</TableHead>
                  <TableHead className="py-3 px-4 h-9">Kemajuan</TableHead>
                  <TableHead className="py-3 px-4 h-9">Status</TableHead>
                  <TableHead className="py-3 px-4 h-9 text-right">Tanggal Enroll</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="text-xs font-semibold text-slate-700">
                {paginatedStudents.map((std, idx) => {
                  const enrollDate = new Date(std.enrolled_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  });

                  return (
                    <TableRow
                      key={idx}
                      className="hover:bg-slate-50/20 transition-colors border-b border-slate-100"
                    >
                      <TableCell className="py-3.5 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-slate-800">{std.name}</span>
                          <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
                            <Mail className="h-3 w-3 text-slate-300" />
                            {std.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 px-4 text-slate-500 font-medium">
                        {std.course_title}
                      </TableCell>
                      <TableCell className="py-3.5 px-4 w-44">
                        <div className="space-y-1">
                          <div className="text-[10px] font-bold text-slate-500">
                            {std.progress}%
                          </div>
                          <Progress
                            value={std.progress}
                            className="h-1.5 w-full bg-slate-100 [&>div]:bg-slate-600 rounded-full"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="py-3.5 px-4">{getStatusBadge(std.status)}</TableCell>
                      <TableCell className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1 text-slate-400 font-mono text-[10px]">
                          <Calendar className="h-3.5 w-3.5 text-slate-305 shrink-0" />
                          {enrollDate}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between gap-4 p-4 border-t border-slate-100 mt-0 bg-slate-50/10">
              <div className="text-xs font-semibold text-slate-500">
                Menampilkan{' '}
                <span className="font-bold text-slate-800">
                  {fromRow}–{toRow}
                </span>{' '}
                dari <span className="font-bold text-slate-800">{totalRows}</span> murid
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
          </CardContent>
        )}
      </Card>
    </div>
  );
}
