'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { instructorService, InstructorAnalytics } from '@/services/instructor';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
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
  const [isOffline, setIsOffline] = React.useState(false);

  const { data: analytics, isLoading } = useQuery<InstructorAnalytics>({
    queryKey: ['instructor-overview-analytics', user?.id],
    queryFn: async () => {
      try {
        if (!user?.id) throw new Error('Unauthenticated');
        return await instructorService.getInstructorAnalytics(user.id);
      } catch {
        setIsOffline(true);
        return MOCK_ANALYTICS;
      }
    },
  });

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

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Academy Service backend sedang tidak terhubung. Anda sedang menjelajahi dashboard
              dalam modus simulasi dengan data luring di memori browser.
            </p>
          </div>
        </div>
      )}

      {/* KPI Stats Panel */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Total Courses */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{activeStats.total_courses}</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Total Kelas
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 2: Total Students */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <div className="text-2xl font-bold text-slate-800">
                  {activeStats.total_students}
                </div>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-0.5" />+{activeStats.students_this_month}
                </span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Total Peserta
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 3: Average Rating */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <Star className="h-5 w-5 text-amber-500 fill-amber-500" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">{activeStats.avg_rating}</div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Rating Rata-rata
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Metric 4: Published Courses */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
          <CardContent className="pt-6 flex items-center gap-3.5">
            <div className="h-10 w-10 shrink-0 rounded-xl bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-800">
                {activeStats.published_courses}
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                Kelas Terpublikasi
              </p>
            </div>
          </CardContent>
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
                <CardTitle className="text-sm font-bold text-slate-800">Kelas Terpopuler</CardTitle>
                <CardDescription className="text-[11px] font-semibold mt-0.5">
                  Daftar kelas dengan peserta dan kepuasan belajar tertinggi.
                </CardDescription>
              </div>
              <Link href="/dashboard/instruktur/courses" passHref legacyBehavior>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-bold text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl gap-1"
                >
                  Kelola Kelas
                  <ArrowRight className="h-3.5 w-3.5" />
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
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs font-bold text-green-600 hover:text-green-700 hover:bg-green-50 rounded-xl gap-1"
                >
                  Semua Murid
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0 border-t border-slate-100 divide-y divide-slate-100">
              {activeStats.recent_enrollments.map((enrollment, idx) => {
                const enrollDate = new Date(enrollment.enrolled_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div
                    key={idx}
                    className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-full bg-green-50 border border-green-100 flex items-center justify-center text-green-600 font-bold text-xs shrink-0">
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
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm gap-1.5 py-4">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Lihat Seluruh Analisis Ulasan
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
