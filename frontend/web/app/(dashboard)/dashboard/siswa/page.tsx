'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { academyService, StudentAnalytics, Enrollment, Course } from '@/services/academy';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  GraduationCap,
  Award,
  Clock,
  BookOpen,
  Calendar,
  ArrowRight,
  Play,
  CheckCircle2,
  Tv,
  Star,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';

const MOCK_ANALYTICS: StudentAnalytics = {
  active_courses: 2,
  completed_courses: 3,
  certificates_count: 3,
  total_learning_hours: 45,
  current_streak_days: 7,
  top_categories: [
    { category: 'Budidaya', count: 3 },
    { category: 'Agroteknologi', count: 2 },
  ],
};

const MOCK_ACTIVE_ENROLLMENTS: Enrollment[] = [
  {
    id: 'enroll-1',
    student_id: 'siswa-1',
    course_id: 'course-001',
    status: 'active',
    enrolled_at: '2026-05-15T08:00:00Z',
    progress_percent: 65,
    course: {
      id: 'course-001',
      title: 'Budidaya Hidroponik Modern untuk Pemula',
      description: 'Materi dasar teknik hidroponik menggunakan sistem NFT dan Drip.',
      short_description: 'Pelajari dasar-dasar berkebun bersih dengan air.',
      category: 'Budidaya',
      difficulty: 'pemula',
      mode: 'online',
      duration_hours: 12,
      instructor_id: 'inst-1',
      instructor_name: 'Dr. Ir. Heri Susanto',
      instructor_title: 'Dosen Agroteknologi IPB',
      price: 0,
      is_free: true,
      is_published: true,
      enrolled_count: 1450,
      average_rating: 4.8,
      review_count: 180,
    },
  },
  {
    id: 'enroll-2',
    student_id: 'siswa-1',
    course_id: 'course-002',
    status: 'active',
    enrolled_at: '2026-05-18T10:00:00Z',
    progress_percent: 20,
    course: {
      id: 'course-002',
      title: 'Manajemen Keuangan & Bisnis Tani Mandiri',
      description: 'Materi dasar teknik mengelola arus kas usaha tani.',
      short_description: 'Mengelola keuangan komoditas agar untung besar.',
      category: 'Manajemen Bisnis Tani',
      difficulty: 'menengah',
      mode: 'online',
      duration_hours: 15,
      instructor_id: 'inst-2',
      instructor_name: 'Budi Santoso, MBA',
      instructor_title: 'Praktisi Agribisnis & Investor',
      price: 0,
      is_free: true,
      is_published: true,
      enrolled_count: 890,
      average_rating: 4.7,
      review_count: 94,
    },
  },
];

const MOCK_RECOMMENDED_COURSES: Course[] = [
  {
    id: 'course-003',
    title: 'Teknologi IoT & Sensor Tanah Pintar',
    description: 'Penerapan modul Arduino dan sensor kelembaban tanah untuk otomatisasi pengairan.',
    short_description: 'Gabungkan teknologi terkini dengan lahan pertanian Anda.',
    category: 'Agroteknologi',
    difficulty: 'ahli',
    mode: 'blended',
    duration_hours: 20,
    instructor_id: 'inst-3',
    instructor_name: 'Riza Fahmi, M.T.',
    instructor_title: 'IoT Engineer & Founder AgriTech',
    price: 150000,
    is_free: false,
    is_published: true,
    enrolled_count: 320,
    average_rating: 4.9,
    review_count: 45,
  },
  {
    id: 'course-004',
    title: 'Pencegahan Hama Organik Terpadu',
    description: 'Teknik pembuatan pestisida hayati dan pengendali alami tanpa bahan kimia.',
    short_description: 'Jaga kebersihan lahan dan hasil panen tanpa racun.',
    category: 'Budidaya',
    difficulty: 'pemula',
    mode: 'online',
    duration_hours: 8,
    instructor_id: 'inst-1',
    instructor_name: 'Dr. Ir. Heri Susanto',
    instructor_title: 'Dosen Agroteknologi IPB',
    price: 0,
    is_free: true,
    is_published: true,
    enrolled_count: 2100,
    average_rating: 4.6,
    review_count: 310,
  },
];

const MOCK_WEBINARS = [
  {
    id: 'web-1',
    title: 'Peluang Ekspor Hortikultura Premium ke Jepang',
    speaker: 'Ahmad Syafii (Direktur Ekspor Tani)',
    date: '30 Mei 2026',
    time: '09:00 - 11:00 WIB',
    status: 'Segera Hadir',
  },
  {
    id: 'web-2',
    title: 'Otomatisasi Lahan dengan Smart Irrigation System',
    speaker: 'Riza Fahmi, M.T. (IoT Specialist)',
    date: '5 Juni 2026',
    time: '14:00 - 16:00 WIB',
    status: 'Segera Hadir',
  },
];

export default function SiswaDashboardPage() {
  const user = getStoredAuthUser();

  // Fetch student stats
  const {
    data: stats,
    isLoading: isStatsLoading,
    isError: isStatsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ['student-analytics', user?.id],
    queryFn: () => academyService.getStudentAnalytics(),
  });

  // Fetch my active courses
  const {
    data: enrollments,
    isLoading: isEnrollmentsLoading,
    isError: isEnrollmentsError,
    refetch: refetchEnrollments,
  } = useQuery({
    queryKey: ['student-enrollments-active', user?.id],
    queryFn: async () => {
      const res = await academyService.getMyEnrollments();
      return res.filter((e) => e.status === 'active');
    },
  });

  // Fetch recommended courses
  const {
    data: recommended,
    isLoading: isRecommendedLoading,
    isError: isRecommendedError,
    refetch: refetchRecommended,
  } = useQuery({
    queryKey: ['student-recommended-courses', user?.id],
    queryFn: async () => {
      const res = await academyService.getCourses({ limit: 3 });
      const list = res.courses || [];
      return list.filter((c) => !enrollments?.some((e) => e.course_id === c.id));
    },
  });

  React.useEffect(() => {
    if (isStatsError || isEnrollmentsError || isRecommendedError) {
      toast.error('Koneksi ke Layanan Academy terputus.');
    }
  }, [isStatsError, isEnrollmentsError, isRecommendedError]);

  const handleRetry = () => {
    refetchStats();
    refetchEnrollments();
    refetchRecommended();
  };

  const isLoading = isStatsLoading || isEnrollmentsLoading || isRecommendedLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-96 md:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const activeStats = stats || MOCK_ANALYTICS;
  const activeEnrollments = enrollments || MOCK_ACTIVE_ENROLLMENTS;
  const activeRecommended = recommended || MOCK_RECOMMENDED_COURSES;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Selamat Belajar, {user?.name || 'Siswa'}! 👋
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Kembangkan keterampilan agribisnis dan teknologi tani Anda bersama SiTani Academy.
        </p>
      </div>

      {/* KPI Stats Panel */}
      {isStatsError ? (
        <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm w-full">
          Gagal memuat data statistik / Koneksi ke server Academy terputus
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {/* Metric 1 */}
          <Card className="min-w-0 border-slate-200 bg-white">
            <CardHeader className="gap-1 pb-2">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Kursus Aktif
              </CardDescription>
              <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800">
                {activeStats.active_courses}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm pb-6">
              <div className="flex w-full min-w-0 items-center gap-1.5 font-medium text-slate-500">
                <BookOpen className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate text-xs text-muted-foreground">
                  Modul sedang aktif dipelajari
                </span>
              </div>
            </CardFooter>
          </Card>

          {/* Metric 2 */}
          <Card className="min-w-0 border-slate-200 bg-white">
            <CardHeader className="gap-1 pb-2">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Kursus Selesai
              </CardDescription>
              <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800">
                {activeStats.completed_courses}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm pb-6">
              <div className="flex w-full min-w-0 items-center gap-1.5 font-medium text-slate-500">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate text-xs text-muted-foreground">
                  Kelas tuntas dipelajari
                </span>
              </div>
            </CardFooter>
          </Card>

          {/* Metric 3 */}
          <Card className="min-w-0 border-slate-200 bg-white">
            <CardHeader className="gap-1 pb-2">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Sertifikat
              </CardDescription>
              <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800">
                {activeStats.certificates_count}
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm pb-6">
              <div className="flex w-full min-w-0 items-center gap-1.5 font-medium text-slate-500">
                <Award className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate text-xs text-muted-foreground">
                  Kredensial kelulusan diterbitkan
                </span>
              </div>
            </CardFooter>
          </Card>

          {/* Metric 4 */}
          <Card className="min-w-0 border-slate-200 bg-white">
            <CardHeader className="gap-1 pb-2">
              <CardDescription className="truncate text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Jam Belajar
              </CardDescription>
              <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl text-slate-800">
                {activeStats.total_learning_hours} Jam
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm pb-6">
              <div className="flex w-full min-w-0 items-center gap-1.5 font-medium text-slate-500">
                <Clock className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="truncate text-xs text-muted-foreground">
                  Akumulasi durasi belajar
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Main Grid Section */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left column (Active progress & recommendations) */}
        <div className="md:col-span-2 space-y-6">
          {/* Active Courses Progress */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-800">
                  Melanjutkan Belajar
                </CardTitle>
                <CardDescription className="text-[11px] font-semibold mt-0.5">
                  Kemajuan modul belajar Anda yang sedang aktif.
                </CardDescription>
              </div>
              <Link href="/dashboard/siswa/my-courses">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                >
                  Semua Kelas <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEnrollmentsError ? (
                <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 p-6 text-center text-red-500 font-semibold text-sm w-full">
                  <AlertTriangle className="h-6 w-6 text-red-600 mb-2 animate-pulse" />
                  <p className="font-bold">Gagal memuat kemajuan belajar</p>
                  <p className="text-xs text-red-400 font-normal mt-1">
                    Koneksi ke server Academy terputus.
                  </p>
                </div>
              ) : activeEnrollments.length === 0 ? (
                <div className="text-center py-8 border border-dashed border-slate-200 rounded-xl">
                  <GraduationCap className="h-10 w-10 text-slate-300 mx-auto" />
                  <h3 className="text-xs font-bold text-slate-800 mt-2">Belum ada kelas diikuti</h3>
                  <p className="text-[10px] font-semibold text-slate-500 mt-1">
                    Pilih kelas di katalog SiTani untuk memulai belajar.
                  </p>
                  <Link href="/dashboard/siswa/courses" className="inline-block mt-3">
                    <Button
                      size="sm"
                      className="bg-slate-800 hover:bg-slate-900 text-xs font-bold text-white shadow-sm cursor-pointer"
                    >
                      Jelajahi Kursus
                    </Button>
                  </Link>
                </div>
              ) : (
                activeEnrollments.map((enroll) => (
                  <div
                    key={enroll.id}
                    className="p-4 border border-slate-100 rounded-xl hover:border-slate-200 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                  >
                    <div className="space-y-2.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-slate-700 border border-slate-200">
                          {enroll.course?.category}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          Instruktur: {enroll.course?.instructor_name}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 leading-tight">
                        {enroll.course?.title}
                      </h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-bold text-slate-500">
                          <span>Syllabus Terpenuhi</span>
                          <span className="text-slate-800 font-bold">
                            {enroll.progress_percent}%
                          </span>
                        </div>
                        <Progress value={enroll.progress_percent} className="h-1.5 bg-slate-100" />
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center justify-end">
                      <Link href={`/dashboard/siswa/courses/${enroll.course_id}/learn`}>
                        <Button className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs h-9 px-3 gap-1 rounded-xl shadow-sm cursor-pointer">
                          <Play className="h-3 w-3 fill-current" /> Lanjut Belajar
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Recommended Courses */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-800">
                Rekomendasi Kelas Terpopuler
              </CardTitle>
              <CardDescription className="text-[11px] font-semibold">
                Kembangkan keahlian tani Anda dengan kelas berperingkat tinggi di platform.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {isRecommendedError ? (
                <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 p-6 text-center text-red-500 font-semibold text-sm col-span-2 w-full">
                  <AlertTriangle className="h-6 w-6 text-red-600 mb-2 animate-pulse" />
                  <p className="font-bold">Gagal memuat rekomendasi kelas</p>
                  <p className="text-xs text-red-400 font-normal mt-1">
                    Koneksi ke server Academy terputus.
                  </p>
                </div>
              ) : (
                activeRecommended.slice(0, 2).map((course) => (
                  <div
                    key={course.id}
                    className="border border-slate-100 hover:border-slate-200 rounded-xl overflow-hidden flex flex-col justify-between bg-white transition-all group"
                  >
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-slate-700 border border-slate-200">
                          {course.category}
                        </span>
                        <div className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-current" />
                          <span>{Number(course.average_rating).toFixed(1)}</span>
                        </div>
                      </div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-slate-700 transition-colors leading-snug line-clamp-2">
                        {course.title}
                      </h4>
                      <p className="text-[10px] font-semibold text-slate-500 line-clamp-2">
                        {course.short_description}
                      </p>
                      <div className="flex items-center gap-3.5 text-[10px] text-slate-500 font-bold">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" /> {course.duration_hours} Jam
                        </span>
                        <span className="inline-flex items-center rounded-md bg-slate-50 border border-slate-200/65 px-1.5 py-0.25 text-[8.5px] uppercase tracking-wide">
                          {course.difficulty}
                        </span>
                      </div>
                    </div>
                    <div className="px-4 py-3 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800">
                        {course.is_free ? 'GRATIS' : `Rp ${course.price.toLocaleString('id-ID')}`}
                      </span>
                      <Link href={`/dashboard/siswa/courses/${course.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-[10.5px] font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
                        >
                          Detail Kelas <ArrowRight className="h-3 w-3 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right column (Webinars & streak progress) */}
        <div className="space-y-6">
          {/* Learning Streak Card */}
          <Card className="border-slate-200 bg-white overflow-hidden shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800">Daily Streak Belajar</h3>
                  <p className="text-xs font-semibold text-slate-500">Jaga produktivitas Anda!</p>
                </div>
                <TrendingUp className="h-6 w-6 text-slate-400 shrink-0" />
              </div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-800 tabular-nums">
                  {activeStats.current_streak_days}
                </span>
                <span className="text-xs font-semibold text-slate-500">Hari Beruntun</span>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 leading-relaxed">
                Anda berada di jalur belajar yang tepat. Selesaikan setidaknya satu modul per hari
                untuk mempertahankan streak belajar dan mendapatkan bonus skor poin.
              </p>
            </CardContent>
          </Card>

          {/* Upcoming Webinars */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-800">
                Webinar & Event Terdekat
              </CardTitle>
              <CardDescription className="text-[11px] font-semibold">
                Dapatkan ilmu langsung dari para pakar tani dan industri hortikultura.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3.5">
              {MOCK_WEBINARS.map((web) => (
                <div
                  key={web.id}
                  className="p-3 border border-slate-100 rounded-xl hover:border-slate-200 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-md bg-slate-50 px-1.5 py-0.5 text-[8.5px] font-bold text-slate-700 border border-slate-200">
                      {web.status}
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 flex items-center gap-0.5">
                      <Calendar className="h-3 w-3" /> {web.date}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-800 leading-snug">{web.title}</h4>
                  <p className="text-[9.5px] font-semibold text-slate-500 leading-tight">
                    Narasumber: {web.speaker}
                  </p>
                  <p className="text-[9px] font-bold text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100/60 flex items-center gap-1">
                    <Tv className="h-3.5 w-3.5 text-slate-500" /> {web.time}
                  </p>
                </div>
              ))}
              <Link href="/dashboard/siswa/webinars" className="block text-center mt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-bold text-slate-600 hover:text-slate-800 border-slate-200 hover:bg-slate-50 rounded-xl cursor-pointer"
                >
                  Lihat Semua Event
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
