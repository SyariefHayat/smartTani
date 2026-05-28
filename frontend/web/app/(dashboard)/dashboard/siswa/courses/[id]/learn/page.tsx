'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  academyService,
  Course,
  Enrollment,
  Module,
  ModuleProgress,
  QuizQuestion,
} from '@/services/academy';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  ChevronLeft,
  Video,
  FileText,
  HelpCircle,
  Play,
  CheckCircle2,
  Lock,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  Award,
} from 'lucide-react';

const MOCK_COURSE_DETAIL = {
  id: 'course-001',
  title: 'Budidaya Hidroponik Modern untuk Pemula',
  description:
    'Budidaya Hidroponik Modern adalah kursus terintegrasi untuk mengajarkan teknologi hidroponik secara mendalam.',
  short_description: 'Pelajari dasar-dasar berkebun bersih dengan air.',
  category: 'Budidaya',
  difficulty: 'pemula',
  mode: 'online',
  duration_hours: 12,
  instructor_name: 'Dr. Ir. Heri Susanto',
  modules: [
    {
      id: 'mod-1',
      course_id: 'course-001',
      title: 'Pengenalan Hidroponik & Jenis Tanaman',
      description: 'Mengenal sejarah hidroponik dan jenis sayur daun bernilai tinggi.',
      order: 1,
      type: 'video',
      content_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration_minutes: 15,
    },
    {
      id: 'mod-2',
      course_id: 'course-001',
      title: 'Pembangunan Instalasi NFT & Drip System',
      description: 'Panduan teknis merakit pipa PVC dan bak tandon air bernutrisi.',
      order: 2,
      type: 'video',
      content_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      duration_minutes: 25,
    },
    {
      id: 'mod-3',
      course_id: 'course-001',
      title: 'Formulasi AB Mix & Manajemen pH Nutrisi',
      description: 'Mengukur EC tanah, derajat asam/basa (pH), serta kecukupan nutrisi mineral.',
      order: 3,
      type: 'article',
      content_text: `<h3>Formulasi Pupuk AB Mix</h3>
      <p>AB Mix merupakan pupuk hidroponik yang paling umum digunakan. Terdiri dari tangki A (kalsium, zat besi) dan tangki B (fosfat, sulfat, magnesium) yang dilarutkan secara terpisah agar tidak mengendap.</p>
      <h4>Derajat pH Ideal</h4>
      <p>Bagi tanaman sayuran daun (seperti selada, sawi, pakcoy), derajat pH optimal berkisar antara <b>5.5 hingga 6.5</b>. Jika pH terlalu tinggi atau rendah, tanaman akan mengalami defisiensi unsur hara karena nutrisi terkunci.</p>`,
      duration_minutes: 20,
    },
    {
      id: 'mod-4',
      course_id: 'course-001',
      title: 'Ujian Akhir: Pemahaman Hidroponik Dasar',
      description: 'Kuis multiple-choice untuk mengevaluasi pemahaman berkebun hidroponik Anda.',
      order: 4,
      type: 'quiz',
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

export default function StudentLearnPage({ params }: { params: { id: string } }) {
  const courseId = params.id || 'course-001';
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = getStoredAuthUser();

  const [activeModuleId, setActiveModuleId] = React.useState<string>('');
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = React.useState(false);
  const [quizScore, setQuizScore] = React.useState<number | null>(null);
  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch course & modules list
  const { data: course, isLoading: isCourseLoading } = useQuery({
    queryKey: ['student-course-detail-learn', courseId],
    queryFn: async () => {
      try {
        const res = await academyService.getCourseById(courseId);
        if (res && res.modules && res.modules.length > 0) {
          // Set first module active if none set
          if (!activeModuleId) {
            setActiveModuleId(res.modules[0].id);
          }
        }
        return res;
      } catch {
        setIsOffline(true);
        if (!activeModuleId && MOCK_COURSE_DETAIL.modules.length > 0) {
          setActiveModuleId(MOCK_COURSE_DETAIL.modules[0].id);
        }
        return MOCK_COURSE_DETAIL;
      }
    },
  });

  // Fetch student progress
  const { data: progressData, isLoading: isProgressLoading } = useQuery({
    queryKey: ['student-course-progress', courseId, user?.id],
    queryFn: async () => {
      try {
        return await academyService.getMyEnrollmentProgress(courseId);
      } catch {
        // Local simulation baseline
        const key = `progress-${courseId}-${user?.id}`;
        const local = localStorage.getItem(key);
        if (local) return JSON.parse(local);

        const initialProgress: ModuleProgress[] = MOCK_COURSE_DETAIL.modules.map((m) => ({
          id: `prog-${m.id}`,
          enrollment_id: 'enroll-1',
          module_id: m.id,
          student_id: user?.id || 'siswa-1',
          is_completed: false,
        }));
        const data = {
          enrollment: {
            id: 'enroll-1',
            student_id: user?.id || 'siswa-1',
            course_id: courseId,
            status: 'active' as const,
            enrolled_at: new Date().toISOString(),
            progress_percent: 0,
          },
          progress: initialProgress,
        };
        localStorage.setItem(key, JSON.stringify(data));
        return data;
      }
    },
  });

  const activeCourse = course || MOCK_COURSE_DETAIL;
  const activeModule =
    activeCourse.modules?.find((m) => m.id === activeModuleId) || activeCourse.modules?.[0];
  const listProgress = progressData?.progress || [];
  const enrollment = progressData?.enrollment;

  // Complete module mutation
  const completeMutation = useMutation({
    mutationFn: async (args: { moduleId: string; score?: number }) => {
      try {
        await academyService.completeModule(args.moduleId, { score: args.score });
      } catch {
        // Local Simulation Fallback
        const key = `progress-${courseId}-${user?.id}`;
        const prev = progressData || {
          enrollment: {
            id: 'enroll-1',
            student_id: user?.id || 'siswa-1',
            course_id: courseId,
            status: 'active' as const,
            enrolled_at: new Date().toISOString(),
            progress_percent: 0,
          },
          progress: activeCourse.modules.map((m: any) => ({
            id: `prog-${m.id}`,
            enrollment_id: 'enroll-1',
            module_id: m.id,
            student_id: user?.id || 'siswa-1',
            is_completed: false,
          })),
        };

        const updatedProgress = prev.progress.map((p: any) =>
          p.module_id === args.moduleId
            ? {
                ...p,
                is_completed: true,
                completed_at: new Date().toISOString(),
                score: args.score,
              }
            : p
        );

        const completedCount = updatedProgress.filter((p: any) => p.is_completed).length;
        const totalCount = activeCourse.modules?.length || 1;
        const progressPercent = Math.round((completedCount / totalCount) * 100);

        const isFullyCompleted = progressPercent === 100;
        const updatedEnrollment: Enrollment = {
          ...prev.enrollment,
          progress_percent: progressPercent,
          status: isFullyCompleted ? ('completed' as const) : ('active' as const),
          completed_at: isFullyCompleted ? new Date().toISOString() : undefined,
        };

        const newData = { enrollment: updatedEnrollment, progress: updatedProgress };
        localStorage.setItem(key, JSON.stringify(newData));

        // If fully completed, issue certificate simulation
        if (isFullyCompleted) {
          const certKey = `certificates-${user?.id}`;
          const certs = JSON.parse(localStorage.getItem(certKey) || '[]');
          const newCert = {
            id: `cert-${Date.now()}`,
            enrollment_id: prev.enrollment.id,
            student_id: user?.id || 'siswa-1',
            course_id: courseId,
            certificate_number: `ST-ACADEMY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            issued_at: new Date().toISOString(),
            course: activeCourse,
          };
          localStorage.setItem(certKey, JSON.stringify([...certs, newCert]));
        }

        queryClient.setQueryData(['student-course-progress', courseId, user?.id], newData);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-course-progress', courseId] });
      queryClient.invalidateQueries({ queryKey: ['student-analytics'] });
      queryClient.invalidateQueries({ queryKey: ['student-enrollments-active'] });
      queryClient.invalidateQueries({ queryKey: ['student-enrollments-all'] });

      // Automatically scroll up and direct to next module or show certificate
      const currentIdx = activeCourse.modules?.findIndex((m) => m.id === activeModuleId) ?? -1;
      const nextMod = activeCourse.modules?.[currentIdx + 1];

      if (nextMod) {
        toast.success('Materi berhasil diselesaikan!', {
          description: 'Membuka materi bab berikutnya...',
        });
        setActiveModuleId(nextMod.id);
        setQuizSubmitted(false);
        setQuizScore(null);
        setSelectedAnswers({});
      } else {
        toast.success('Selamat! Anda telah menyelesaikan seluruh silabus kelas ini!', {
          description: 'Sertifikat Kelulusan Emas Anda telah terbit di menu Sertifikat.',
          duration: 6000,
        });
      }
    },
  });

  if (isCourseLoading || isProgressLoading || !activeModule) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-6 md:grid-cols-4">
          <Skeleton className="h-96" />
          <Skeleton className="h-96 md:col-span-3" />
        </div>
      </div>
    );
  }

  const isModuleCompleted = listProgress.find(
    (p: any) => p.module_id === activeModule.id
  )?.is_completed;
  const progressPercent = enrollment?.progress_percent ?? 0;
  const completedCount = listProgress.filter((p: any) => p.is_completed).length;
  const totalModulesCount = activeCourse.modules?.length || 1;

  // Quiz evaluation
  const handleQuizSubmit = () => {
    const questions = activeModule.quiz_questions || [];
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correct_index) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / questions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);

    if (score >= 70) {
      completeMutation.mutate({ moduleId: activeModule.id, score });
    } else {
      toast.error('Nilai Anda di bawah KKM 70.', {
        description: 'Silakan pelajari kembali materi dan ulangi kuis.',
      });
    }
  };

  const currentIdx = activeCourse.modules?.findIndex((m) => m.id === activeModuleId) ?? -1;
  const prevMod = activeCourse.modules?.[currentIdx - 1];
  const nextMod = activeCourse.modules?.[currentIdx + 1];

  const typeIcons: Record<string, React.ReactNode> = {
    video: <Video className="h-4 w-4" />,
    article: <FileText className="h-4 w-4" />,
    quiz: <HelpCircle className="h-4 w-4" />,
  };

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header learning status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-1">
          <Link
            href={`/dashboard/siswa/courses/${courseId}`}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Detail Kelas & Silabus
          </Link>
          <h1 className="text-base font-black text-slate-800 leading-tight">
            {activeCourse.title}
          </h1>
        </div>

        {/* Progress Bar Panel */}
        <div className="sm:w-60 space-y-1 shrink-0">
          <div className="flex justify-between text-[10px] font-bold text-slate-500">
            <span>Kemajuan Belajar</span>
            <span className="text-green-600">
              {completedCount}/{totalModulesCount} Bab ({progressPercent}%)
            </span>
          </div>
          <Progress value={progressPercent} className="h-2 bg-slate-100 text-green-600" />
        </div>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Academy Service luring. Anda tetap dapat membaca modul, menyelesaikan kuis, dan memicu
              kalkulasi kelulusan otomatis di memori luring browser Anda.
            </p>
          </div>
        </div>
      )}

      {/* Main Layout 2 Columns */}
      <div className="grid gap-6 md:grid-cols-4">
        {/* Left Column Sidebar (Modules Navigator) */}
        <Card className="border-slate-200 shadow-sm bg-white overflow-hidden md:col-span-1 h-fit">
          <CardHeader className="py-3 px-4 border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider">
              Silabus Bab Belajar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-slate-100">
            {activeCourse.modules?.map((mod: any, idx: number) => {
              const isCompleted = listProgress.find(
                (p: any) => p.module_id === mod.id
              )?.is_completed;
              const isActive = mod.id === activeModuleId;

              return (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveModuleId(mod.id);
                    setQuizSubmitted(false);
                    setQuizScore(null);
                    setSelectedAnswers({});
                  }}
                  className={`w-full text-left p-3.5 flex items-start gap-2.5 transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-green-50/70 text-green-800 border-l-4 border-green-600'
                      : 'bg-white hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border text-[9.5px] font-bold ${
                      isCompleted
                        ? 'bg-green-600 border-green-600 text-white'
                        : isActive
                          ? 'bg-white border-green-300 text-green-600'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <h4
                      className={`text-[11px] font-bold leading-tight ${isActive ? 'text-green-800' : 'text-slate-700'}`}
                    >
                      {mod.title}
                    </h4>
                    <span className="inline-flex items-center gap-1 text-[9px] text-slate-400 font-bold">
                      {typeIcons[mod.type] || <FileText className="h-3 w-3" />}
                      <span className="capitalize">{mod.type}</span>
                    </span>
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {/* Right Column Content Viewer */}
        <div className="md:col-span-3 space-y-6">
          {/* Main Module Content Card */}
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader className="border-b border-slate-100 flex flex-row items-center justify-between gap-4 py-4">
              <div>
                <span className="inline-flex items-center gap-1 text-[9.5px] font-bold text-green-600 uppercase tracking-wide">
                  {typeIcons[activeModule.type] || <FileText className="h-4.5 w-4.5" />} Modul{' '}
                  {activeModule.type}
                </span>
                <CardTitle className="text-sm font-black text-slate-800 mt-1">
                  {activeModule.title}
                </CardTitle>
              </div>
              {isModuleCompleted && (
                <span className="inline-flex items-center rounded-full bg-green-50 border border-green-200 px-3 py-1 text-[10px] font-bold text-green-700 gap-1 shrink-0">
                  <CheckCircle2 className="h-4 w-4" /> Selesai
                </span>
              )}
            </CardHeader>

            <CardContent className="p-6">
              {/* VIDEO MODULE */}
              {activeModule.type === 'video' && activeModule.content_url && (
                <div className="space-y-6">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 border border-slate-200/50 shadow-sm">
                    <iframe
                      src={activeModule.content_url}
                      title={activeModule.title}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <p className="text-xs font-semibold text-slate-600 leading-relaxed bg-slate-50 p-4 border border-slate-100 rounded-xl">
                    {activeModule.description}
                  </p>
                </div>
              )}

              {/* ARTICLE MODULE */}
              {activeModule.type === 'article' && activeModule.content_text && (
                <div className="prose prose-slate max-w-none text-xs font-semibold text-slate-600 leading-relaxed space-y-4">
                  <div dangerouslySetInnerHTML={{ __html: activeModule.content_text }} />
                </div>
              )}

              {/* QUIZ MODULE */}
              {activeModule.type === 'quiz' && activeModule.quiz_questions && (
                <div className="space-y-6">
                  <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl space-y-1">
                    <h4 className="text-xs font-bold text-amber-800 flex items-center gap-1.5">
                      <Sparkles className="h-4.5 w-4.5 text-amber-500 fill-current animate-pulse" />{' '}
                      Ujian Evaluasi Bab
                    </h4>
                    <p className="text-[10.5px] font-semibold text-amber-600 mt-0.5">
                      KKM Kelulusan Ujian adalah **70**. Selesaikan kuis ini untuk klaim sertifikat
                      penyelesaian modul Anda.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {activeModule.quiz_questions.map((q: QuizQuestion, qIdx: number) => {
                      const isQuestionCorrect = selectedAnswers[q.id] === q.correct_index;

                      return (
                        <div
                          key={q.id}
                          className="p-4 border border-slate-100 rounded-xl space-y-3 bg-slate-50/30"
                        >
                          <h4 className="text-xs font-bold text-slate-800">
                            {qIdx + 1}. {q.question}
                          </h4>
                          <RadioGroup
                            value={selectedAnswers[q.id]?.toString()}
                            onValueChange={(val) => {
                              if (!quizSubmitted) {
                                setSelectedAnswers((prev) => ({ ...prev, [q.id]: Number(val) }));
                              }
                            }}
                            className="space-y-2.5"
                          >
                            {q.options.map((opt, optIdx) => {
                              const isChecked = selectedAnswers[q.id] === optIdx;
                              let labelStyle = 'text-slate-600 font-semibold';

                              if (quizSubmitted) {
                                if (optIdx === q.correct_index) {
                                  labelStyle = 'text-green-600 font-black';
                                } else if (isChecked && optIdx !== q.correct_index) {
                                  labelStyle = 'text-rose-500 font-black line-through';
                                } else {
                                  labelStyle = 'text-slate-400 font-semibold';
                                }
                              }

                              return (
                                <div key={optIdx} className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value={optIdx.toString()}
                                    id={`q-${q.id}-opt-${optIdx}`}
                                    disabled={quizSubmitted}
                                    className="text-green-600"
                                  />
                                  <Label
                                    htmlFor={`q-${q.id}-opt-${optIdx}`}
                                    className={`text-xs cursor-pointer ${labelStyle}`}
                                  >
                                    {opt}
                                  </Label>
                                </div>
                              );
                            })}
                          </RadioGroup>
                        </div>
                      );
                    })}
                  </div>

                  {quizSubmitted && quizScore !== null && (
                    <div
                      className={`p-4 border rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${
                        quizScore >= 70
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-rose-50 border-rose-200 text-rose-800'
                      }`}
                    >
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold">Hasil Evaluasi Akhir Kuis</h4>
                        <p className="text-[10.5px] font-semibold opacity-90">
                          {quizScore >= 70
                            ? 'Selamat! Anda lulus kuis. Bab modul terselesaikan.'
                            : 'Nilai Anda kurang dari 70. Silakan coba kuis kembali.'}
                        </p>
                      </div>
                      <div className="text-center sm:text-right shrink-0">
                        <span className="text-[10px] font-bold block opacity-75">Skor Anda</span>
                        <span className="text-2xl font-black">{quizScore} / 100</span>
                      </div>
                    </div>
                  )}

                  {!quizSubmitted && (
                    <Button
                      onClick={handleQuizSubmit}
                      disabled={
                        Object.keys(selectedAnswers).length < activeModule.quiz_questions.length
                      }
                      className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-10 rounded-xl shadow-sm cursor-pointer"
                    >
                      Kirim Jawaban & Selesaikan Ujian
                    </Button>
                  )}

                  {quizSubmitted && quizScore !== null && quizScore < 70 && (
                    <Button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizScore(null);
                        setSelectedAnswers({});
                      }}
                      className="w-full bg-slate-600 hover:bg-slate-700 text-white font-bold text-xs h-10 rounded-xl shadow-sm cursor-pointer"
                    >
                      Ulangi Kuis Ujian
                    </Button>
                  )}
                </div>
              )}
            </CardContent>

            {/* Bottom Actions footer for video/articles */}
            {activeModule.type !== 'quiz' && (
              <CardFooter className="bg-slate-50/50 border-t border-slate-100 p-4 flex items-center justify-between gap-4">
                <div className="text-xs font-bold text-slate-500">
                  {isModuleCompleted ? 'Bab Selesai ✓' : 'Tandai Selesai Setelah Belajar'}
                </div>
                {!isModuleCompleted ? (
                  <Button
                    onClick={() => completeMutation.mutate({ moduleId: activeModule.id })}
                    disabled={completeMutation.isPending}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-9 px-3 gap-1 rounded-xl shadow-sm cursor-pointer"
                  >
                    ✓ Selesaikan Modul
                  </Button>
                ) : (
                  nextMod && (
                    <Button
                      onClick={() => {
                        setActiveModuleId(nextMod.id);
                        setQuizSubmitted(false);
                        setQuizScore(null);
                        setSelectedAnswers({});
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-9 px-3 gap-1 rounded-xl shadow-sm cursor-pointer"
                    >
                      Bab Selanjutnya <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  )
                )}
              </CardFooter>
            )}
          </Card>

          {/* Bottom Next/Prev Navigator buttons */}
          <div className="flex items-center justify-between gap-4">
            {prevMod ? (
              <Button
                variant="outline"
                onClick={() => {
                  setActiveModuleId(prevMod.id);
                  setQuizSubmitted(false);
                  setQuizScore(null);
                  setSelectedAnswers({});
                }}
                className="border-slate-200 hover:bg-white bg-slate-50 text-slate-600 font-bold text-xs h-9 px-3 rounded-xl gap-1 cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Sebelumnya
              </Button>
            ) : (
              <div />
            )}

            {nextMod ? (
              <Button
                variant="outline"
                onClick={() => {
                  setActiveModuleId(nextMod.id);
                  setQuizSubmitted(false);
                  setQuizScore(null);
                  setSelectedAnswers({});
                }}
                className="border-slate-200 hover:bg-white bg-slate-50 text-slate-600 font-bold text-xs h-9 px-3 rounded-xl gap-1 cursor-pointer"
              >
                Selanjutnya <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            ) : (
              isModuleCompleted && (
                <div className="bg-green-50 border border-green-200 text-green-800 p-2.5 rounded-xl text-center text-[10.5px] font-bold flex items-center justify-center gap-1.5 shadow-sm">
                  <Award className="h-4 w-4 text-green-600" /> Seluruh Kurikulum Selesai!
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
