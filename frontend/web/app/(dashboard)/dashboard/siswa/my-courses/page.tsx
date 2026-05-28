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
  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch my enrollments
  const { data: enrollments, isLoading } = useQuery({
    queryKey: ['student-enrollments-all', user?.id],
    queryFn: async () => {
      try {
        return await academyService.getMyEnrollments();
      } catch {
        setIsOffline(true);
        // Fallback to local storage progress cache or mocks
        const key1 = `progress-course-001-${user?.id}`;
        const key2 = `progress-course-002-${user?.id}`;
        const storage1 = localStorage.getItem(key1);
        const storage2 = localStorage.getItem(key2);

        const list = [...MOCK_ENROLLMENTS];
        if (storage1) {
          const parsed = JSON.parse(storage1);
          list[0] = parsed.enrollment;
        }
        if (storage2) {
          const parsed = JSON.parse(storage2);
          list[1] = parsed.enrollment;
        }
        return list;
      }
    },
  });

  const activeEnrollments = enrollments || MOCK_ENROLLMENTS;

  const filteredEnrollments = activeEnrollments.filter((e) => {
    if (activeTab === 'all') return true;
    return e.status === activeTab;
  });

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
          <BookOpen className="h-7 w-7 text-green-600" /> Kelas & Kursus Saya
        </h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Pantau status pendaftaran kelas Anda, lanjutkan pembelajaran bab silabus, dan akses
          sertifikat kelulusan emas Anda.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Academy Service luring. Menampilkan rekapitulasi kelas terdaftar dari memori luring
              browser Anda.
            </p>
          </div>
        </div>
      )}

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

        {isLoading ? (
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
                  className="bg-green-600 hover:bg-green-700 text-xs font-bold text-white shadow-sm cursor-pointer"
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
                className="border-slate-200 hover:border-green-300 hover:shadow-md transition-all duration-300 bg-white overflow-hidden flex flex-col justify-between group"
              >
                <CardContent className="pt-5 space-y-4">
                  {/* Category & Badge */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-[9px] font-bold text-green-700 border border-green-100">
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
                    <h3 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-green-600 transition-colors line-clamp-2">
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
                      <span className="text-green-600">{enroll.progress_percent}%</span>
                    </div>
                    <Progress
                      value={enroll.progress_percent}
                      className="h-1.5 bg-slate-100 text-green-600"
                    />
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
                      <Button className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-9 px-3 gap-1 rounded-xl shadow-sm cursor-pointer w-full sm:w-auto">
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
