'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academyService, Course, Enrollment, Module } from '@/services/academy';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { formatCurrency } from '@/lib/utils';
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
import {
  ChevronLeft,
  Clock,
  Star,
  GraduationCap,
  Play,
  CheckCircle2,
  Tv,
  Users,
  Award,
  Video,
  FileText,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

const MOCK_COURSE_DETAIL = {
  id: 'course-001',
  title: 'Budidaya Hidroponik Modern untuk Pemula',
  description:
    'Budidaya Hidroponik Modern adalah kursus terintegrasi untuk mengajarkan teknologi hidroponik secara mendalam. Anda akan belajar cara membangun instalasi NFT, menguji derajat pH nutrisi AB Mix, membasmi jamur tanaman secara hayati, serta kalkulasi rasio ekonomi komoditas hidroponik sayur di pasar retail modern.',
  short_description: 'Pelajari dasar-dasar berkebun bersih dengan air.',
  category: 'Budidaya',
  difficulty: 'pemula' as const,
  mode: 'online' as const,
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
  modules: [
    {
      id: 'mod-1',
      course_id: 'course-001',
      title: 'Pengenalan Hidroponik & Jenis Tanaman',
      description: 'Mengenal sejarah hidroponik and jenis sayur daun bernilai tinggi.',
      order: 1,
      type: 'video' as const,
      content_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration_minutes: 15,
    },
    {
      id: 'mod-2',
      course_id: 'course-001',
      title: 'Pembangunan Instalasi NFT & Drip System',
      description: 'Panduan teknis merakit pipa PVC dan bak tandon air bernutrisi.',
      order: 2,
      type: 'video' as const,
      content_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration_minutes: 25,
    },
    {
      id: 'mod-3',
      course_id: 'course-001',
      title: 'Formulasi AB Mix & Manajemen pH Nutrisi',
      description: 'Mengukur EC tanah, derajat asam/basa (pH), serta kecukupan nutrisi mineral.',
      order: 3,
      type: 'article' as const,
      content_text: 'AB Mix merupakan pupuk hidroponik yang paling umum digunakan...',
      duration_minutes: 20,
    },
    {
      id: 'mod-4',
      course_id: 'course-001',
      title: 'Ujian Akhir: Pemahaman Hidroponik Dasar',
      description: 'Kuis multiple-choice untuk mengevaluasi pemahaman berkebun hidroponik Anda.',
      order: 4,
      type: 'quiz' as const,
      duration_minutes: 15,
      quiz_questions: [
        {
          id: 'q-1',
          question: 'Apa singkatan dari sistem pengairan NFT?',
          options: ['Nutrient Film Technique', 'Nutrient Flow Technology', 'Nutrient Feed Tracker'],
          correct_index: 0,
        },
        {
          id: 'q-2',
          question: 'Berapakah derajat pH ideal untuk sayuran daun hidroponik?',
          options: ['4.5 - 5.0', '5.5 - 6.5', '7.0 - 8.0'],
          correct_index: 1,
        },
      ],
    },
  ],
};

const MOCK_REVIEWS = {
  reviews: [
    {
      id: 'rev-1',
      course_id: 'course-001',
      student_id: 'siswa-2',
      student_name: 'Dian Permana',
      rating: 5,
      comment:
        'Sangat praktis! Pipa instalasi langsung saya rakit di pekarangan rumah dan sekarang selada sudah mulai berkecambah dengan baik.',
      created_at: '2026-05-20T08:00:00Z',
    },
    {
      id: 'rev-2',
      course_id: 'course-001',
      student_id: 'siswa-3',
      student_name: 'Eko Sulistyo',
      rating: 4,
      comment:
        'Penjelasan dosen sangat detail terutama cara meracik konsentrat AB Mix agar pertumbuhan daun lebat. Terima kasih SiTani!',
      created_at: '2026-05-18T10:00:00Z',
    },
  ],
};

export default function StudentCourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const courseId = resolvedParams.id || 'course-001';
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = getStoredAuthUser();
  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch course detail
  const { data: course, isLoading } = useQuery({
    queryKey: ['student-course-detail', courseId],
    queryFn: async () => {
      try {
        return await academyService.getCourseById(courseId);
      } catch {
        setIsOffline(true);
        return MOCK_COURSE_DETAIL as unknown as Course & { modules: Module[] };
      }
    },
  });

  // Fetch my enrollments to check status
  const { data: myEnrollments } = useQuery({
    queryKey: ['student-enrollments-all', user?.id],
    queryFn: async () => {
      try {
        return await academyService.getMyEnrollments();
      } catch {
        return [] as Enrollment[];
      }
    },
  });

  const activeCourse = course || (MOCK_COURSE_DETAIL as unknown as Course & { modules: Module[] });
  const currentEnrollment = myEnrollments?.find((e) => e.course_id === activeCourse.id);
  const isEnrolled = !!currentEnrollment;
  const isCompleted = currentEnrollment?.status === 'completed';

  // Enroll mutation
  const enrollMutation = useMutation({
    mutationFn: async () => {
      try {
        await academyService.enrollCourse(courseId);
        toast.success('Pendaftaran kelas berhasil!', {
          description: 'Mengarahkan ke Ruang Belajar...',
        });
        router.push(`/dashboard/siswa/courses/${courseId}/learn`);
      } catch {
        // Local simulation fallback
        queryClient.setQueryData(['student-enrollments-all', user?.id], (old: unknown) => {
          const current = (old as Enrollment[]) || [];
          const newEnroll: Enrollment = {
            id: `enroll-${Date.now()}`,
            student_id: user?.id || 'siswa-1',
            course_id: activeCourse.id,
            status: 'active',
            enrolled_at: new Date().toISOString(),
            progress_percent: 0,
            course: activeCourse as unknown as Course,
          };
          return [...current, newEnroll];
        });
        toast.success('[Simulasi] Berhasil daftar kelas!', {
          description: 'Membuka modul Ruang Belajar di memori browser.',
        });
        router.push(`/dashboard/siswa/courses/${courseId}/learn`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-enrollments-all'] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-96 md:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  const typeIcons: Record<string, React.ReactNode> = {
    video: <Video className="h-4 w-4 text-green-600" />,
    article: <FileText className="h-4 w-4 text-green-600" />,
    quiz: <HelpCircle className="h-4 w-4 text-amber-500" />,
  };

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard/siswa/courses"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali ke Katalog Kursus
        </Link>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Academy Service backend sedang tidak terhubung. Anda sedang memuat rincian materi
              statis dari memori luring SmartTani.
            </p>
          </div>
        </div>
      )}

      {/* Main Layout Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Column (Hero, Modules, Reviews) */}
        <div className="md:col-span-2 space-y-6">
          {/* Main Course Info Card */}
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-md bg-green-50 px-2.5 py-0.5 text-[10px] font-bold text-green-700 border border-green-100">
                  {activeCourse.category}
                </span>
                <span className="inline-flex items-center rounded-md bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                  {activeCourse.mode}
                </span>
                <span className="inline-flex items-center rounded-md bg-slate-50 border border-slate-200/65 px-2 py-0.5 text-[9.5px] font-bold text-slate-500 uppercase tracking-wide">
                  {activeCourse.difficulty}
                </span>
              </div>
              <CardTitle className="text-xl font-black text-slate-800 leading-snug">
                {activeCourse.title}
              </CardTitle>
              <CardDescription className="text-xs font-semibold text-slate-500 leading-relaxed">
                {activeCourse.short_description}
              </CardDescription>

              {/* Course Meta */}
              <div className="grid grid-cols-3 gap-3 bg-slate-50/50 border border-slate-100 rounded-xl p-3.5 text-center text-xs font-bold text-slate-500">
                <div className="space-y-0.5 flex flex-col items-center">
                  <div className="flex items-center gap-0.5 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{Number(activeCourse.average_rating).toFixed(1)}</span>
                  </div>
                  <span className="text-[9.5px] font-semibold text-slate-400">
                    Rating ({activeCourse.review_count})
                  </span>
                </div>
                <div className="space-y-0.5 border-x border-slate-200 flex flex-col items-center justify-center">
                  <span className="text-slate-800 flex items-center gap-1">
                    <Clock className="h-4 w-4 text-green-600" /> {activeCourse.duration_hours} Jam
                  </span>
                  <span className="text-[9.5px] font-semibold text-slate-400">Total Durasi</span>
                </div>
                <div className="space-y-0.5 flex flex-col items-center justify-center">
                  <span className="text-slate-800 flex items-center gap-1">
                    <Users className="h-4 w-4 text-green-600" /> {activeCourse.enrolled_count}
                  </span>
                  <span className="text-[9.5px] font-semibold text-slate-400">Peserta Aktif</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                Deskripsi Pembelajaran
              </h3>
              <p className="text-xs font-semibold text-slate-600 leading-relaxed whitespace-pre-wrap">
                {activeCourse.description}
              </p>
            </CardContent>
          </Card>

          {/* Syllabus Modules Accordion */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-800">
                Silabus & Modul Pembelajaran
              </CardTitle>
              <CardDescription className="text-[11px] font-semibold mt-0.5">
                Total terdapat {activeCourse.modules?.length || 0} bab kurikulum materi yang
                diujikan.
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100">
              {activeCourse.modules?.map((mod: any, idx: number) => (
                <div key={mod.id} className="py-3 flex items-start justify-between gap-4 group">
                  <div className="flex gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-50 border border-green-100 text-[11px] font-bold text-green-600 mt-0.5 group-hover:bg-green-600 group-hover:text-white transition-all">
                      {idx + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-green-600 transition-colors">
                        {mod.title}
                      </h4>
                      <p className="text-[10px] font-semibold text-slate-500 leading-relaxed mt-0.5">
                        {mod.description}
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-2 text-[10px] text-slate-500 font-bold bg-slate-50 border border-slate-100/50 px-2 py-1 rounded-lg">
                    {typeIcons[mod.type] || <FileText className="h-4 w-4" />}
                    <span className="capitalize">{mod.type}</span>
                    {mod.duration_minutes && <span>({mod.duration_minutes}m)</span>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Instructor Bio */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-sm font-bold text-slate-800">
                Pengajar & Instruktur
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-50 text-sm font-bold text-green-600 border border-green-100">
                {activeCourse.instructor_name.charAt(0)}
              </div>
              <div className="space-y-1 flex-1">
                <h4 className="text-xs font-black text-slate-800">
                  {activeCourse.instructor_name}
                </h4>
                <p className="text-[10.5px] font-bold text-green-600">
                  {activeCourse.instructor_title}
                </p>
                <p className="text-[11px] font-semibold text-slate-500 leading-relaxed mt-1">
                  Praktisi ahli yang berkomitmen membagikan pengalamannya langsung dari lapangan
                  tani dan sains agroteknologi terpadu.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sticky Sidebar (Enroll action, security seals) */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm bg-white sticky top-6 overflow-hidden">
            <div className="h-2 bg-green-600 w-full" />
            <CardHeader className="pb-3 text-center">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Harga Pendaftaran
              </span>
              <span className="text-xl font-black text-slate-800 mt-1 block">
                {activeCourse.is_free
                  ? 'GRATIS'
                  : `Rp ${activeCourse.price.toLocaleString('id-ID')}`}
              </span>
            </CardHeader>
            <CardContent className="space-y-4">
              {isCompleted ? (
                <div className="space-y-2">
                  <div className="bg-blue-50 border border-blue-200 text-blue-800 p-3 rounded-xl text-center text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm">
                    <Award className="h-4.5 w-4.5 text-blue-600" /> Anda Telah Lulus Kelas Ini!
                  </div>
                  <Link href="/dashboard/siswa/certificates" className="block">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-10 rounded-xl shadow-sm cursor-pointer">
                      Lihat Sertifikat Kelulusan
                    </Button>
                  </Link>
                  <Link
                    href={`/dashboard/siswa/courses/${activeCourse.id}/learn`}
                    className="block"
                  >
                    <Button
                      variant="outline"
                      className="w-full border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs h-10 rounded-xl cursor-pointer"
                    >
                      Review Modul Materi
                    </Button>
                  </Link>
                </div>
              ) : isEnrolled ? (
                <div className="space-y-2">
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-xl text-center text-xs font-bold flex flex-col items-center justify-center gap-1 shadow-sm">
                    <span>Sudah Enrolled</span>
                    <span className="text-[10.5px] text-amber-600">
                      Kemajuan: {currentEnrollment?.progress_percent}%
                    </span>
                  </div>
                  <Link
                    href={`/dashboard/siswa/courses/${activeCourse.id}/learn`}
                    className="block"
                  >
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-10 rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer">
                      <Play className="h-3.5 w-3.5 fill-current" /> Lanjut Belajar Modul
                    </Button>
                  </Link>
                </div>
              ) : (
                <Button
                  onClick={() => enrollMutation.mutate()}
                  disabled={enrollMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-10 rounded-xl shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <GraduationCap className="h-4.5 w-4.5" />{' '}
                  {enrollMutation.isPending ? 'Mendaftar...' : 'Enroll Kelas Sekarang'}
                </Button>
              )}

              <p className="text-[10px] font-semibold text-slate-400 text-center leading-relaxed">
                * Kelas dapat diakses penuh seumur hidup (lifetime access) termasuk pembaruan modul
                materi di masa mendatang.
              </p>
            </CardContent>

            <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4">
              <div className="flex items-start gap-2.5 text-[10px] text-slate-500 font-semibold leading-relaxed">
                <ShieldCheck className="h-4.5 w-4.5 text-green-600 shrink-0 mt-0.5" />
                <span>
                  Jaminan SiTani Academy: Kurikulum bersertifikat kelulusan emas dan diakui oleh
                  mitra industri pertanian.
                </span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
