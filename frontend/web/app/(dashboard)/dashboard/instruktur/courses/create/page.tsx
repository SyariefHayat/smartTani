'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { academyService, Course } from '@/services/academy';
import { getStoredAuthUser } from '@/lib/auth-storage';
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ChevronLeft, Save, BookOpen, AlertTriangle, HelpCircle } from 'lucide-react';
import Link from 'next/link';

// Form Validation Schema
const courseSchema = z.object({
  title: z
    .string()
    .min(5, { message: 'Judul minimal 5 karakter.' })
    .max(80, { message: 'Judul maksimal 80 karakter.' }),
  short_description: z
    .string()
    .min(10, { message: 'Deskripsi singkat minimal 10 karakter.' })
    .max(200, { message: 'Deskripsi singkat maksimal 200 karakter.' }),
  description: z.string().min(20, { message: 'Deskripsi lengkap minimal 20 karakter.' }),
  category: z.string().min(1, { message: 'Kategori wajib dipilih.' }),
  difficulty: z.enum(['pemula', 'menengah', 'ahli']),
  mode: z.enum(['online', 'offline', 'blended']),
  duration_hours: z.coerce.number().positive({ message: 'Durasi harus lebih dari 0 jam.' }),
  price: z.coerce.number().nonnegative({ message: 'Harga harus 0 atau lebih.' }),
  is_free: z.boolean().default(true),
  max_students: z.coerce.number().optional(),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function CreateCoursePage() {
  const router = useRouter();
  const user = getStoredAuthUser();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(courseSchema) as any,
    defaultValues: {
      is_free: true,
      price: 0,
      difficulty: 'pemula',
      mode: 'online',
    },
  });

  const isFree = watch('is_free');

  // React to free checkbox changes to auto-reset price
  React.useEffect(() => {
    if (isFree) {
      setValue('price', 0);
    }
  }, [isFree, setValue]);

  const createMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      const courseId = `course-${Date.now()}`;
      const newCourse: Course = {
        id: courseId,
        title: data.title,
        description: data.description,
        short_description: data.short_description,
        category: data.category,
        difficulty: data.difficulty,
        mode: data.mode,
        duration_hours: data.duration_hours,
        instructor_id: user?.id || 'inst-1',
        instructor_name: user?.name || 'Dr. Ir. Heri Susanto',
        instructor_title: 'Pengajar SmartTani',
        price: data.price,
        is_free: data.is_free,
        is_published: false, // Default to draft
        enrolled_count: 0,
        average_rating: 0,
        review_count: 0,
        created_at: new Date().toISOString(),
        modules: [],
      };

      // Mock Local Storage persistence
      const key = `courses-${user?.id}`;
      const existingData = localStorage.getItem(key);
      const courses: Course[] = existingData ? JSON.parse(existingData) : [];
      localStorage.setItem(key, JSON.stringify([...courses, newCourse]));

      // Save initial empty syllabus progress structure as well
      const progKey = `progress-${courseId}-${user?.id}`;
      localStorage.setItem(
        progKey,
        JSON.stringify({
          enrollment: {
            id: `enroll-${Date.now()}`,
            student_id: user?.id || 'siswa-1',
            course_id: courseId,
            status: 'active',
            enrolled_at: new Date().toISOString(),
            progress_percent: 0,
          },
          progress: [],
        })
      );

      return newCourse;
    },
    onSuccess: (newCourse) => {
      toast.success('Kelas draf berhasil dibuat!', {
        description: 'Mengarahkan ke halaman penyusunan modul...',
      });
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
      router.push(`/dashboard/instruktur/courses/${newCourse.id}/modules`);
    },
  });

  const onSubmit = (data: any) => {
    createMutation.mutate(data);
  };

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
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">Buat Kelas Baru 🆕</h1>
        <p className="text-xs font-semibold text-slate-500">
          Susun kurikulum, detail belajar, kategori tanaman, and tentukan beban waktu kelas.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-3">
        {/* Left 2 Columns: Core Form Content */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">
                Detail & Deskripsi Kelas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Title */}
              <div className="space-y-1.5">
                <label htmlFor="title" className="text-xs font-bold text-slate-700">
                  Judul Kelas
                </label>
                <Input
                  id="title"
                  placeholder="Contoh: Budidaya Cabe Hidroponik Skala Ekspor"
                  {...register('title')}
                  className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                />
                {errors.title && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">
                    {errors.title.message?.toString()}
                  </p>
                )}
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label htmlFor="short_description" className="text-xs font-bold text-slate-700">
                  Deskripsi Singkat
                </label>
                <Textarea
                  id="short_description"
                  rows={2}
                  placeholder="Deskripsi singkat yang tampil di kartu katalog (Maks 200 karakter)..."
                  {...register('short_description')}
                  className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl resize-none"
                />
                {errors.short_description && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">
                    {errors.short_description.message?.toString()}
                  </p>
                )}
              </div>

              {/* Full Description */}
              <div className="space-y-1.5">
                <label htmlFor="description" className="text-xs font-bold text-slate-700">
                  Deskripsi Lengkap (Kurikulum & Silabus)
                </label>
                <Textarea
                  id="description"
                  rows={6}
                  placeholder="Detail lengkap apa saja yang akan dipelajari, syarat kelas, and kompetensi lulusan..."
                  {...register('description')}
                  className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl resize-none"
                />
                {errors.description && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">
                    {errors.description.message?.toString()}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Column: Metadata (Kategori, Specs, Price) */}
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">Spesifikasi Kelas</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs font-semibold text-slate-700">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kategori Tanaman / Fokus</label>
                <Select onValueChange={(val) => setValue('category', val)}>
                  <SelectTrigger className="w-full bg-white border-slate-200 text-xs rounded-xl focus:ring-green-500">
                    <SelectValue placeholder="Pilih Kategori..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200 rounded-xl">
                    <SelectItem value="Budidaya" className="text-xs cursor-pointer rounded-lg">
                      Budidaya Pertanian
                    </SelectItem>
                    <SelectItem value="Agroteknologi" className="text-xs cursor-pointer rounded-lg">
                      Agroteknologi & IoT
                    </SelectItem>
                    <SelectItem value="Bisnis Tani" className="text-xs cursor-pointer rounded-lg">
                      Manajemen Bisnis Tani
                    </SelectItem>
                    <SelectItem value="Hama Nabati" className="text-xs cursor-pointer rounded-lg">
                      Proteksi Hama Organik
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-[10px] font-bold text-red-500 mt-1">
                    {errors.category.message?.toString()}
                  </p>
                )}
              </div>

              {/* Difficulty Radio */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Tingkat Kesulitan</label>
                <div className="grid grid-cols-3 gap-2">
                  {['pemula', 'menengah', 'ahli'].map((lvl) => {
                    const activeLvl = watch('difficulty');
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => setValue('difficulty', lvl as any)}
                        className={`py-2 rounded-xl border text-center font-bold text-[10px] uppercase transition-all cursor-pointer ${
                          activeLvl === lvl
                            ? 'border-green-600 bg-green-50/20 text-green-800'
                            : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-500'
                        }`}
                      >
                        {lvl}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mode Radio */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">Mode Belajar</label>
                <div className="grid grid-cols-3 gap-2">
                  {['online', 'offline', 'blended'].map((md) => {
                    const activeMode = watch('mode');
                    return (
                      <button
                        key={md}
                        type="button"
                        onClick={() => setValue('mode', md as any)}
                        className={`py-2 rounded-xl border text-center font-bold text-[10px] uppercase transition-all cursor-pointer ${
                          activeMode === md
                            ? 'border-green-600 bg-green-50/20 text-green-800'
                            : 'border-slate-100 bg-white hover:bg-slate-50 text-slate-500'
                        }`}
                      >
                        {md}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Duration and Max Students */}
              <div className="grid gap-3 grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="duration_hours" className="text-xs font-bold text-slate-700">
                    Durasi (Jam)
                  </label>
                  <Input
                    id="duration_hours"
                    type="number"
                    placeholder="Jam"
                    {...register('duration_hours')}
                    className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                  />
                  {errors.duration_hours && (
                    <p className="text-[10px] font-bold text-red-500 mt-1">
                      {errors.duration_hours.message?.toString()}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="max_students" className="text-xs font-bold text-slate-700">
                    Maks Murid
                  </label>
                  <Input
                    id="max_students"
                    type="number"
                    placeholder="Maksimal"
                    {...register('max_students')}
                    className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                  />
                </div>
              </div>

              {/* Price Panel */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Kelas Gratis</span>
                  <Checkbox
                    id="is_free"
                    checked={isFree}
                    onCheckedChange={(checked) => setValue('is_free', !!checked)}
                    className="border-slate-300 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600 rounded"
                  />
                </div>
                {!isFree && (
                  <div className="space-y-1.5">
                    <label htmlFor="price" className="text-[10px] font-bold text-slate-500">
                      Harga Jual (Rupiah)
                    </label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="Rp"
                      {...register('price')}
                      className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                    />
                    {errors.price && (
                      <p className="text-[10px] font-bold text-red-500 mt-1">
                        {errors.price.message?.toString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t border-slate-100/60 p-4 bg-slate-50/50">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-sm gap-2 py-4 cursor-pointer"
              >
                <Save className="h-4 w-4" />
                Mulai & Tentukan Silabus
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
