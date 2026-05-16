'use client';

import { Control, Controller } from 'react-hook-form';
import { ProductFormValues } from './schema';
import {
  Field,
  FieldLabel,
  FieldError,
} from '@/components/ui/field';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

interface DescriptionSectionProps {
  control: Control<ProductFormValues>;
}

export function DescriptionSection({ control }: DescriptionSectionProps) {
  return (
    <div className="space-y-4">
      <Controller
        name="shortDescription"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel
              htmlFor={field.name}
              className="flex items-center justify-between gap-3"
            >
              <span className="inline-flex items-center gap-1">
                Deskripsi Singkat
                <span className="text-destructive">*</span>
              </span>
              <span className="text-[10px] font-normal text-muted-foreground">
                {field.value?.length || 0}/200
              </span>
            </FieldLabel>
            <Textarea
              {...field}
              id={field.name}
              placeholder="Tulis deskripsi singkat produk (maks. 200 karakter)"
              className="h-20 resize-none"
              aria-invalid={fieldState.invalid}
            />
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="fullDescription"
        control={control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Deskripsi Lengkap</FieldLabel>
            <div className="border rounded-md overflow-hidden mt-1.5">
              <div className="flex items-center gap-1 p-2 border-b bg-slate-50">
                <Select defaultValue="normal">
                  <SelectTrigger className="w-24 h-8 text-xs border-none shadow-none bg-transparent">
                    <SelectValue placeholder="Normal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="h1">Heading 1</SelectItem>
                  </SelectContent>
                </Select>
                <Separator orientation="vertical" className="h-4 mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="font-bold"
                >
                  B
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="italic"
                >
                  I
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="underline"
                >
                  U
                </Button>
              </div>
              <Textarea
                {...field}
                id={field.name}
                placeholder="Tulis deskripsi lengkap tentang produk..."
                className="border-none focus-visible:ring-0 min-h-50 resize-none"
                aria-invalid={fieldState.invalid}
              />
              <div className="flex justify-between items-center p-2 bg-slate-50 text-[10px] text-muted-foreground border-t">
                <span>0 kata | Didukung Markdown</span>
              </div>
            </div>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
    </div>
  );
}
