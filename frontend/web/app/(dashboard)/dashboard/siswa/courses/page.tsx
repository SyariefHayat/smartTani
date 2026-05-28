'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */

import * as React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { academyService, Course, Enrollment } from '@/services/academy';
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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  GraduationCap,
  Search,
  BookOpen,
  Clock,
  Star,
  Award,
  Sparkles,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  Tv,
} from 'lucide-react';

const MOCK_COURSES: Course[] = [
  {
    id: 'course-001',
    title: 'Budidaya Hidroponik Modern untuk Pemula',
    description:
      'Teknik hidroponik menggunakan sistem NFT dan Drip untuk komoditas sayuran hortikultura.',
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
  {
    id: 'course-002',
    title: 'Manajemen Keuangan & Bisnis Tani Mandiri',
    description:
      'Mengelola pembukuan arus kas, anggaran, dan analisis rasio kelayakan usaha pertanian.',
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
  {
    id: 'course-003',
    title: 'Teknologi IoT & Sensor Tanah Pintar',
    description:
      'Penerapan modul Arduino dan sensor kelembaban tanah untuk otomatisasi pengairan dan pemupukan.',
    short_description: 'Gabungkan teknologi terkini dengan lahan pertanian Anda.',
    category: 'Agroteknologi',
    difficulty: 'ahli',
    mode: 'blended',
    duration_hours: 20,
    instructor_id: 'inst-3',
    instructor_name: 'Riza Fahmi, M.T.',
    instructor_title: 'IoT Engineer & Founder AgriTech',
    price: 150000,
    is_free: false,
    is_published: true,
    enrolled_count: 320,
    average_rating: 4.9,
    review_count: 45,
  },
  {
    id: 'course-004',
    title: 'Pencegahan Hama Organik Terpadu',
    description:
      'Teknik pembuatan pestisida hayati, agen pengendali hayati mikroba, dan musuh alami.',
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
  {
    id: 'course-005',
    title: 'Pembenihan Padi Unggul & Sertifikasi Benih',
    description:
      'Panduan lengkap seleksi varietas unggul padi, pemuliaan benih, dan proses sertifikasi BPSB.',
    short_description: 'Hasilkan bibit unggul padi dengan standar nasional.',
    category: 'Budidaya',
    difficulty: 'ahli',
    mode: 'offline',
    duration_hours: 18,
    instructor_id: 'inst-4',
    instructor_name: 'Siti Aminah, M.Si.',
    instructor_title: 'Peneliti Balai Benih Nasional',
    price: 350000,
    is_free: false,
    is_published: true,
    enrolled_count: 120,
    average_rating: 4.5,
    review_count: 18,
  },
];

export default function StudentCatalogPage() {
  const user = getStoredAuthUser();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('all');
  const [difficultyFilter, setDifficultyFilter] = React.useState('all');
  const [modeFilter, setModeFilter] = React.useState('all');
  const [sortOption, setSortOption] = React.useState('popular');
  const [isOffline, setIsOffline] = React.useState(false);

  // Fetch enrollments to display enrolled indicators
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

  // Fetch courses
  const { data: courses, isLoading } = useQuery({
    queryKey: ['student-catalog-courses'],
    queryFn: async () => {
      try {
        const res = await academyService.getCourses();
        if (!res || !res.courses || res.courses.length === 0) throw new Error('Empty');
        return res.courses;
      } catch {
        setIsOffline(true);
        return MOCK_COURSES;
      }
    },
  });

  const activeCourses = courses || MOCK_COURSES;

  // Filter & Sort logic
  const filteredCourses = activeCourses
    .filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.instructor_name.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
      const matchesDifficulty =
        difficultyFilter === 'all' || course.difficulty === difficultyFilter;
      const matchesMode = modeFilter === 'all' || course.mode === modeFilter;

      return matchesSearch && matchesCategory && matchesDifficulty && matchesMode;
    })
    .sort((a, b) => {
      if (sortOption === 'popular') return b.enrolled_count - a.enrolled_count;
      if (sortOption === 'rating') return Number(b.average_rating) - Number(a.average_rating);
      if (sortOption === 'newest') return b.id > a.id ? 1 : -1;
      return 0;
    });

  const categories = [
    { value: 'all', label: 'Semua Kategori' },
    { value: 'Budidaya', label: 'Budidaya' },
    { value: 'Agroteknologi', label: 'Agroteknologi' },
    { value: 'Manajemen Bisnis Tani', label: 'Bisnis & Keuangan' },
  ];

  return (
    <div className="w-full space-y-6 text-slate-900">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 flex items-center gap-2">
          <GraduationCap className="h-7 w-7 text-green-600" /> Katalog Kelas SiTani Academy
        </h1>
        <p className="text-xs text-slate-500 font-semibold mt-1">
          Pilih kurikulum terlengkap, daftarkan diri Anda, dan mulailah belajar dari ahli pertanian
          terbaik Indonesia.
        </p>
      </div>

      {/* Filter and Search Panel */}
      <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
        <CardContent className="pt-5 space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4">
            {/* Search Input */}
            <div className="relative md:col-span-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Cari kelas, pengajar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-10 text-xs border-slate-200 focus:border-green-500 rounded-xl"
              />
            </div>

            {/* Category Select */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-10 text-xs border-slate-200 rounded-xl">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value} className="text-xs">
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Difficulty Select */}
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger className="h-10 text-xs border-slate-200 rounded-xl">
                <SelectValue placeholder="Semua Kesulitan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-xs">
                  Semua Kesulitan
                </SelectItem>
                <SelectItem value="pemula" className="text-xs">
                  Pemula
                </SelectItem>
                <SelectItem value="menengah" className="text-xs">
                  Menengah
                </SelectItem>
                <SelectItem value="ahli" className="text-xs">
                  Ahli
                </SelectItem>
              </SelectContent>
            </Select>

            {/* Sort Select */}
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="h-10 text-xs border-slate-200 rounded-xl">
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular" className="text-xs">
                  Paling Populer
                </SelectItem>
                <SelectItem value="rating" className="text-xs">
                  Rating Tertinggi
                </SelectItem>
                <SelectItem value="newest" className="text-xs">
                  Terbaru
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Category Tags / Chips */}
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Filter Mode:
            </span>
            {[
              { value: 'all', label: 'Semua Mode' },
              { value: 'online', label: '💻 Online (Video)' },
              { value: 'offline', label: '🏡 Tatap Muka (Lahan)' },
              { value: 'blended', label: '🌾 Blended Learning' },
            ].map((mode) => (
              <button
                key={mode.value}
                onClick={() => setModeFilter(mode.value)}
                className={`px-3 py-1 rounded-full text-[10.5px] font-bold border transition-all cursor-pointer ${
                  modeFilter === mode.value
                    ? 'bg-green-600 border-green-600 text-white shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Courses Catalog Grid */}
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/65 rounded-xl shadow-sm space-y-3">
          <GraduationCap className="mx-auto h-16 w-16 text-slate-300" />
          <h3 className="text-sm font-bold text-slate-800">Kelas tidak ditemukan</h3>
          <p className="text-xs text-slate-500 font-semibold max-w-xs mx-auto">
            Coba ubah kata kunci pencarian Anda atau pilih kategori penyaringan lainnya.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => {
            const isEnrolled = myEnrollments?.some((e) => e.course_id === course.id);
            const isCompleted =
              myEnrollments?.find((e) => e.course_id === course.id)?.status === 'completed';

            return (
              <Card
                key={course.id}
                className="border-slate-200 hover:border-green-300 hover:shadow-md transition-all duration-300 bg-white overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-5 space-y-4">
                  {/* Category & Badge Row */}
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-0.5 text-[9px] font-bold text-green-700 border border-green-100">
                      {course.category}
                    </span>
                    {isCompleted ? (
                      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-[9px] font-bold text-blue-700 border border-blue-100 gap-0.5">
                        <Award className="h-3 w-3" /> Lulus
                      </span>
                    ) : isEnrolled ? (
                      <span className="inline-flex items-center rounded-md bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-100 gap-0.5">
                        <CheckCircle2 className="h-3 w-3" /> Belajar
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-[9px] font-bold text-slate-600">
                        {course.mode.toUpperCase()}
                      </span>
                    )}
                  </div>

                  {/* Title & Desc */}
                  <div className="space-y-1">
                    <Link href={`/dashboard/siswa/courses/${course.id}`}>
                      <h3 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-green-600 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                    </Link>
                    <p className="text-[10px] font-semibold text-slate-500 leading-relaxed line-clamp-2">
                      {course.short_description}
                    </p>
                  </div>

                  {/* Tutor info */}
                  <div className="border-t border-slate-100 pt-3 flex items-center gap-2.5">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-50 text-[10.5px] font-bold text-slate-600 border border-slate-200/60">
                      {course.instructor_name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10.5px] font-bold text-slate-800 truncate leading-tight">
                        {course.instructor_name}
                      </p>
                      <p className="text-[8.5px] font-bold text-slate-400 truncate mt-0.5">
                        {course.instructor_title}
                      </p>
                    </div>
                  </div>

                  {/* Rating, Time, Difficulty Footer */}
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100/60">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-current" />
                      <span>{Number(course.average_rating).toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {course.duration_hours} Jam
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span>•</span>
                      <span className="uppercase tracking-wide text-[8.5px] font-bold">
                        {course.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Pricing & CTA */}
                <div className="px-5 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <p className="text-[8.5px] font-bold text-slate-400 uppercase tracking-wider block">
                      Harga Kelas
                    </p>
                    <span className="text-sm font-black text-slate-800">
                      {course.is_free ? 'GRATIS' : `Rp ${course.price.toLocaleString('id-ID')}`}
                    </span>
                  </div>
                  <Link href={`/dashboard/siswa/courses/${course.id}`}>
                    <Button className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs h-9 px-3 gap-1 rounded-xl shadow-sm cursor-pointer">
                      Detail & Silabus
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
