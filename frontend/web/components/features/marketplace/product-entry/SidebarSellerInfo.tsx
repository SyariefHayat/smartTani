'use client';

import { Control, Controller } from 'react-hook-form';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductFormValues } from './schema';

interface SidebarSellerInfoProps {
  control: Control<ProductFormValues>;
}

export function SidebarSellerInfo({ control }: SidebarSellerInfoProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Informasi Penjual
      </h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="inline-flex items-center gap-1 text-xs">
            Nama Toko <span className="text-destructive">*</span>
          </Label>
          <Input
            value="PT. Tani Makmur Official"
            readOnly
            className="h-9 bg-slate-50 border-slate-200"
          />
        </div>

        <Controller
          name="sellerType"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-xs" htmlFor={field.name}>
                Jenis Penjual
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id={field.name}
                  className="h-9"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="distributor_resmi">Distributor Resmi</SelectItem>
                  <SelectItem value="petani_mandiri">Petani Mandiri</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="warehouseLocation"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                className="inline-flex items-center gap-1 text-xs"
                htmlFor={field.name}
              >
                Lokasi Gudang <span className="text-destructive">*</span>
              </FieldLabel>
              <Select
                name={field.name}
                value={field.value}
                onValueChange={field.onChange}
              >
                <SelectTrigger
                  id={field.name}
                  className="h-9"
                  aria-invalid={fieldState.invalid}
                >
                  <SelectValue placeholder="Pilih lokasi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lamongan_jatim">Lamongan, Jawa Timur</SelectItem>
                  <SelectItem value="malang_jatim">Malang, Jawa Timur</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}
