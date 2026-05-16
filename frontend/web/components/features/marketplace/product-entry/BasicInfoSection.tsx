'use client';

import { Control, Controller } from 'react-hook-form';
import { ProductFormValues } from './schema';
import {
  Field,
  FieldLabel,
  FieldError,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface BasicInfoSectionProps {
  control: Control<ProductFormValues>;
}

export function BasicInfoSection({ control }: BasicInfoSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Informasi Dasar Produk</h2>

      <div className="space-y-5">
        {/* Row 1: Nama Produk & SKU */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Controller
            name="name"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="inline-flex items-center gap-1">
                    Nama Produk
                    <span className="text-destructive">*</span>
                  </span>
                  <span className="text-[10px] font-normal text-muted-foreground bg-slate-100 px-1.5 py-0.5 rounded">
                    {field.value?.length || 0}/150
                  </span>
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Masukkan nama produk"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="sku"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="inline-flex items-center gap-1"
                >
                  SKU / Kode Produk <span className="text-destructive">*</span>
                </FieldLabel>
                <Input
                  {...field}
                  id={field.name}
                  placeholder="Masukkan SKU / kode produk"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Row 2: Kategori & Merek */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Controller
            name="category"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="inline-flex items-center gap-1"
                >
                  Kategori <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pupuk">Pupuk</SelectItem>
                    <SelectItem value="benih">Benih</SelectItem>
                    <SelectItem value="pestisida">Pestisida</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="brand"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name}>Merek</FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Pilih merek" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tani_makmur">Tani Makmur</SelectItem>
                    <SelectItem value="hijau_subur">Hijau Subur</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Row 3: Satuan & Tipe Produk */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Controller
            name="unit"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel
                  htmlFor={field.name}
                  className="inline-flex items-center gap-1"
                >
                  Satuan <span className="text-destructive">*</span>
                </FieldLabel>
                <Select
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger
                    id={field.name}
                    aria-invalid={fieldState.invalid}
                    className="w-full"
                  >
                    <SelectValue placeholder="Pilih satuan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kg</SelectItem>
                    <SelectItem value="liter">Liter</SelectItem>
                    <SelectItem value="pcs">Pcs</SelectItem>
                  </SelectContent>
                </Select>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="type"
            control={control}
            render={({ field, fieldState }) => (
              <FieldSet>
                <FieldLegend variant="label">
                  <span className="inline-flex items-center gap-1">
                    Tipe Produk <span className="text-destructive">*</span>
                  </span>
                </FieldLegend>
                <RadioGroup
                  name={field.name}
                  value={field.value}
                  onValueChange={field.onChange}
                  className="mt-2 flex flex-row flex-wrap items-center gap-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="physical"
                      id="type-physical"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel
                      htmlFor="type-physical"
                      className="cursor-pointer text-sm font-normal text-slate-600"
                    >
                      Fisik
                    </FieldLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="digital"
                      id="type-digital"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel
                      htmlFor="type-digital"
                      className="cursor-pointer text-sm font-normal text-slate-600"
                    >
                      Digital
                    </FieldLabel>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="service"
                      id="type-service"
                      aria-invalid={fieldState.invalid}
                    />
                    <FieldLabel
                      htmlFor="type-service"
                      className="cursor-pointer text-sm font-normal text-slate-600"
                    >
                      Layanan
                    </FieldLabel>
                  </div>
                </RadioGroup>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </FieldSet>
            )}
          />
        </div>
      </div>
    </div>
  );
}
