'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  params: Promise<{ id: string }>;
}

export default function CreateModulePage({ params }: PageProps) {
  const router = useRouter();
  const { id: courseId } = React.use(params);
  const user = getStoredAuthUser();
  const queryClient = useQueryClient();

  const [activeType, setActiveType] = React.useState<'video' | 'article' | 'quiz' | 'assignment'>(
    'video'
  );
  const [quizQuestions, setQuizQuestions] = React.useState<QuizQuestion[]>([
    {
      id: 'q-1',
      question: 'Berapakah derajat pH ideal air nutrisi hidroponik?',
      options: ['4.5 - 5.0', '5.5 - 6.5', '7.0 - 8.0'],
      correct_index: 1,
    },
  ]);

  // Form Hook
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(moduleSchema) as any,
    defaultValues: {
      type: 'video',
      duration_minutes: 15,
    },
  });

  const handleTypeChange = (typeVal: 'video' | 'article' | 'quiz' | 'assignment') => {
    setActiveType(typeVal);
    setValue('type', typeVal);
  };

  // Add a quiz question helper
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

  const createModuleMutation = useMutation({
    mutationFn: async (data: ModuleFormData) => {
      const key = `courses-${user?.id}`;
      const courses: Course[] = JSON.parse(localStorage.getItem(key) || '[]');
      const targetCourse = courses.find((c) => c.id === courseId);

      if (!targetCourse) throw new Error('Course not found');
      if (!targetCourse.modules) targetCourse.modules = [];

      const newModuleId = `mod-${Date.now()}`;
      const nextOrder = targetCourse.modules.length + 1;

      const newModule: Module = {
        id: newModuleId,
        course_id: courseId,
        title: data.title,
        description: data.description,
        order: nextOrder,
        type: data.type,
        content_url: data.type === 'video' ? data.content_url : undefined,
        content_text:
          data.type === 'article' || data.type === 'assignment' ? data.content_text : undefined,
        duration_minutes: data.duration_minutes,
        quiz_questions: data.type === 'quiz' ? quizQuestions : undefined,
      };

      // Add to modules list
      targetCourse.modules.push(newModule);

      // Update total course duration
      const totalMin = targetCourse.modules.reduce((acc, m) => acc + (m.duration_minutes || 0), 0);
      targetCourse.duration_hours = Math.round(totalMin / 60) || 1;

      const updated = courses.map((c) => (c.id === courseId ? targetCourse : c));
      localStorage.setItem(key, JSON.stringify(updated));

      return targetCourse;
    },
    onSuccess: () => {
      toast.success('Materi modul belajar berhasil ditambahkan!');
      queryClient.invalidateQueries({ queryKey: ['instructor-course-modules', courseId] });
      router.push(`/dashboard/instruktur/courses/${courseId}/modules`);
    },
  });

  const onSubmit = (data: any) => {
    createModuleMutation.mutate(data);
  };

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
          Tambah Modul Bab Baru ➕
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Buat video streaming, artikel literatur tani, kuis interaktif, atau tugas praktis untuk
          peserta.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-3">
        {/* Left Form: Details */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">Isi Konten Bab</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              {/* Type Switcher Widgets */}
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

              {/* Conditional Form fields depending on type */}
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
                  <p className="text-[10px] text-slate-400 font-medium">
                    Video ini akan langsung ditayangkan di ruang belajar siswa.
                  </p>
                </div>
              )}

              {(activeType === 'article' || activeType === 'assignment') && (
                <div className="space-y-1.5">
                  <label htmlFor="content_text" className="text-xs font-bold text-slate-700">
                    {activeType === 'article'
                      ? 'Naskah / Materi Artikel Lengkap'
                      : 'Instruksi Lembar Tugas Siswa'}
                  </label>
                  <Textarea
                    id="content_text"
                    rows={8}
                    placeholder="Ketik materi ajar atau instruksi penyerahan tugas untuk siswa..."
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
                      Belum ada soal kuis. Tambah kuis pertama Anda.
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
                              placeholder="Ketik pertanyaan kuis di sini..."
                              value={q.question}
                              onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                              className="bg-white border-slate-200 text-xs font-semibold rounded-xl"
                            />
                          </div>

                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-500">
                              Pilihan Jawaban (Klik bulatan untuk kunci jawaban yang benar)
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

        {/* Right Form: Specs */}
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">Spesifikasi Modul</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {/* Title Input */}
              <div className="space-y-1.5">
                <label htmlFor="title" className="text-xs font-bold text-slate-700">
                  Nama Modul Bab
                </label>
                <Input
                  id="title"
                  placeholder="Contoh: Bab 1: Sejarah & Jenis NFT"
                  {...register('title')}
                  className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                />
                {errors.title && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">
                    {errors.title.message?.toString()}
                  </p>
                )}
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <label htmlFor="description" className="text-xs font-bold text-slate-700">
                  Penjelasan Singkat (Optional)
                </label>
                <Textarea
                  id="description"
                  rows={2}
                  placeholder="Ketik deskripsi bab modul singkat..."
                  {...register('description')}
                  className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl resize-none"
                />
              </div>

              {/* Duration Input */}
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
                {errors.duration_minutes && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">
                    {errors.duration_minutes.message?.toString()}
                  </p>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100 p-4 bg-slate-50/50">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm gap-1.5 py-4 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Simpan & Rekat Modul
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
