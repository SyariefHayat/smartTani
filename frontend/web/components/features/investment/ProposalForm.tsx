'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Loader2, 
  Save, 
  Send, 
  Info, 
  AlertCircle,
  FileUp,
  MapPin,
  TrendingUp,
  Calendar
} from 'lucide-react';

const proposalFormSchema = z.object({
  title: z.string().min(5, 'Judul proposal minimal 5 karakter').max(255),
  commodity: z.string().min(3, 'Komoditas minimal 3 karakter').max(100),
  land_area_ha: z.coerce.number().positive('Luas lahan harus positif'),
  location: z.object({
    province: z.string().min(1, 'Provinsi wajib diisi'),
    city: z.string().min(1, 'Kota/Kabupaten wajib diisi'),
    district: z.string().min(1, 'Kecamatan wajib diisi'),
    full_address: z.string().min(5, 'Alamat lengkap wajib diisi'),
  }),
  funding_needed: z.coerce.number().positive('Dana yang dibutuhkan harus positif'),
  projected_roi_percent: z.coerce.number().min(0, 'Proyeksi ROI tidak boleh negatif'),
  duration_days: z.coerce.number().int().positive('Durasi harus berupa angka positif'),
  harvest_date_estimated: z.string().min(1, 'Tanggal panen wajib diisi'),
  description: z.string().min(20, 'Deskripsi minimal 20 karakter'),
  use_of_funds: z.string().min(10, 'Penggunaan dana minimal 10 karakter'),
  risk_notes: z.string().min(10, 'Catatan risiko minimal 10 karakter'),
});

export type ProposalFormValues = z.infer<typeof proposalFormSchema>;

interface ProposalFormProps {
  onSubmit: (values: ProposalFormValues, type: 'draft' | 'submit') => void;
  isSubmitting: boolean;
  defaultValues?: Partial<ProposalFormValues>;
}

export function ProposalForm({ onSubmit, isSubmitting, defaultValues }: ProposalFormProps) {
  const form = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      title: '',
      commodity: '',
      land_area_ha: 0,
      location: {
        province: '',
        city: '',
        district: '',
        full_address: '',
      },
      funding_needed: 0,
      projected_roi_percent: 0,
      duration_days: 0,
      harvest_date_estimated: '',
      description: '',
      use_of_funds: '',
      risk_notes: '',
      ...defaultValues,
    },
  });

  const handleAction = (type: 'draft' | 'submit') => {
    // For draft we might want to bypass validation, but for Q1 
    // let's just use the same validation or a relaxed one.
    // The requirement says "Petani bisa buat dan submit".
    form.handleSubmit((values) => onSubmit(values, type))();
  };

  return (
    <Form {...form}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8 pb-20">
          {/* Informasi Dasar */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-green-600" />
                Informasi Dasar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Proposal</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Budidaya Padi Organik Cianjur Tahap 1" {...field} />
                    </FormControl>
                    <FormDescription>Gunakan judul yang menarik bagi investor</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="commodity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Komoditas</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: Padi, Jagung, Cabai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="land_area_ha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Luas Lahan (Hektar)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Lokasi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-green-600" />
                Lokasi Proyek
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="location.province"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provinsi</FormLabel>
                      <FormControl>
                        <Input placeholder="Jawa Barat" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kota/Kabupaten</FormLabel>
                      <FormControl>
                        <Input placeholder="Cianjur" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location.district"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kecamatan</FormLabel>
                      <FormControl>
                        <Input placeholder="Cugenang" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="location.full_address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Alamat Lengkap Lahan</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Jl. Raya Cugenang No. 123..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Target & ROI */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                Target Pendanaan & ROI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="funding_needed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dana yang Dibutuhkan (Rp)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="projected_roi_percent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Proyeksi ROI (%)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.1" {...field} />
                      </FormControl>
                      <FormDescription>Estimasi bagi hasil untuk investor</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="duration_days"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Durasi Proyek (Hari)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="harvest_date_estimated"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimasi Tanggal Panen</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Detail Proyek */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Detail Proyek
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi Proyek</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Jelaskan secara mendalam tentang proyek Anda..." 
                        className="min-h-[150px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="use_of_funds"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Penggunaan Dana</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Rincian alokasi dana (bibit, pupuk, tenaga kerja, dll)..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="risk_notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Analisis Risiko</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Apa saja risiko yang mungkin terjadi dan mitigasinya?" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Dokumen Pendukung */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-green-600" />
                Dokumen Pendukung (PDF)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50">
                <FileUp className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-sm text-gray-600">Klik untuk upload atau drag & drop file PDF</p>
                <p className="text-xs text-gray-400 mt-1">Sertifikat tanah, izin usaha, atau profil kelompok tani</p>
                <Button variant="outline" size="sm" className="mt-4" type="button">
                  Pilih File
                </Button>
                {/* File handling omitted for Q1 simplicity as per PRD logic, UI only */}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-start-3">
          <Card className="sticky top-24 border-green-100 bg-green-50/20">
            <CardHeader>
              <CardTitle className="text-lg">Aksi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white p-3 rounded-lg border border-yellow-200 flex gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-800 leading-relaxed">
                  Setelah disubmit, proposal akan direview oleh Admin dalam 1-3 hari kerja sebelum dibuka untuk pendanaan.
                </p>
              </div>
              
              <Button 
                type="button"
                variant="outline" 
                className="w-full h-11 border-green-600 text-green-700 hover:bg-green-50"
                onClick={() => handleAction('draft')}
                disabled={isSubmitting}
              >
                <Save className="w-4 h-4 mr-2" />
                Simpan Draft
              </Button>
              <Button 
                type="button"
                className="w-full h-11 bg-green-600 hover:bg-green-700 font-bold"
                onClick={() => handleAction('submit')}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Submit ke Admin
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Form>
  );
}
