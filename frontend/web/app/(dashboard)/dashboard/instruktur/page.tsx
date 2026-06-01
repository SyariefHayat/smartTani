'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { instructorService, InstructorAnalytics } from '@/services/instructor';
import { getStoredAuthUser } from '@/lib/auth-storage';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  GraduationCap,
  Users,
  Star,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  FileCheck,
  Calendar,
  MessageSquare,
  TrendingUp,
  ArrowUp,
  RefreshCw,
} from 'lucide-react';

const MOCK_ANALYTICS: InstructorAnalytics = {
  total_courses: 4,
  published_courses: 3,
  total_students: 1845,
  avg_rating: 4.8,
  total_reviews: 124,
  completion_rate: 74.2,
  students_this_month: 245,
  students_change_percent: 12.8,
  top_courses: [
    {
      id: 'course-001',
      title: 'Budidaya Hidroponik Modern untuk Pemula',
      enrolled_count: 1450,
      rating: 4.8,
    },
    {
      id: 'course-004',
      title: 'Pencegahan Hama Organik Terpadu',
      enrolled_count: 310,
      rating: 4.6,
    },
  ],
  recent_enrollments: [
    {
      student_id: 'siswa-1',
      student_name: 'Farhan Setiawan',
      course_title: 'Budidaya Hidroponik Modern untuk Pemula',
      enrolled_at: '2026-05-28T09:00:00Z',
    },
    {
      student_id: 'siswa-2',
      student_name: 'Dewi Lestari',
      course_title: 'Budidaya Hidroponik Modern untuk Pemula',
      enrolled_at: '2026-05-27T14:30:00Z',
    },
    {
      student_id: 'siswa-3',
      student_name: 'Ahmad Ghozali',
      course_title: 'Pencegahan Hama Organik Terpadu',
      enrolled_at: '2026-05-27T11:00:00Z',
    },
    {
      student_id: 'siswa-4',
      student_name: 'Siti Aminah',
      course_title: 'Budidaya Hidroponik Modern untuk Pemula',
      enrolled_at: '2026-05-26T08:15:00Z',
    },
  ],
  recent_reviews: [
    {
      student_name: 'Dian Permana',
      course_title: 'Budidaya Hidroponik Modern untuk Pemula',
      rating: 5,
      comment: 'Sangat praktis! Pipa instalasi langsung saya rakit di pekarangan rumah.',
    },
    {
      student_name: 'Eko Sulistyo',
      course_title: 'Budidaya Hidroponik Modern untuk Pemula',
      rating: 4,
      comment: 'Penjelasan sangat detail terutama cara meracik konsentrat AB Mix.',
    },
    {
      student_name: 'Budi Raharjo',
      course_title: 'Pencegahan Hama Organik Terpadu',
      rating: 5,
      comment: 'Pestisida nabati yang diajarkan sangat ampuh mengatasi kutu daun!',
    },
  ],
};

export default function InstructorDashboardOverview() {
  const user = getStoredAuthUser();
  const {
    data: analytics,
    isLoading,
    isError: isAnalyticsError,
    refetch: refetchAnalytics,
  } = useQuery<InstructorAnalytics>({
    queryKey: ['instructor-overview-analytics', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('Unauthenticated');
      return await instructorService.getInstructorAnalytics(user.id);
    },
  });

  React.useEffect(() => {
    if (isAnalyticsError) {
      toast.error('Koneksi ke Layanan Academy terputus.');
    }
  }, [isAnalyticsError]);

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

  const activeStats = analytics || MOCK_ANALYTICS;

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Welcome Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Selamat Datang, Pengajar {user?.name || 'Instruktur'}! 👋
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Kelola kurikulum edukasi, evaluasi peserta, and pantau perkembangan akademi SmartTani.
        </p>
      </div>

      {isAnalyticsError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50 py-16 px-6">
          <AlertTriangle className="h-8 w-8 text-red-400 mb-3 animate-pulse" />
          <p className="text-sm font-bold text-red-500 mb-1">Gagal Memuat Data Statistik</p>
          <p className="text-xs text-red-400 mb-4">
            Koneksi ke server Academy terputus. Silakan coba lagi.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-700 bg-white hover:bg-red-100 font-bold text-xs rounded-xl gap-1.5 cursor-pointer"
            onClick={() => refetchAnalytics()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Coba Hubungkan Kembali
          </Button>
        </div>
      ) : (
        <>
          {/* KPI Stats Panel */}
          <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
            {/* Metric 1: Total Courses */}
            <Card className="min-w-0">
              <CardHeader className="gap-1">
                <CardDescription className="truncate text-xs">Total Kelas</CardDescription>
                <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
                  {activeStats.total_courses}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                  <BookOpen className="size-4 shrink-0 text-slate-400" />
                  <span className="truncate text-muted-foreground">Kelas dalam kurikulum</span>
                </div>
              </CardFooter>
            </Card>

            {/* Metric 2: Total Students */}
            <Card className="min-w-0">
              <CardHeader className="gap-1">
                <CardDescription className="truncate text-xs">Total Peserta</CardDescription>
                <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
                  {activeStats.total_students}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                  <span className="text-xs text-green-600 flex items-center font-bold">
                    <ArrowUp className="h-3.5 w-3.5 mr-0.5" />+{activeStats.students_change_percent}
                    %
                  </span>
                  <span className="truncate text-muted-foreground">
                    +{activeStats.students_this_month} bulan ini
                  </span>
                </div>
              </CardFooter>
            </Card>

            {/* Metric 3: Average Rating */}
            <Card className="min-w-0">
              <CardHeader className="gap-1">
                <CardDescription className="truncate text-xs">Rating Rata-rata</CardDescription>
                <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
                  {activeStats.avg_rating}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                  <Star className="size-4 shrink-0 text-amber-500 fill-amber-500" />
                  <span className="truncate text-muted-foreground">
                    Dari {activeStats.total_reviews} ulasan murid
                  </span>
                </div>
              </CardFooter>
            </Card>

            {/* Metric 4: Published Courses */}
            <Card className="min-w-0">
              <CardHeader className="gap-1">
                <CardDescription className="truncate text-xs">Kelas Terpublikasi</CardDescription>
                <CardTitle className="truncate text-xl font-semibold tabular-nums lg:text-2xl">
                  {activeStats.published_courses}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="flex w-full min-w-0 items-center gap-1 font-medium">
                  <FileCheck className="size-4 shrink-0 text-slate-400" />
                  <span className="truncate text-xs text-muted-foreground">
                    Siap diakses secara online
                  </span>
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Left 2 Columns: Top Courses & Recent Enrollments */}
            <div className="md:col-span-2 space-y-6">
              {/* Top Courses */}
              <Card className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-800">
                      Kelas Terpopuler
                    </CardTitle>
                    <CardDescription className="text-[11px] font-semibold mt-0.5">
                      Daftar kelas dengan peserta dan kepuasan belajar tertinggi.
                    </CardDescription>
                  </div>
                  <Link href="/dashboard/instruktur/courses" passHref legacyBehavior>
                    <Button variant="ghost" size="sm">
                      Kelola Kelas
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0 border-t border-slate-100 divide-y divide-slate-100">
                  {activeStats.top_courses.map((course) => (
                    <div
                      key={course.id}
                      className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-800">{course.title}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">
                          ID: {course.id}
                        </p>
                      </div>
                      <div className="flex items-center gap-6 text-right text-xs font-bold text-slate-700">
                        <div>
                          <div>{course.enrolled_count} Murid</div>
                          <p className="text-[9px] text-slate-400 font-semibold uppercase mt-0.5">
                            Terdaftar
                          </p>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 text-amber-700 px-2 py-0.5 rounded-lg text-[10px]">
                          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                          {course.rating}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Recent Enrollments */}
              <Card className="border-slate-200 shadow-sm bg-white">
                <CardHeader className="pb-3 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-sm font-bold text-slate-800">
                      Pendaftaran Peserta Terkini
                    </CardTitle>
                    <CardDescription className="text-[11px] font-semibold mt-0.5">
                      Murid-murid baru yang baru saja masuk ke kelas Anda.
                    </CardDescription>
                  </div>
                  <Link href="/dashboard/instruktur/students" passHref legacyBehavior>
                    <Button variant="ghost" size="sm">
                      Semua Murid
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardHeader>
                <CardContent className="p-0 border-t border-slate-100 divide-y divide-slate-100">
                  {activeStats.recent_enrollments.map((enrollment, idx) => {
                    const enrollDate = new Date(enrollment.enrolled_at).toLocaleDateString(
                      'id-ID',
                      {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      }
                    );

                    return (
                      <div
                        key={idx}
                        className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-xs shrink-0">
                            {enrollment.student_name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-800">
                              {enrollment.student_name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                              Mendaftar pada:{' '}
                              <span className="text-slate-600 italic font-bold">
                                {enrollment.course_title}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase">
                          <Calendar className="h-3.5 w-3.5 text-slate-300" />
                          {enrollDate}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Right 1 Column: Recent Reviews */}
            <div className="space-y-6">
              <Card className="border-slate-200 shadow-sm bg-white h-full flex flex-col justify-between">
                <div>
                  <CardHeader className="pb-3 border-b border-slate-100">
                    <CardTitle className="text-sm font-bold text-slate-800">
                      Ulasan Murid Terkini
                    </CardTitle>
                    <CardDescription className="text-[11px] font-semibold mt-0.5">
                      Komentar dan tingkat kepuasan yang diisi oleh siswa.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    {activeStats.recent_reviews.map((review, idx) => (
                      <div
                        key={idx}
                        className="space-y-2 bg-slate-50/60 border border-slate-100/50 rounded-xl p-3.5"
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-slate-800 text-[11px]">
                            {review.student_name}
                          </div>
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`h-3 w-3 ${
                                  s <= review.rating
                                    ? 'text-amber-500 fill-amber-500'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                          Kelas: {review.course_title}
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500 leading-relaxed italic">
                          &quot;{review.comment}&quot;
                        </p>
                      </div>
                    ))}
                  </CardContent>
                </div>
                <div className="p-4 border-t border-slate-100/60 bg-slate-50/20">
                  <Link href="/dashboard/instruktur/analytics" passHref legacyBehavior>
                    <Button className="w-full">
                      <MessageSquare className="h-4 w-4" />
                      Lihat Seluruh Analisis Ulasan
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
