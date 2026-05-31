'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { academyService, Enrollment } from '@/services/academy';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Compass,
  ArrowRight,
  TrendingUp,
  Map,
  BookOpen,
  Award,
  CircleDot,
  CheckCircle,
  Play,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react';

interface RoadmapStep {
  id: string;
  course_id: string;
  step_number: number;
  title: string;
  duration: string;
  level: string;
  skills_acquired: string[];
}

interface LearningPath {
  id: string;
  title: string;
  description: string;
  duration_weeks: number;
  steps_count: number;
  category: string;
  steps: RoadmapStep[];
}

const MOCK_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-1',
    title: 'Spesialis Budidaya Hidroponik Modern',
    description:
      'Pelajari budidaya tanaman efisien tanpa tanah dari dasar hingga pengelolaan skala bisnis ekspor.',
    duration_weeks: 6,
    steps_count: 3,
    category: 'Budidaya',
    steps: [
      {
        id: 'p1-s1',
        course_id: 'course-001',
        step_number: 1,
        title: 'Budidaya Hidroponik Modern untuk Pemula',
        duration: '12 Jam Pelajaran',
        level: 'Dasar (Beginner)',
        skills_acquired: ['Penyemaian benih', 'Instalasi DFT/NFT dasar', 'Formula nutrisi AB Mix'],
      },
      {
        id: 'p1-s2',
        course_id: 'course-004',
        step_number: 2,
        title: 'Pencegahan Hama Organik Terpadu',
        duration: '8 Jam Pelajaran',
        level: 'Menengah (Intermediate)',
        skills_acquired: [
          'Identifikasi hama',
          'Pestisida nabati alami',
          'Sistem sanitasi green house',
        ],
      },
      {
        id: 'p1-s3',
        course_id: 'course-003',
        step_number: 3,
        title: 'Teknologi IoT & Sensor Tanah Pintar',
        duration: '20 Jam Pelajaran',
        level: 'Lanjutan (Expert)',
        skills_acquired: ['Kalibrasi pH otomatis', 'Dosing system', 'Koneksi Blynk Dashboard'],
      },
    ],
  },
  {
    id: 'path-2',
    title: 'Wirausaha Agribisnis Mandiri (Sinergi Investasi)',
    description:
      'Kembangkan keahlian manajemen finansial, cara menyusun pitch deck tani, dan menarik pendanaan.',
    duration_weeks: 8,
    steps_count: 2,
    category: 'Manajemen Bisnis',
    steps: [
      {
        id: 'p2-s1',
        course_id: 'course-002',
        step_number: 1,
        title: 'Manajemen Keuangan & Bisnis Tani Mandiri',
        duration: '15 Jam Pelajaran',
        level: 'Dasar (Beginner)',
        skills_acquired: [
          'Pencatatan arus kas tani',
          'Menghitung HPP komoditas',
          'Analisis Break-Even Point',
        ],
      },
      {
        id: 'p2-s2',
        course_id: 'course-003',
        step_number: 2,
        title: 'Teknologi IoT & Sensor Tanah Pintar',
        duration: '20 Jam Pelajaran',
        level: 'Menengah (Intermediate)',
        skills_acquired: [
          'Digitalisasi pertanian presisi',
          'Efisiensi tenaga kerja',
          'Manajemen logistik berbasis IoT',
        ],
      },
    ],
  },
];

export default function LearningPathsPage() {
  const user = getStoredAuthUser();

  const {
    data: enrollments,
    isLoading,
    isError: isEnrollmentsError,
    refetch: refetchEnrollments,
  } = useQuery<Enrollment[]>({
    queryKey: ['student-enrollments-all', user?.id],
    queryFn: () => academyService.getMyEnrollments(),
  });

  React.useEffect(() => {
    if (isEnrollmentsError) {
      toast.error('Koneksi ke Layanan Academy terputus.');
    }
  }, [isEnrollmentsError]);

  const getStepStatus = React.useCallback(
    (courseId: string) => {
      const enroll = enrollments?.find((e) => e.course_id === courseId);
      if (!enroll) return 'unregistered';
      if (enroll.status === 'completed' || enroll.progress_percent === 100) return 'completed';
      return 'active';
    },
    [enrollments]
  );

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Peta Belajar & Roadmap Karir 🗺️
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Ikuti alur belajar terstruktur untuk meraih kompetensi spesialis tani unggulan.
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <Card className="h-64 animate-pulse bg-slate-100 rounded-2xl" />
          <Card className="h-64 animate-pulse bg-slate-100 rounded-2xl" />
        </div>
      ) : isEnrollmentsError ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50 py-16 px-6">
          <AlertTriangle className="h-8 w-8 text-red-400 mb-3" />
          <p className="text-sm font-bold text-red-500 mb-1">Gagal Memuat Data Jalur Belajar</p>
          <p className="text-xs text-red-400 mb-4">
            Koneksi ke server Academy terputus. Silakan coba lagi.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="border-red-300 text-red-700 bg-white hover:bg-red-100 font-bold text-xs rounded-xl gap-1.5 cursor-pointer"
            onClick={() => refetchEnrollments()}
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Coba Hubungkan Kembali
          </Button>
        </div>
      ) : (
        <div className="space-y-8">
          {MOCK_LEARNING_PATHS.map((path) => (
            <Card
              key={path.id}
              className="border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm"
            >
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-50 border border-slate-200 text-slate-700 text-[9px] font-bold uppercase rounded-lg shadow-none">
                        {path.category}
                      </Badge>
                      <span className="text-[10px] font-bold text-slate-400">
                        Durasi Alur: ± {path.duration_weeks} Minggu
                      </span>
                    </div>
                    <CardTitle className="text-base font-bold text-slate-800 flex items-center gap-2">
                      <Compass className="h-5 w-5 text-slate-700 shrink-0" />
                      {path.title}
                    </CardTitle>
                  </div>
                  <div className="text-xs font-bold text-slate-500">
                    <span className="text-slate-800">{path.steps_count}</span> Langkah Terpadu
                  </div>
                </div>
                <CardDescription className="text-xs font-semibold text-slate-500 leading-relaxed mt-2 max-w-3xl">
                  {path.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 sm:p-8 relative">
                {/* Timeline vertical connector line */}
                <div
                  className="absolute left-9 sm:left-12 top-8 bottom-8 w-0.5 bg-dashed bg-slate-200"
                  style={{
                    backgroundImage:
                      'linear-gradient(to bottom, #cbd5e1 50%, rgba(255,255,255,0) 0%)',
                    backgroundSize: '1px 8px',
                    backgroundRepeat: 'repeat-y',
                  }}
                />

                <div className="space-y-8">
                  {path.steps.map((step) => {
                    const status = getStepStatus(step.course_id);

                    return (
                      <div key={step.id} className="flex gap-4 sm:gap-6 relative items-start">
                        {/* Timeline Node Icon */}
                        <div className="relative shrink-0">
                          {status === 'completed' ? (
                            <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-slate-100 border-2 border-slate-500 flex items-center justify-center text-slate-600 shadow-sm">
                              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                          ) : status === 'active' ? (
                            <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-slate-50 border-2 border-slate-700 flex items-center justify-center text-slate-700 shadow-sm animate-pulse">
                              <CircleDot className="h-4 w-4 sm:h-5 sm:w-5" />
                            </div>
                          ) : (
                            <div className="h-7 w-7 sm:h-9 sm:w-9 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-300 shadow-sm">
                              <span className="text-xs font-bold font-mono">
                                {step.step_number}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Step Details Box */}
                        <div className="flex-1 bg-slate-50/60 hover:bg-slate-50 transition-colors border border-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                                Langkah {step.step_number} • {step.level}
                              </span>
                              {status === 'completed' && (
                                <Badge className="bg-slate-50 text-slate-700 text-[8px] font-bold rounded-md border border-slate-200 shadow-none">
                                  Lulus Sertifikat
                                </Badge>
                              )}
                              {status === 'active' && (
                                <Badge className="bg-slate-50 text-slate-700 text-[8px] font-bold rounded-md border border-slate-200 shadow-none">
                                  Sedang Ditempuh
                                </Badge>
                              )}
                            </div>

                            <h4 className="text-sm font-bold text-slate-800">{step.title}</h4>
                            <p className="text-[10px] font-semibold text-slate-500">
                              Beban Materi: {step.duration}
                            </p>

                            {/* Skills Tag Panel */}
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {step.skills_acquired.map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="text-[9px] font-bold px-2 py-0.5 rounded bg-white border border-slate-200/60 text-slate-500"
                                >
                                  ✓ {skill}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="md:text-right shrink-0 mt-2 md:mt-0">
                            {status === 'completed' ? (
                              <Link href={`/dashboard/siswa/certificates`} passHref legacyBehavior>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs font-semibold border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl"
                                >
                                  <Award className="h-3.5 w-3.5 mr-1" />
                                  Lihat Sertifikat
                                </Button>
                              </Link>
                            ) : status === 'active' ? (
                              <Link
                                href={`/dashboard/siswa/courses/${step.course_id}/learn`}
                                passHref
                                legacyBehavior
                              >
                                <Button
                                  size="sm"
                                  className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-sm gap-1 cursor-pointer"
                                >
                                  Lanjutkan
                                  <Play className="h-3 w-3 fill-white" />
                                </Button>
                              </Link>
                            ) : (
                              <Link
                                href={`/dashboard/siswa/courses/${step.course_id}`}
                                passHref
                                legacyBehavior
                              >
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs font-semibold border-slate-200 text-slate-600 hover:bg-slate-100 rounded-xl gap-1"
                                >
                                  Mulai Belajar
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
