'use client';

import { Control, Controller } from 'react-hook-form';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ProductFormValues } from './schema';

interface SidebarStatusProps {
  control: Control<ProductFormValues>;
}

export function SidebarStatus({ control }: SidebarStatusProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        Status Produk
      </h2>
      <div className="space-y-4">
        <Controller
          name="status"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel
                className="inline-flex items-center gap-1 text-xs"
                htmlFor={field.name}
              >
                Status <span className="text-destructive">*</span>
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
                  <div className="flex items-center gap-2 text-slate-900">
                    <Circle
                      className={cn(
                        'w-2 h-2 fill-current',
                        field.value === 'published'
                          ? 'text-green-500'
                          : 'text-yellow-400'
                      )}
                    />
                    <SelectValue placeholder="Pilih status" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Publish</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription className="text-[10px] italic">
                Produk belum akan ditampilkan ke marketplace.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="availableDate"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-xs" htmlFor={field.name}>
                Tanggal Tersedia
              </FieldLabel>
              <Input
                {...field}
                id={field.name}
                type="date"
                className="h-9"
                aria-invalid={fieldState.invalid}
              />
              <FieldDescription className="text-[10px] italic">
                Kosongkan jika ingin segera tersedia.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}
