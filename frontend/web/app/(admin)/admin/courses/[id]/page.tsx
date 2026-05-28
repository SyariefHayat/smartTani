'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academyService, Course } from '@/services/academy';
import { instructorService } from '@/services/instructor';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  ChevronLeft,
  GraduationCap,
  Calendar,
  User,
  Star,
  CheckCircle,
  Archive,
  BookOpen,
  Users,
  AlertTriangle,
  Play,
  FileText,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AdminCourseDetailPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const queryClient = useQueryClient();

  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch Course details Query
  const { data: course, isLoading } = useQuery<any>({
    queryKey: ['admin-course-detail', id],
    queryFn: async () => {
      try {
        const res = await academyService.getCourseById(id);
        return res;
      } catch {
        setIsOffline(true);
        // Fallback from localStorage
        const stored = JSON.parse(localStorage.getItem('admin-courses') || '[]');
        const found = stored.find((c: any) => c.id === id);

        if (!found) throw new Error('Course not found');

        // Enrich with mock modules if missing
        if (!found.modules || found.modules.length === 0) {
          found.modules = [
            {
              id: 'mod-1',
              title: 'Bab 1: Sejarah Pertanian Hidroponik',
              order: 1,
              type: 'video',
              duration_minutes: 15,
            },
            {
              id: 'mod-2',
              title: 'Bab 2: Formulasi Larutan AB Mix',
              order: 2,
              type: 'article',
              duration_minutes: 20,
            },
            {
              id: 'mod-3',
              title: 'Kuis Evaluasi Nutrisi Tanaman',
              order: 3,
              type: 'quiz',
              duration_minutes: 10,
            },
          ];
        }

        return found;
      }
    },
  });

  // Moderate publish status mutation
  const moderateMutation = useMutation({
    mutationFn: async (isPublished: boolean) => {
      try {
        await instructorService.publishCourse(id, isPublished);
      } catch {
        // Offline persistent
        const stored: Course[] = JSON.parse(localStorage.getItem('admin-courses') || '[]');
        const updated = stored.map((c) => (c.id === id ? { ...c, is_published: isPublished } : c));
        localStorage.setItem('admin-courses', JSON.stringify(updated));
      }
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Kelas ini berhasil di-${variables ? 'publikasikan secara nasional' : 'unpublish dari publik'}!`
      );
      queryClient.invalidateQueries({ queryKey: ['admin-course-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-courses-list'] });
    },
  });

  const getStatusBadge = (published: boolean) => {
    return published ? (
      <Badge className="bg-green-100 text-green-700 border-green-200">Published</Badge>
    ) : (
      <Badge className="bg-slate-100 text-slate-500 border-slate-200">Draft</Badge>
    );
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Play className="h-4 w-4 text-green-600" />;
      case 'article':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'quiz':
        return <HelpCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <BookOpen className="h-4 w-4 text-slate-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-80 md:col-span-2 rounded-2xl" />
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="w-full text-center py-20">
        <h3 className="text-sm font-bold text-slate-700">Kelas Tidak Ditemukan</h3>
        <Link href="/admin/courses">
          <Button size="sm" className="mt-4 bg-green-600 text-white rounded-xl">
            Kembali ke Daftar
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Back button */}
      <div>
        <Link
          href="/admin/courses"
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali ke Daftar Kursus
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
          Detail Kursus: {course.title} {getStatusBadge(course.is_published)}
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Tinjau silabus belajar lengkap yang disusun oleh instruktur, pantau total siswa terdaftar,
          and sesuaikan status kelayakan publik kelas.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Academy Service sedang tidak terhubung. Seluruh moderasi materi kursus disimpan secara
              luring.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Columns: Course specs and syllabus */}
        <div className="md:col-span-2 space-y-6">
          {/* Main info */}
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">
                Rincian Kurikulum & Tarif
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5 text-xs font-semibold text-slate-700">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block">Tarif Pendaftaran Kelas</span>
                  <h3 className="text-lg font-bold text-green-700">
                    {course.is_free
                      ? 'GRATIS / FREE'
                      : `Rp ${course.price.toLocaleString('id-ID')}`}
                  </h3>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block">Durasi Pembelajaran</span>
                  <span className="text-slate-800 flex items-center gap-1">
                    <BookOpen className="h-4 w-4 text-slate-400" />
                    {course.duration_hours} Jam Pelatihan
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block">Kategori Fokus Tanaman</span>
                  <span className="text-slate-800 font-bold uppercase">{course.category}</span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block">Tanggal Terdaftar Sistem</span>
                  <span className="text-slate-800 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {new Date(course.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 pt-3 border-t border-slate-100">
                <span className="text-slate-400 font-bold block">Penjelasan Ringkas Kelas</span>
                <p className="text-slate-600 leading-relaxed text-[11px] font-medium bg-slate-50 border border-slate-100 rounded-xl p-4">
                  {course.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Modules Syllabus list */}
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">
                Struktur Silabus Pembelajaran ({course.modules.length} Bab)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {course.modules.map((mod: any, idx: number) => (
                  <div
                    key={mod.id || idx}
                    className="p-3.5 border border-slate-100 rounded-xl flex items-center justify-between gap-4 text-xs font-semibold"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-lg bg-green-50 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-green-700">
                          #{mod.order || idx + 1}
                        </span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-mono text-slate-400 uppercase block">
                          {mod.type} • {mod.duration_minutes || 15} Menit
                        </span>
                        <h4 className="text-slate-800 font-bold">{mod.title}</h4>
                      </div>
                    </div>
                    <div>{getModuleIcon(mod.type)}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Instructor and Moderation */}
        <div className="space-y-6">
          {/* Instructor profile */}
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/50">
              <CardTitle className="text-sm font-bold text-slate-800">
                Profil Instruktur (Pengajar)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs font-semibold text-slate-700">
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">Nama Instruktur</span>
                <span className="text-slate-800 flex items-center gap-1.5">
                  <User className="h-4 w-4 text-slate-400" /> {course.instructor_name}
                </span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 font-bold block">Gelar / Bidang Keahlian</span>
                <span className="text-slate-800 block">{course.instructor_title}</span>
              </div>
              <div className="grid gap-3.5 grid-cols-2 pt-3 border-t border-slate-100">
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">
                    Pendaftar
                  </span>
                  <span className="text-slate-800 font-bold flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-slate-400" /> {course.enrolled_count} Murid
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="text-slate-400 font-bold block text-[10px] uppercase">
                    Rating
                  </span>
                  <span className="text-amber-500 font-bold flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-current" /> {course.average_rating || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Moderation panel */}
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-red-500 to-amber-500" />
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">
                Tindakan Moderasi Kurikulum
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {course.is_published ? (
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                    Menarik kursus ini akan langsung menghilangkannya dari katalog publik SiTani
                    Academy. Siswa baru tidak akan dapat melakukan registrasi pendaftaran kelas.
                  </p>
                  <Button
                    onClick={() => {
                      if (confirm('Tarik kursus ini dari katalog publik?')) {
                        moderateMutation.mutate(false);
                      }
                    }}
                    disabled={moderateMutation.isPending}
                    className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold gap-1.5 py-4 cursor-pointer"
                  >
                    <Archive className="h-4.5 w-4.5" /> Unpublish Kursus Tani
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[10px] text-slate-400 font-semibold leading-normal">
                    Publikasikan kelas agar terdaftar di katalog utama SiTani Academy sehingga siswa
                    nasional dapat melakukan pendaftaran belajar secara bebas.
                  </p>
                  <Button
                    onClick={() => {
                      if (confirm('Publikasikan kelas pelatihan ini secara nasional?')) {
                        moderateMutation.mutate(true);
                      }
                    }}
                    disabled={moderateMutation.isPending}
                    className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold gap-1.5 py-4 cursor-pointer"
                  >
                    <CheckCircle className="h-4.5 w-4.5" /> Publikasikan Kursus Tani
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
