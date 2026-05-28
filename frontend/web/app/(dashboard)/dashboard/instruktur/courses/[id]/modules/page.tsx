'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academyService, Course, Module } from '@/services/academy';
import { instructorService } from '@/services/instructor';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Plus,
  Video,
  FileText,
  HelpCircle,
  FileQuestion,
  Edit2,
  Trash2,
  ArrowUp,
  ArrowDown,
  Globe,
  Archive,
  AlertTriangle,
} from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CourseModulesPage({ params }: PageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const user = getStoredAuthUser();
  const queryClient = useQueryClient();
  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch course details + modules
  const { data: course, isLoading } = useQuery<Course | null>({
    queryKey: ['instructor-course-modules', id, user?.id],
    queryFn: async () => {
      try {
        const res = await academyService.getCourseById(id);
        return res;
      } catch {
        setIsOffline(true);
        // Load from local storage
        const key = `courses-${user?.id}`;
        const courses = JSON.parse(localStorage.getItem(key) || '[]');
        const found = courses.find((c: any) => c.id === id);

        // Provide mock initial modules if none exist in mock
        if (found && (!found.modules || found.modules.length === 0)) {
          found.modules = [
            {
              id: 'mod-1',
              course_id: id,
              title: 'Pengenalan Hidroponik & Jenis Tanaman',
              order: 1,
              type: 'video',
              duration_minutes: 15,
            },
            {
              id: 'mod-2',
              course_id: id,
              title: 'Pembangunan Instalasi NFT & Drip System',
              order: 2,
              type: 'video',
              duration_minutes: 25,
            },
            {
              id: 'mod-3',
              course_id: id,
              title: 'Formulasi AB Mix & Manajemen pH Nutrisi',
              order: 3,
              type: 'article',
              duration_minutes: 20,
            },
            {
              id: 'mod-4',
              course_id: id,
              title: 'Ujian Akhir: Pemahaman Hidroponik Dasar',
              order: 4,
              type: 'quiz',
              duration_minutes: 15,
            },
          ];
          // Save back
          const idx = courses.findIndex((c: any) => c.id === id);
          courses[idx] = found;
          localStorage.setItem(key, JSON.stringify(courses));
        }
        return found || null;
      }
    },
  });

  const modulesList = React.useMemo(() => {
    if (!course || !course.modules) return [];
    return [...course.modules].sort((a, b) => a.order - b.order);
  }, [course]);

  // Reorder Modules mutation
  const reorderMutation = useMutation({
    mutationFn: async (newModules: Module[]) => {
      try {
        const ids = newModules.map((m) => m.id);
        await instructorService.reorderModules(id, ids);
      } catch {
        // Offline persistent update
        const key = `courses-${user?.id}`;
        const courses: Course[] = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = courses.map((c) => (c.id === id ? { ...c, modules: newModules } : c));
        localStorage.setItem(key, JSON.stringify(updated));
        queryClient.setQueryData(
          ['instructor-course-modules', id, user?.id],
          updated.find((c) => c.id === id)
        );
      }
    },
    onSuccess: () => {
      toast.success('Urutan silabus berhasil disimpan!');
      queryClient.invalidateQueries({ queryKey: ['instructor-course-modules', id] });
    },
  });

  // Delete Module mutation
  const deleteMutation = useMutation({
    mutationFn: async (moduleId: string) => {
      // Offline persistent delete
      const key = `courses-${user?.id}`;
      const courses: Course[] = JSON.parse(localStorage.getItem(key) || '[]');
      const targetCourse = courses.find((c) => c.id === id);
      if (targetCourse && targetCourse.modules) {
        const filteredMods = targetCourse.modules
          .filter((m) => m.id !== moduleId)
          .map((m, idx) => ({ ...m, order: idx + 1 })); // Re-order index

        targetCourse.modules = filteredMods;
        const updated = courses.map((c) => (c.id === id ? targetCourse : c));
        localStorage.setItem(key, JSON.stringify(updated));
        queryClient.setQueryData(['instructor-course-modules', id, user?.id], targetCourse);
      }
    },
    onSuccess: () => {
      toast.success('Modul berhasil dihapus dari silabus kelas.');
      queryClient.invalidateQueries({ queryKey: ['instructor-course-modules', id] });
    },
  });

  // Toggle publish
  const publishMutation = useMutation({
    mutationFn: async (publish: boolean) => {
      try {
        await instructorService.publishCourse(id, publish);
      } catch {
        const key = `courses-${user?.id}`;
        const courses: Course[] = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = courses.map((c) => (c.id === id ? { ...c, is_published: publish } : c));
        localStorage.setItem(key, JSON.stringify(updated));
        queryClient.setQueryData(
          ['instructor-course-modules', id, user?.id],
          updated.find((c) => c.id === id)
        );
      }
    },
    onSuccess: (data, publish) => {
      toast.success(
        publish
          ? 'Kelas berhasil dipublikasikan secara nasional!'
          : 'Kelas ditarik dari katalog publik.'
      );
      queryClient.invalidateQueries({ queryKey: ['instructor-course-modules', id] });
    },
  });

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const list = [...modulesList];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= list.length) return;

    // Swap items
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    // Adjust orders
    const updated = list.map((m, idx) => ({ ...m, order: idx + 1 }));
    reorderMutation.mutate(updated);
  };

  const getModuleIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4 text-green-600" />;
      case 'article':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'quiz':
        return <HelpCircle className="h-4 w-4 text-amber-500" />;
      default:
        return <FileQuestion className="h-4 w-4 text-slate-400" />;
    }
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="w-full text-center py-20">
        <h3 className="text-sm font-bold text-slate-700">Kelas Tidak Ditemukan</h3>
        <Link href="/dashboard/instruktur/courses">
          <Button size="sm" className="mt-4 bg-green-600 text-white rounded-xl">
            Kembali ke Daftar
          </Button>
        </Link>
      </div>
    );
  }

  const totalDurationMinutes = modulesList.reduce((acc, m) => acc + (m.duration_minutes || 0), 0);

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

      {/* Header Info Panel */}
      <Card className="border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
        <div className="h-2 bg-gradient-to-r from-green-500 via-emerald-600 to-amber-500" />
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-bold uppercase rounded-lg">
                {course.category}
              </Badge>
              {course.is_published ? (
                <Badge className="bg-emerald-50 border border-emerald-100 text-emerald-700 text-[9px] font-bold uppercase rounded-lg">
                  Published
                </Badge>
              ) : (
                <Badge className="bg-slate-100 border border-slate-200 text-slate-500 text-[9px] font-bold uppercase rounded-lg">
                  Draft
                </Badge>
              )}
            </div>
            <h2 className="text-base font-bold text-slate-800">{course.title}</h2>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-3">
              <span>{modulesList.length} Modul Bab</span>
              <span>•</span>
              <span>
                Total Waktu: {totalDurationMinutes} Menit ({Math.round(totalDurationMinutes / 60)}{' '}
                Jam)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {course.is_published ? (
              <Button
                variant="outline"
                onClick={() => publishMutation.mutate(false)}
                size="sm"
                className="text-xs font-semibold border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl cursor-pointer gap-1.5"
              >
                <Archive className="h-3.5 w-3.5" />
                Unpublish
              </Button>
            ) : (
              <Button
                onClick={() => publishMutation.mutate(true)}
                disabled={modulesList.length === 0}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer gap-1.5"
              >
                <Globe className="h-3.5 w-3.5" />
                Publish Kelas
              </Button>
            )}

            <Link
              href={`/dashboard/instruktur/courses/${id}/modules/create`}
              passHref
              legacyBehavior
            >
              <Button
                size="sm"
                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm cursor-pointer gap-1.5"
              >
                <Plus className="h-4.5 w-4.5" />
                Tambah Bab Modul
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Academy Service sedang tidak terhubung. Urutan bab silabus belajar akan disimpan
              secara luring.
            </p>
          </div>
        </div>
      )}

      {/* Modules List Layout */}
      {modulesList.length === 0 ? (
        <Card className="border-dashed border-slate-200 bg-slate-50/50 py-16 flex flex-col items-center justify-center text-center">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mb-2.5">
            <Plus className="h-5 w-5" />
          </div>
          <h3 className="text-xs font-bold text-slate-700">Silabus Bab Kosong</h3>
          <p className="text-[10px] font-semibold text-slate-400 max-w-xs mt-0.5">
            Belum ada bab atau materi modul belajar yang ditambahkan ke kelas draf ini.
          </p>
        </Card>
      ) : (
        <div className="space-y-3.5">
          {modulesList.map((mod, index) => (
            <Card
              key={mod.id}
              className="border-slate-200 bg-white hover:shadow-sm transition-all duration-300 rounded-xl overflow-hidden"
            >
              <CardContent className="p-4 flex items-center justify-between gap-4">
                {/* Visual Icon & Content Title */}
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-green-700 font-mono">
                      #{mod.order}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                        {getModuleIcon(mod.type)}
                        {mod.type}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">
                        • {mod.duration_minutes || 0} Menit
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">{mod.title}</h4>
                  </div>
                </div>

                {/* Operations & Reorder Buttons */}
                <div className="flex items-center gap-2 shrink-0">
                  {/* Up button */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={index === 0}
                    onClick={() => handleMove(index, 'up')}
                    className="h-8 w-8 p-0 rounded-lg border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <ArrowUp className="h-3.5 w-3.5 text-slate-500" />
                  </Button>

                  {/* Down button */}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={index === modulesList.length - 1}
                    onClick={() => handleMove(index, 'down')}
                    className="h-8 w-8 p-0 rounded-lg border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <ArrowDown className="h-3.5 w-3.5 text-slate-500" />
                  </Button>

                  {/* Edit action */}
                  <Link
                    href={`/dashboard/instruktur/courses/${id}/modules/${mod.id}/edit`}
                    passHref
                    legacyBehavior
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8 text-slate-600 border-slate-200 hover:bg-slate-50 rounded-lg text-[10px] font-bold gap-1 cursor-pointer"
                    >
                      <Edit2 className="h-3 w-3" />
                      Edit
                    </Button>
                  </Link>

                  {/* Delete action */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm('Apakah Anda yakin ingin menghapus modul bab ini?')) {
                        deleteMutation.mutate(mod.id);
                      }
                    }}
                    className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
