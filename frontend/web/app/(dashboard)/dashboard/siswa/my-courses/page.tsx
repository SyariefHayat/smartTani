'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { academyService, Enrollment } from '@/services/academy';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  GraduationCap,
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  Award,
  AlertTriangle,
  ArrowRight,
  User,
  RefreshCw,
} from 'lucide-react';

const MOCK_ENROLLMENTS: Enrollment[] = [
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
  {
    id: 'enroll-3',
    student_id: 'siswa-1',
    course_id: 'course-004',
    status: 'completed',
    enrolled_at: '2026-05-10T09:00:00Z',
    completed_at: '2026-05-14T16:00:00Z',
    progress_percent: 100,
    course: {
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
  },
];

export default function StudentMyCoursesPage() {
  const user = getStoredAuthUser();
  const [activeTab, setActiveTab] = React.useState('all');

  // Fetch my enrollments
  const {
    data: enrollments,
    isLoading,
    isError: isEnrollmentsError,
    refetch: refetchEnrollments,
  } = useQuery({
    queryKey: ['student-enrollments-all', user?.id],
    queryFn: () => academyService.getMyEnrollments(),
  });

  React.useEffect(() => {
    if (isEnrollmentsError) {
      toast.error('Koneksi ke Layanan Academy terputus.');
    }
  }, [isEnrollmentsError]);

  const activeEnrollments = enrollments || [];

  const filteredEnrollments = activeEnrollments.filter((e) => {
    if (activeTab === 'all') return true;
    return e.status === activeTab;
  });

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-slate-700" /> Kelas & Kursus Saya
        </h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Pantau status pendaftaran kelas Anda, lanjutkan pembelajaran bab silabus, dan akses
          sertifikat kelulusan emas Anda.
        </p>
      </div>

      {/* Tabs list */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="bg-slate-100/80 p-1 border border-slate-200/40 rounded-xl w-full sm:w-fit grid grid-cols-3 sm:inline-flex">
          <TabsTrigger value="all" className="text-xs rounded-lg font-bold py-1.5 cursor-pointer">
            Semua Kelas
          </TabsTrigger>
          <TabsTrigger
            value="active"
            className="text-xs rounded-lg font-bold py-1.5 cursor-pointer"
          >
            Sedang Belajar
          </TabsTrigger>
          <TabsTrigger
            value="completed"
            className="text-xs rounded-lg font-bold py-1.5 cursor-pointer"
          >
            Selesai
          </TabsTrigger>
        </TabsList>

        {isEnrollmentsError ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-red-200 bg-red-50 p-8 text-center text-red-500 font-semibold text-sm">
            <AlertTriangle className="h-8 w-8 text-red-600 mb-2 animate-pulse" />
            <p className="font-bold">Gagal memuat daftar kelas saya</p>
            <p className="text-xs text-red-400 font-normal mt-1 mb-4">
              Koneksi ke server Layanan Academy terputus. Silakan coba hubungkan kembali.
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-red-300 text-red-800 bg-white hover:bg-red-100 font-bold text-xs"
              onClick={() => refetchEnrollments()}
            >
              <RefreshCw className="h-3 w-3 mr-1" /> Coba Hubungkan Kembali
            </Button>
          </div>
        ) : isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2">
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        ) : filteredEnrollments.length === 0 ? (
          <div className="text-center py-16 bg-white border border-slate-200/65 rounded-xl shadow-sm space-y-3">
            <GraduationCap className="mx-auto h-16 w-16 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-800">Belum ada kelas terdaftar</h3>
            <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
              {activeTab === 'all'
                ? 'Pilih kelas di katalog SiTani Academy untuk memulai belajar.'
                : activeTab === 'active'
                  ? 'Belum ada kelas yang sedang Anda pelajari saat ini.'
                  : 'Belum ada kelas yang diselesaikan. Ayo selesaikan ujian modul Anda!'}
            </p>
            {activeTab !== 'completed' && (
              <Link href="/dashboard/siswa/courses" className="inline-block mt-2">
                <Button
                  size="sm"
                  className="bg-slate-800 hover:bg-slate-900 text-xs font-bold text-white shadow-sm cursor-pointer"
                >
                  Jelajahi Kursus
                </Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {filteredEnrollments.map((enroll) => (
              <Card
                key={enroll.id}
                className="border-slate-200 hover:border-slate-355 hover:shadow-md transition-all duration-300 bg-white overflow-hidden flex flex-col justify-between group"
              >
                <CardContent className="pt-5 space-y-4">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-slate-700 border border-slate-200">
                      {enroll.course?.category}
                    </span>
                    {enroll.status === 'completed' ? (
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 border border-blue-100 gap-0.5">
                        <Award className="h-3 w-3" /> Lulus
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-100 gap-0.5">
                        <Play className="h-3 w-3 fill-current" /> Belajar
                      </span>
                    )}
                  </div>

                  {/* Title & Instructor */}
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-slate-750 transition-colors line-clamp-2">
                      {enroll.course?.title}
                    </h3>
                    <p className="text-[10px] font-semibold text-slate-500">
                      Tutor: {enroll.course?.instructor_name} ({enroll.course?.instructor_title})
                    </p>
                  </div>

                  {/* Progress info */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500">
                      <span>Kemajuan Silabus</span>
                      <span className="text-slate-850 font-bold">{enroll.progress_percent}%</span>
                    </div>
                    <Progress value={enroll.progress_percent} className="h-1.5 bg-slate-100" />
                  </div>
                </CardContent>

                {/* Card CTA Actions */}
                <div className="px-5 py-3 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> Terdaftar:{' '}
                    {new Date(enroll.enrolled_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  {enroll.status === 'completed' ? (
                    <Link href="/dashboard/siswa/certificates">
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 px-3 gap-1 rounded-xl shadow-sm cursor-pointer w-full sm:w-auto">
                        <Award className="h-3.5 w-3.5" /> Unduh Sertifikat
                      </Button>
                    </Link>
                  ) : (
                    <Link href={`/dashboard/siswa/courses/${enroll.course_id}/learn`}>
                      <Button className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs h-9 px-3 gap-1 rounded-xl shadow-sm cursor-pointer w-full sm:w-auto">
                        <Play className="h-3 w-3 fill-current" /> Lanjut Belajar{' '}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Tabs>
    </div>
  );
}
