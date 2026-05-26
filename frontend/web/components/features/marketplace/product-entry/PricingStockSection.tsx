'use client';

import { Control, Controller, useWatch } from 'react-hook-form';
import { ProductFormValues } from './schema';
import { Field, FieldLabel, FieldError, FieldDescription } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface PricingStockSectionProps {
  control: Control<ProductFormValues>;
}

export function PricingStockSection({ control }: PricingStockSectionProps) {
  // Watch the selected unit in real-time to render dynamic suffixes
  const unitName = useWatch({ control, name: 'unit' }) || 'satuan';

  return (
    <div className="space-y-6 text-slate-900">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Harga & Stok Produk</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Atur skema penetapan harga jual produk dan parameter persediaan inventaris gudang Anda.
        </p>
      </div>

      <div className="space-y-5">
        {/* Row 1: Harga Satuan */}
        <Controller
          name="pricePerUnit"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="inline-flex items-center gap-1">
                Harga Jual Satuan <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-sm font-semibold text-slate-400 select-none">
                  Rp
                </span>
                <Input
                  type="number"
                  placeholder="0"
                  className="pl-9 pr-14 h-10 font-medium text-slate-900"
                  id={field.name}
                  value={field.value || ''}
                  onChange={(e) =>
                    field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  aria-invalid={fieldState.invalid}
                />
                <span className="absolute right-3 text-xs text-slate-400 font-medium uppercase select-none">
                  / {unitName}
                </span>
              </div>
              <FieldDescription className="text-[10px] italic">
                Harga jual kotor per satu satuan unit produk sebelum promo atau diskon.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Row 2: Stok Produk & Stok Minimum */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Controller
            name="stock"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className="inline-flex items-center gap-1">
                  Stok Tersedia <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="relative flex items-center">
                  <Input
                    type="number"
                    placeholder="0"
                    className="pr-14 h-10 font-medium text-slate-900"
                    id={field.name}
                    value={field.value || ''}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    aria-invalid={fieldState.invalid}
                  />
                  <span className="absolute right-3 text-xs text-slate-400 font-medium uppercase select-none">
                    {unitName}
                  </span>
                </div>
                <FieldDescription className="text-[10px] italic">
                  Jumlah total stok fisik barang saat ini yang siap dijual.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />

          <Controller
            name="minStock"
            control={control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={field.name} className="inline-flex items-center gap-1">
                  Stok Minimum (Alert Batas Rendah) <span className="text-destructive">*</span>
                </FieldLabel>
                <div className="relative flex items-center">
                  <Input
                    type="number"
                    placeholder="0"
                    className="pr-14 h-10 font-medium text-slate-900"
                    id={field.name}
                    value={field.value || ''}
                    onChange={(e) =>
                      field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                    }
                    aria-invalid={fieldState.invalid}
                  />
                  <span className="absolute right-3 text-xs text-slate-400 font-medium uppercase select-none">
                    {unitName}
                  </span>
                </div>
                <FieldDescription className="text-[10px] italic">
                  Sistem akan mengirim peringatan jika stok produk turun ke batas ini atau lebih
                  rendah.
                </FieldDescription>
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
        </div>

        {/* Row 3: Minimum Pemesanan */}
        <Controller
          name="minOrder"
          control={control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor={field.name} className="inline-flex items-center gap-1">
                Minimum Pemesanan <span className="text-destructive">*</span>
              </FieldLabel>
              <div className="relative flex items-center">
                <Input
                  type="number"
                  placeholder="1"
                  className="pr-14 h-10 font-medium text-slate-900"
                  id={field.name}
                  value={field.value || ''}
                  onChange={(e) =>
                    field.onChange(e.target.value === '' ? '' : Number(e.target.value))
                  }
                  aria-invalid={fieldState.invalid}
                />
                <span className="absolute right-3 text-xs text-slate-400 font-medium uppercase select-none">
                  {unitName}
                </span>
              </div>
              <FieldDescription className="text-[10px] italic">
                Batas jumlah pesanan paling sedikit untuk setiap transaksi pembelian produk ini.
              </FieldDescription>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>
    </div>
  );
}
