'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, react-hooks/set-state-in-effect */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import {
  ChevronLeft,
  Save,
  Plus,
  Trash2,
  Video,
  FileText,
  HelpCircle,
  FileQuestion,
  AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { Course, Module, QuizQuestion } from '@/services/academy';

const moduleSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Judul modul minimal 5 karakter.' })
    .max(80, { message: 'Judul maksimal 80 karakter.' }),
  description: z.string().max(200, { message: 'Deskripsi maksimal 200 karakter.' }).optional(),
  type: z.enum(['video', 'article', 'quiz', 'assignment']),
  duration_minutes: z.coerce.number().positive({ message: 'Durasi harus lebih dari 0 menit.' }),
  content_url: z.string().optional(),
  content_text: z.string().optional(),
});

type ModuleFormData = z.infer<typeof moduleSchema>;

interface PageProps {
  params: Promise<{ id: string; mid: string }>;
}

export default function EditModulePage({ params }: PageProps) {
  const router = useRouter();
  const { id: courseId, mid: moduleId } = React.use(params);
  const user = getStoredAuthUser();
  const queryClient = useQueryClient();
  const [isOffline, setIsOffline] = React.useState(false);

  const [activeType, setActiveType] = React.useState<'video' | 'article' | 'quiz' | 'assignment'>(
    'video'
  );
  const [quizQuestions, setQuizQuestions] = React.useState<QuizQuestion[]>([]);

  // Form Hook
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(moduleSchema) as any,
  });

  // Query parent course to find module data
  const { data: course, isLoading } = useQuery<Course | null>({
    queryKey: ['instructor-edit-module-parent', courseId, user?.id],
    queryFn: async () => {
      setIsOffline(true);
      const key = `courses-${user?.id}`;
      const courses = JSON.parse(localStorage.getItem(key) || '[]');
      const found = courses.find((c: any) => c.id === courseId);
      return found || null;
    },
  });

  const moduleData = React.useMemo(() => {
    if (!course || !course.modules) return null;
    return course.modules.find((m) => m.id === moduleId) || null;
  }, [course, moduleId]);

  React.useEffect(() => {
    if (moduleData) {
      reset({
        title: moduleData.title,
        description: moduleData.description,
        type: moduleData.type as any,
        duration_minutes: moduleData.duration_minutes,
        content_url: moduleData.content_url,
        content_text: moduleData.content_text,
      });
      setActiveType(moduleData.type as any);
      if (moduleData.type === 'quiz' && moduleData.quiz_questions) {
        setQuizQuestions(moduleData.quiz_questions);
      }
    }
  }, [moduleData, reset]);

  const handleTypeChange = (typeVal: 'video' | 'article' | 'quiz' | 'assignment') => {
    setActiveType(typeVal);
    setValue('type', typeVal);
  };

  // Add question helper
  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: 'Ketik pertanyaan kuis baru di sini...',
      options: ['Pilihan A', 'Pilihan B', 'Pilihan C'],
      correct_index: 0,
    };
    setQuizQuestions((prev) => [...prev, newQ]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuizQuestions((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleQuestionTextChange = (idx: number, text: string) => {
    setQuizQuestions((prev) => prev.map((q, i) => (i === idx ? { ...q, question: text } : q)));
  };

  const handleOptionTextChange = (qIdx: number, optIdx: number, text: string) => {
    setQuizQuestions((prev) =>
      prev.map((q, i) => {
        if (i === qIdx) {
          const opts = [...q.options];
          opts[optIdx] = text;
          return { ...q, options: opts };
        }
        return q;
      })
    );
  };

  const handleCorrectIndexChange = (qIdx: number, correctIdx: number) => {
    setQuizQuestions((prev) =>
      prev.map((q, i) => (i === qIdx ? { ...q, correct_index: correctIdx } : q))
    );
  };

  const editModuleMutation = useMutation({
    mutationFn: async (data: ModuleFormData) => {
      const key = `courses-${user?.id}`;
      const courses: Course[] = JSON.parse(localStorage.getItem(key) || '[]');
      const targetCourse = courses.find((c) => c.id === courseId);

      if (!targetCourse || !targetCourse.modules) throw new Error('Course or modules not found');

      const updatedModules = targetCourse.modules.map((m) =>
        m.id === moduleId
          ? {
              ...m,
              title: data.title,
              description: data.description,
              type: data.type,
              content_url: data.type === 'video' ? data.content_url : undefined,
              content_text:
                data.type === 'article' || data.type === 'assignment'
                  ? data.content_text
                  : undefined,
              duration_minutes: data.duration_minutes,
              quiz_questions: data.type === 'quiz' ? quizQuestions : undefined,
            }
          : m
      );

      targetCourse.modules = updatedModules;

      // Update parent duration spec
      const totalMin = targetCourse.modules.reduce((acc, m) => acc + (m.duration_minutes || 0), 0);
      targetCourse.duration_hours = Math.round(totalMin / 60) || 1;

      const updated = courses.map((c) => (c.id === courseId ? targetCourse : c));
      localStorage.setItem(key, JSON.stringify(updated));

      return targetCourse;
    },
    onSuccess: () => {
      toast.success('Materi modul belajar berhasil diperbarui!');
      queryClient.invalidateQueries({ queryKey: ['instructor-course-modules', courseId] });
      router.push(`/dashboard/instruktur/courses/${courseId}/modules`);
    },
  });

  const onSubmit = (data: any) => {
    editModuleMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-96 md:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!moduleData) {
    return (
      <div className="w-full text-center py-20">
        <h3 className="text-sm font-bold text-slate-700">Modul Tidak Ditemukan</h3>
        <Button
          onClick={() => router.push(`/dashboard/instruktur/courses/${courseId}/modules`)}
          size="sm"
          className="mt-4 bg-green-600 text-white rounded-xl"
        >
          Kembali ke Silabus
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Back button */}
      <div>
        <Link
          href={`/dashboard/instruktur/courses/${courseId}/modules`}
          className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" /> Kembali ke Urutan Modul
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Edit Modul Bab: {moduleData.title} ✏️
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Perbarui tautan video streaming, materi literatur, susunan kuis, and spesifikasi waktu
          belajar.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Academy Service sedang tidak terhubung. Perubahan modul akan langsung disimpan di
              database peramban Anda.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-3">
        {/* Left Form */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">Isi Konten Bab</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Type selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Tipe Konten Pembelajaran</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { type: 'video', label: 'Video', icon: Video },
                    { type: 'article', label: 'Artikel', icon: FileText },
                    { type: 'quiz', label: 'Kuis', icon: HelpCircle },
                    { type: 'assignment', label: 'Tugas', icon: FileQuestion },
                  ].map((item) => {
                    const isActive = activeType === item.type;
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.type}
                        type="button"
                        onClick={() => handleTypeChange(item.type as any)}
                        className={`py-3 rounded-xl border text-center font-bold text-[10px] uppercase flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isActive
                            ? 'border-green-600 bg-green-50/20 text-green-800'
                            : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-500'
                        }`}
                      >
                        <Icon className="h-4.5 w-4.5" />
                        {item.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Conditional contents */}
              {activeType === 'video' && (
                <div className="space-y-1.5">
                  <label htmlFor="content_url" className="text-xs font-bold text-slate-700">
                    Tautan Video Pembelajaran (YouTube/Vimeo)
                  </label>
                  <Input
                    id="content_url"
                    placeholder="Contoh: https://www.youtube.com/watch?v=..."
                    {...register('content_url')}
                    className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                  />
                </div>
              )}

              {(activeType === 'article' || activeType === 'assignment') && (
                <div className="space-y-1.5">
                  <label htmlFor="content_text" className="text-xs font-bold text-slate-700">
                    {activeType === 'article'
                      ? 'Naskah / Materi Artikel Lengkap'
                      : 'Instruksi Lembar Tugas'}
                  </label>
                  <Textarea
                    id="content_text"
                    rows={8}
                    placeholder="Materi ajar..."
                    {...register('content_text')}
                    className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl resize-none"
                  />
                </div>
              )}

              {activeType === 'quiz' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <span className="text-xs font-bold text-slate-700">Daftar Soal Kuis</span>
                    <Button
                      type="button"
                      onClick={handleAddQuestion}
                      size="sm"
                      className="bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-bold h-7 rounded-lg gap-1 cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Tambah Soal
                    </Button>
                  </div>

                  {quizQuestions.length === 0 ? (
                    <p className="text-[10px] text-slate-400 font-semibold py-4 text-center">
                      Belum ada kuis.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {quizQuestions.map((q, qIdx) => (
                        <div
                          key={q.id}
                          className="bg-slate-50 border border-slate-100/60 rounded-xl p-3.5 space-y-3 relative"
                        >
                          <Button
                            type="button"
                            onClick={() => handleRemoveQuestion(qIdx)}
                            className="absolute right-2 top-2 h-7 w-7 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>

                          <div className="space-y-1.5">
                            <span className="text-[10px] font-mono font-bold text-green-700">
                              Soal {qIdx + 1}
                            </span>
                            <Input
                              value={q.question}
                              onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                              className="bg-white border-slate-200 text-xs font-semibold rounded-xl"
                            />
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-500">
                              Kunci Jawaban
                            </span>
                            <div className="space-y-1.5">
                              {q.options.map((opt, optIdx) => (
                                <div key={optIdx} className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`correct-${q.id}`}
                                    checked={q.correct_index === optIdx}
                                    onChange={() => handleCorrectIndexChange(qIdx, optIdx)}
                                    className="h-3.5 w-3.5 text-green-600 focus:ring-green-500 border-slate-300"
                                  />
                                  <Input
                                    value={opt}
                                    onChange={(e) =>
                                      handleOptionTextChange(qIdx, optIdx, e.target.value)
                                    }
                                    className="bg-white border-slate-200 text-[11px] font-semibold h-8 rounded-lg"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Specs Column */}
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">Spesifikasi Modul</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="title" className="text-xs font-bold text-slate-700">
                  Nama Modul Bab
                </label>
                <Input
                  id="title"
                  placeholder="Ketik judul modul..."
                  {...register('title')}
                  className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="description" className="text-xs font-bold text-slate-700">
                  Penjelasan Singkat
                </label>
                <Textarea
                  id="description"
                  rows={2}
                  placeholder="Ketik deskripsi..."
                  {...register('description')}
                  className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl resize-none"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="duration_minutes" className="text-xs font-bold text-slate-700">
                  Beban Belajar (Menit)
                </label>
                <Input
                  id="duration_minutes"
                  type="number"
                  placeholder="Menit"
                  {...register('duration_minutes')}
                  className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                />
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 p-4 bg-slate-50/50">
              <Button
                type="submit"
                disabled={editModuleMutation.isPending}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm gap-1.5 py-4 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Simpan Perubahan Modul
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
