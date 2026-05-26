'use client';

import { Control, Controller } from 'react-hook-form';
import { ProductFormValues } from './schema';
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SpecsSectionProps {
  control: Control<ProductFormValues>;
}

export function SpecsSection({ control }: SpecsSectionProps) {
  return (
    <div className="space-y-6 text-slate-900">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Detail & Spesifikasi Produk</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Lengkapi spesifikasi teknis produk Anda untuk memberikan informasi yang lebih akurat
          kepada pembeli.
        </p>
      </div>

      <div className="space-y-5">
        {/* Row 1: Asal Produk & Masa Simpan */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Controller
            name="origin"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className="inline-flex items-center gap-1">
                  Asal Produk <span className="text-destructive">*</span>
                </FieldLabel>
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Pilih asal produk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lokal">Lokal (Dalam Negeri)</SelectItem>
                    <SelectItem value="impor">Impor (Luar Negeri)</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="shelfLife"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className="inline-flex items-center gap-1">
                  Masa Simpan / Kadaluarsa <span className="text-destructive">*</span>
                </FieldLabel>
                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Pilih masa simpan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1_bulan">1 Bulan</SelectItem>
                    <SelectItem value="3_bulan">3 Bulan</SelectItem>
                    <SelectItem value="6_bulan">6 Bulan</SelectItem>
                    <SelectItem value="12_bulan">12 Bulan (1 Tahun)</SelectItem>
                    <SelectItem value="24_bulan">24 Bulan (2 Tahun)</SelectItem>
                    <SelectItem value="selamanya">Tidak Ada Kadaluarsa</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Row 2: Izin Edar / Sertifikasi & Komposisi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Controller
            name="certification"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>
                  Nomor Sertifikasi / Izin Edar (Opsional)
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Contoh: KEMENTAN RI No. XX.XX.XXXX"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription className="text-[10px] italic">
                  Nomor pendaftaran Kementan, Halal, atau izin dinas terkait.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="composition"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Komposisi / Bahan Aktif (Opsional)</FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Contoh: Nitrogen 15%, Fosfat 15%, Kalium 15%"
                  aria-invalid={fieldState.invalid}
                />
                <FieldDescription className="text-[10px] italic">
                  Kandungan aktif kimia atau unsur organik di dalam produk.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Row 3: Petunjuk Penggunaan */}
        <Controller
          name="usageInstructions"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1">
                  Petunjuk Penggunaan <span className="text-destructive">*</span>
                </span>
                <span className="text-[10px] font-normal text-muted-foreground bg-slate-100 px-1.5 py-0.5 rounded">
                  {field.value?.length || 0}/500
                </span>
              </FieldLabel>
              <Textarea
                {...field}
                id={field.name}
                placeholder="Tuliskan petunjuk dan dosis penggunaan produk secara detail bagi pengguna..."
                className="h-28 resize-none text-slate-900"
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription className="text-[10px] italic">
                Instruksi takaran, cara pengaplikasian, dan frekuensi penggunaan untuk hasil
                maksimal.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}
