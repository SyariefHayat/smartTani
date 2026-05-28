'use client';
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any */

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { academyService, Course, Module } from '@/services/academy';
import { instructorService } from '@/services/instructor';
import { getStoredAuthUser } from '@/lib/auth-storage';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ChevronLeft, Save, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditCoursePage({ params }: PageProps) {
  const router = useRouter();
  const { id } = React.use(params);
  const user = getStoredAuthUser();
  const queryClient = useQueryClient();
  const [isOffline, setIsOffline] = React.useState(false);

  // Form Hook
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(courseSchema) as any,
  });

  const { data: course, isLoading } = useQuery<Course | null>({
    queryKey: ['instructor-edit-course', id, user?.id],
    queryFn: async () => {
      try {
        const res = await academyService.getCourseById(id);
        return res;
      } catch {
        setIsOffline(true);
        const key = `courses-${user?.id}`;
        const courses = JSON.parse(localStorage.getItem(key) || '[]');
        const found = courses.find((c: any) => c.id === id);
        return found || null;
      }
    },
  });

  React.useEffect(() => {
    if (course) {
      reset({
        title: course.title,
        short_description: course.short_description,
        description: course.description,
        category: course.category,
        difficulty: course.difficulty as any,
        mode: course.mode as any,
        duration_hours: course.duration_hours,
        price: course.price,
        is_free: course.is_free,
        max_students: course.max_students,
      });
    }
  }, [course, reset]);

  const isFree = watch('is_free');

  React.useEffect(() => {
    if (isFree) {
      setValue('price', 0);
    }
  }, [isFree, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      // Offline fallback persist logic
      const key = `courses-${user?.id}`;
      const courses: Course[] = JSON.parse(localStorage.getItem(key) || '[]');
      const updated = courses.map((c) =>
        c.id === id
          ? {
              ...c,
              title: data.title,
              description: data.description,
              short_description: data.short_description,
              category: data.category,
              difficulty: data.difficulty,
              mode: data.mode,
              duration_hours: data.duration_hours,
              price: data.price,
              is_free: data.is_free,
              max_students: data.max_students,
            }
          : c
      );
      localStorage.setItem(key, JSON.stringify(updated));
      queryClient.setQueryData(
        ['instructor-edit-course', id, user?.id],
        updated.find((c) => c.id === id)
      );
      return updated;
    },
    onSuccess: () => {
      toast.success('Kelas berhasil diperbarui!');
      queryClient.invalidateQueries({ queryKey: ['instructor-courses'] });
      router.push('/dashboard/instruktur/courses');
    },
  });

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
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

  if (!course) {
    return (
      <div className="w-full text-center py-20">
        <h3 className="text-sm font-bold text-slate-700">Kelas Tidak Ditemukan</h3>
        <Button
          onClick={() => router.push('/dashboard/instruktur/courses')}
          size="sm"
          className="mt-4 bg-green-600 text-white rounded-xl"
        >
          Kembali ke Daftar
        </Button>
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
          Edit Kelas: {course.title} ✏️
        </h1>
        <p className="text-xs font-semibold text-slate-500">
          Perbarui deskripsi, spec durasi belajar, kategori, and tarif kelas Anda.
        </p>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-800">Modus Simulasi Luring Aktif</h4>
            <p className="text-[11px] font-semibold text-amber-600 mt-0.5">
              Academy Service sedang tidak terhubung. Perubahan Anda akan disimpan di database lokal
              browser.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 md:grid-cols-3">
        {/* Left Form Content */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">
                Rincian Informasi Utama
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
                  placeholder="Masukkan judul baru..."
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
                  placeholder="Ringkasan katalog..."
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
                  Silabus & Materi Kurikulum Lengkap
                </label>
                <Textarea
                  id="description"
                  rows={6}
                  placeholder="Jelaskan secara mendalam tentang program kelas..."
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

        {/* Right Metadata Column */}
        <div className="space-y-6">
          <Card className="border-slate-200 bg-white rounded-2xl shadow-sm">
            <CardHeader className="pb-4 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-800">Spesifikasi</CardTitle>
            </CardHeader>
            <CardContent className="p-5 space-y-4 text-xs font-semibold text-slate-700">
              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Kategori</label>
                <Select
                  value={watch('category')}
                  onValueChange={(val) => setValue('category', val)}
                >
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

              {/* Difficulty Buttons */}
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

              {/* Mode Buttons */}
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

              {/* Specs */}
              <div className="grid gap-3 grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="duration_hours" className="text-xs font-bold text-slate-700">
                    Durasi (Jam)
                  </label>
                  <Input
                    id="duration_hours"
                    type="number"
                    {...register('duration_hours')}
                    className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="max_students" className="text-xs font-bold text-slate-700">
                    Maks Murid
                  </label>
                  <Input
                    id="max_students"
                    type="number"
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
                      Harga Jual
                    </label>
                    <Input
                      id="price"
                      type="number"
                      {...register('price')}
                      className="bg-white border-slate-200 text-xs font-semibold focus:ring-green-500 rounded-xl"
                    />
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
                Simpan Pembaruan Kelas
              </Button>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  );
}
