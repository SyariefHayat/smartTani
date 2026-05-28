'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academyService, Course } from '@/services/academy';
import { instructorService } from '@/services/instructor';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AdminStatsCards, AdminStatItem } from '@/components/features/admin/shared/AdminStatsCards';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import { GraduationCap, Eye, AlertTriangle, CheckCircle, Archive, Star, Users } from 'lucide-react';
import Link from 'next/link';

const MOCK_COURSES: Course[] = [
  {
    id: 'course-1',
    title: 'Budidaya Hidroponik Modern untuk Pemula',
    description:
      'Pelajari dasar-dasar perakitan pipa hidroponik NFT, pencampuran pupuk konsentrat AB Mix, and menanam sayuran krispi skala ekspor.',
    short_description: 'Dasar rakit pipa NFT and nutrisi AB Mix.',
    category: 'Budidaya',
    difficulty: 'pemula',
    mode: 'online',
    duration_hours: 12,
    instructor_id: 'usr-8',
    instructor_name: 'Dr. Ir. Heri Susanto',
    instructor_title: 'Dosen Agronomi Utama',
    price: 0,
    is_free: true,
    is_published: true,
    enrolled_count: 1450,
    average_rating: 4.8,
    review_count: 124,
    created_at: '2026-05-18T08:00:00Z',
    modules: [],
  },
  {
    id: 'course-2',
    title: 'Manajemen Keuangan Bisnis Tani Dasar',
    description:
      'Panduan lengkap pencatatan modal tani, pengalokasian dana panen, and analisis arus kas usaha tani.',
    short_description: 'Kelola kas and modal tani secara tertata.',
    category: 'Bisnis Tani',
    difficulty: 'menengah',
    mode: 'online',
    duration_hours: 8,
    instructor_id: 'usr-8',
    instructor_name: 'Dr. Ir. Heri Susanto',
    instructor_title: 'Dosen Agronomi Utama',
    price: 95000,
    is_free: false,
    is_published: true,
    enrolled_count: 390,
    average_rating: 4.7,
    review_count: 35,
    created_at: '2026-05-20T10:00:00Z',
    modules: [],
  },
];

export default function AdminCoursesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const [isOffline, setIsOffline] = React.useState(false);

  const category = searchParams.get('category') || 'all';
  const status = searchParams.get('status') || 'all';

  // Initialize localStorage for courses
  React.useEffect(() => {
    if (!localStorage.getItem('admin-courses')) {
      localStorage.setItem('admin-courses', JSON.stringify(MOCK_COURSES));
    }
  }, []);

  // Fetch Courses Query
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['admin-courses-list', category, status],
    queryFn: async () => {
      try {
        const res = await academyService.getCourses(); // Sees all
        let list = res.courses;
        if (category !== 'all') {
          list = list.filter((c) => c.category === category);
        }
        if (status !== 'all') {
          const pub = status === 'published';
          list = list.filter((c) => c.is_published === pub);
        }
        return list;
      } catch {
        setIsOffline(true);
        const stored = JSON.parse(localStorage.getItem('admin-courses') || '[]');
        let filtered = [...stored];
        if (category !== 'all') {
          filtered = filtered.filter((c) => c.category === category);
        }
        if (status !== 'all') {
          const pub = status === 'published';
          filtered = filtered.filter((c) => c.is_published === pub);
        }
        return filtered;
      }
    },
  });

  // Calculate statistics from localStorage
  const stats = React.useMemo(() => {
    const stored = JSON.parse(
      (typeof window !== 'undefined' && localStorage.getItem('admin-courses')) ||
        JSON.stringify(MOCK_COURSES)
    );
    const total = stored.length;
    const published = stored.filter((c: any) => c.is_published).length;
    const draft = stored.filter((c: any) => !c.is_published).length;
    const totalStudents = stored.reduce((acc: number, c: any) => acc + (c.enrolled_count || 0), 0);
    return { total, published, draft, totalStudents };
  }, [courses]);

  const updateFilters = (newCat: string, newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCat === 'all') params.delete('category');
    else params.set('category', newCat);

    if (newStatus === 'all') params.delete('status');
    else params.set('status', newStatus);

    router.push(`/admin/courses?${params.toString()}`);
  };

  // Moderate publish status mutation
  const moderateMutation = useMutation({
    mutationFn: async ({ courseId, isPublished }: { courseId: string; isPublished: boolean }) => {
      try {
        await instructorService.publishCourse(courseId, isPublished);
      } catch {
        const stored: Course[] = JSON.parse(localStorage.getItem('admin-courses') || '[]');
        const updated = stored.map((c) =>
          c.id === courseId ? { ...c, is_published: isPublished } : c
        );
        localStorage.setItem('admin-courses', JSON.stringify(updated));
      }
    },
    onSuccess: (_, variables) => {
      toast.success(
        `Kursus berhasil di-${variables.isPublished ? 'publikasikan secara nasional' : 'tarik dari publik'}!`
      );
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

  const statCards: AdminStatItem[] = [
    {
      label: 'Total Kursus',
      value: stats.total,
      icon: GraduationCap,
      color: 'text-slate-700',
      bgColor: 'bg-slate-100',
      description: 'Kurikulum akademi terdaftar',
    },
    {
      label: 'Telah Terbit',
      value: stats.published,
      icon: CheckCircle,
      color: 'text-green-700',
      bgColor: 'bg-green-100',
      description: 'Kursus aktif dapat diakses siswa',
    },
    {
      label: 'Kelas Draf',
      value: stats.draft,
      icon: Archive,
      color: 'text-amber-700',
      bgColor: 'bg-amber-100',
      description: 'Menunggu pelengkapan silabus',
    },
    {
      label: 'Total Siswa',
      value: `${stats.totalStudents.toLocaleString('id-ID')} Murid`,
      icon: Users,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100',
      description: 'Siswa aktif mendaftar kelas',
    },
  ];

  return (
    <div className="w-full space-y-6 text-slate-900 pb-12">
      {/* Header */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800">
            Kelola Kursus SiTani Academy 🎓
          </h1>
          <p className="text-xs font-semibold text-slate-500">
            Awasi and moderasi materi kelas pelatihan akademi, ulas materi video/artikel yang
            ditambahkan instruktur, and tarik kelas bermasalah dari katalog publik.
          </p>
        </div>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Academy Service sedang tidak terhubung. Seluruh penarikan/publikasi kelas disimpan
              secara luring.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <AdminStatsCards stats={statCards} loading={isLoading} />

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">
          Daftar Kurikulum Pelatihan
        </span>
        <div className="flex flex-wrap gap-4 items-center">
          {/* Category */}
          <Select value={category} onValueChange={(val) => updateFilters(val, status)}>
            <SelectTrigger className="w-[160px] bg-white border-slate-200 text-xs rounded-xl focus:ring-green-500 h-10">
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-xl">
              <SelectItem value="all" className="text-xs cursor-pointer">
                Semua Kategori
              </SelectItem>
              <SelectItem value="Budidaya" className="text-xs cursor-pointer">
                Budidaya
              </SelectItem>
              <SelectItem value="Bisnis Tani" className="text-xs cursor-pointer">
                Bisnis Tani
              </SelectItem>
            </SelectContent>
          </Select>

          {/* Status */}
          <Select value={status} onValueChange={(val) => updateFilters(category, val)}>
            <SelectTrigger className="w-[160px] bg-white border-slate-200 text-xs rounded-xl focus:ring-green-500 h-10">
              <SelectValue placeholder="Pilih Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border-slate-200 rounded-xl">
              <SelectItem value="all" className="text-xs cursor-pointer">
                Semua Status
              </SelectItem>
              <SelectItem value="published" className="text-xs cursor-pointer">
                Published
              </SelectItem>
              <SelectItem value="draft" className="text-xs cursor-pointer">
                Draft
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table grid */}
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/70 border-b border-slate-100">
            <TableRow>
              <TableHead className="text-xs font-bold text-slate-700 p-4">Judul Kursus</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Instruktur</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Kategori</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Peserta</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Rating</TableHead>
              <TableHead className="text-xs font-bold text-slate-700">Status</TableHead>
              <TableHead className="text-xs font-bold text-slate-700 text-right p-4">
                Aksi
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="text-xs font-semibold text-slate-700">
            {isLoading ? (
              [...Array(2)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="p-4">
                    <div className="h-4 bg-slate-100 rounded w-44 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-24 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-20 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-12 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-12 animate-pulse" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 bg-slate-100 rounded w-16 animate-pulse" />
                  </TableCell>
                  <TableCell className="text-right p-4">
                    <div className="h-8 bg-slate-100 rounded w-20 ml-auto animate-pulse" />
                  </TableCell>
                </TableRow>
              ))
            ) : courses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center text-slate-400 font-semibold">
                  Tidak ada data kursus pelatihan.
                </TableCell>
              </TableRow>
            ) : (
              courses.map((c) => (
                <TableRow key={c.id} className="hover:bg-slate-50/40 border-b border-slate-100">
                  <TableCell className="p-4 font-bold text-slate-800 max-w-[240px] truncate">
                    {c.title}
                  </TableCell>
                  <TableCell>{c.instructor_name}</TableCell>
                  <TableCell>{c.category}</TableCell>
                  <TableCell>{c.enrolled_count} Murid</TableCell>
                  <TableCell className="flex items-center gap-1.5 pt-4 text-amber-500 font-bold">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    {c.average_rating || 0}
                  </TableCell>
                  <TableCell>{getStatusBadge(c.is_published)}</TableCell>
                  <TableCell className="text-right p-4 space-x-2">
                    <Link href={`/admin/courses/${c.id}`} passHref legacyBehavior>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-slate-600 border-slate-200 hover:bg-slate-50 gap-1 cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> Detail
                      </Button>
                    </Link>

                    {c.is_published ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (
                            confirm(
                              'Tarik kursus ini dari katalog publik? Siswa baru tidak akan dapat melakukan registrasi belajar.'
                            )
                          ) {
                            moderateMutation.mutate({ courseId: c.id, isPublished: false });
                          }
                        }}
                        className="text-amber-600 border-amber-200 hover:bg-amber-50 cursor-pointer"
                      >
                        Unpublish
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (
                            confirm(
                              'Publikasikan kursus ini agar muncul di katalog publik SiTani Academy?'
                            )
                          ) {
                            moderateMutation.mutate({ courseId: c.id, isPublished: true });
                          }
                        }}
                        className="text-green-600 border-green-200 hover:bg-green-50 cursor-pointer"
                      >
                        Publish
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
