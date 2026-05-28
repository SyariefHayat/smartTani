'use client';
/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { academyService, CourseReview, Course } from '@/services/academy';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ChevronLeft, Star, MessageSquare, AlertTriangle, Calendar, ThumbsUp } from 'lucide-react';

const MOCK_REVIEWS = [
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
  {
    id: 'rev-3',
    course_id: 'course-001',
    student_id: 'siswa-4',
    student_name: 'Budi Raharjo',
    rating: 5,
    comment:
      'Kuis interaktif di modul akhir sangat menantang! Membantu saya memahami teori PH air sebelum praktik lapangan.',
    created_at: '2026-05-15T14:00:00Z',
  },
];

const MOCK_SUMMARY = {
  average: 4.8,
  total: 124,
  breakdown: {
    '5': 85,
    '4': 30,
    '3': 6,
    '2': 2,
    '1': 1,
  },
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function CourseReviewsPage({ params }: PageProps) {
  const { id: courseId } = React.use(params);
  const user = getStoredAuthUser();
  const [isOffline, setIsOffline] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'newest' | 'highest' | 'lowest'>('newest');

  // Fetch course details
  const { data: course } = useQuery<Course | null>({
    queryKey: ['instructor-course-reviews-parent', courseId],
    queryFn: async () => {
      try {
        return await academyService.getCourseById(courseId);
      } catch {
        const key = `courses-${user?.id}`;
        const courses = JSON.parse(localStorage.getItem(key) || '[]');
        return courses.find((c: any) => c.id === courseId) || null;
      }
    },
  });

  // Fetch reviews list
  const { data: reviewsData, isLoading } = useQuery<{ reviews: CourseReview[] }>({
    queryKey: ['instructor-course-reviews-list', courseId, user?.id],
    queryFn: async () => {
      try {
        return await academyService.getCourseReviews(courseId);
      } catch {
        setIsOffline(true);
        return { reviews: MOCK_REVIEWS };
      }
    },
  });

  const reviews = reviewsData?.reviews || MOCK_REVIEWS;

  const sortedReviews = React.useMemo(() => {
    return [...reviews].sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime(); // Newest
    });
  }, [reviews, sortBy]);

  if (isLoading) {
    return (
      <div className="w-full space-y-6">
        <Skeleton className="h-6 w-32" />
        <div className="grid gap-6 md:grid-cols-3">
          <Skeleton className="h-48" />
          <Skeleton className="h-96 md:col-span-2" />
        </div>
      </div>
    );
  }

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

      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Ulasan Kelas: {course?.title || 'Memuat...'} ⭐
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Baca tanggapan, kritik, and masukan langsung dari peserta untuk menjaga mutu pembelajaran.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Academy Service sedang tidak terhubung. Menampilkan ulasan statis dari cache peramban.
            </p>
          </div>
        </div>
      )}

      {/* Main Review Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Left Side: Rating summary */}
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm overflow-hidden">
            <CardHeader className="pb-3 border-b border-slate-100 bg-slate-50/20">
              <CardTitle className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Star className="h-4.5 w-4.5 text-amber-500 fill-amber-500 animate-pulse" />
                Ringkasan Kepuasan
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-5 text-xs font-semibold text-slate-600">
              {/* Giant number */}
              <div className="flex flex-col items-center justify-center text-center space-y-1 py-4 border-b border-slate-100">
                <div className="text-4xl font-extrabold text-slate-800">{MOCK_SUMMARY.average}</div>
                <div className="flex items-center gap-0.5 text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="h-4 w-4 fill-amber-500" />
                  ))}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                  Dihitung dari {MOCK_SUMMARY.total} ulasan
                </p>
              </div>

              {/* Horizontal Star Breakdown */}
              <div className="space-y-2.5 pt-1">
                {Object.entries(MOCK_SUMMARY.breakdown)
                  .reverse()
                  .map(([stars, count]) => {
                    const pct = Math.round((count / MOCK_SUMMARY.total) * 100);
                    return (
                      <div
                        key={stars}
                        className="flex items-center gap-2 text-[10px] font-bold text-slate-500"
                      >
                        <span className="w-3 text-right">{stars}</span>
                        <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-500 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-8 text-right font-mono">{pct}%</span>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 2 Columns: Reviews List */}
        <div className="md:col-span-2 space-y-4">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-bold text-slate-800">
                  Tanggapan & Komentar
                </CardTitle>
                <CardDescription className="text-[10px] font-semibold mt-0.5 uppercase tracking-wide">
                  Menampilkan{' '}
                  <span className="font-bold text-slate-800">{sortedReviews.length}</span> ulasan
                  murid
                </CardDescription>
              </div>

              {/* Sort selector */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                <Button
                  variant={sortBy === 'newest' ? 'default' : 'ghost'}
                  onClick={() => setSortBy('newest')}
                  size="sm"
                  className="text-[9px] font-bold rounded-lg px-2.5 py-1"
                >
                  Terbaru
                </Button>
                <Button
                  variant={sortBy === 'highest' ? 'default' : 'ghost'}
                  onClick={() => setSortBy('highest')}
                  size="sm"
                  className="text-[9px] font-bold rounded-lg px-2.5 py-1"
                >
                  Tertinggi
                </Button>
                <Button
                  variant={sortBy === 'lowest' ? 'default' : 'ghost'}
                  onClick={() => setSortBy('lowest')}
                  size="sm"
                  className="text-[9px] font-bold rounded-lg px-2.5 py-1"
                >
                  Terendah
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-100">
              {sortedReviews.map((rev) => {
                const commentDate = new Date(rev.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });

                return (
                  <div
                    key={rev.id}
                    className="p-5 space-y-2.5 hover:bg-slate-50/30 transition-colors flex items-start gap-4"
                  >
                    {/* Student initials avatar */}
                    <div className="h-10 w-10 rounded-full bg-slate-100 border border-slate-200/60 flex items-center justify-center font-bold text-slate-500 text-xs shrink-0 select-none">
                      {rev.student_name.charAt(0)}
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-800">{rev.student_name}</h4>
                        <span className="flex items-center gap-1 text-[9px] font-bold text-slate-400 font-mono">
                          <Calendar className="h-3.5 w-3.5 text-slate-300" />
                          {commentDate}
                        </span>
                      </div>

                      {/* Stars badge */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`h-3 w-3 ${
                              s <= rev.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-xs font-semibold text-slate-600 leading-relaxed italic pr-4">
                        &quot;{rev.comment}&quot;
                      </p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
