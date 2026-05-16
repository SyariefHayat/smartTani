'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Trash2, Info, ArrowRight, CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldLegend,
  FieldSet,
} from '@/components/ui/field';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const productSchema = z.object({
  name: z.string().min(5, 'Nama produk minimal 5 karakter').max(150),
  sku: z.string().min(1, 'SKU wajib diisi'),
  category: z.string().min(1, 'Kategori wajib diisi'),
  brand: z.string().optional(),
  unit: z.string().min(1, 'Satuan wajib diisi'),
  type: z.enum(['physical', 'digital', 'service']),
  shortDescription: z.string().max(200, 'Maksimal 200 karakter'),
  fullDescription: z.string().min(20, 'Deskripsi lengkap minimal 20 karakter'),
  features: z.array(z.string()).min(1, 'Minimal 1 fitur'),
  tags: z.array(z.string()),
  status: z.string(),
  availableDate: z.string(),
  storeName: z.string(),
  sellerType: z.string(),
  warehouseLocation: z.string(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const STEPS = [
  { id: 1, title: 'Informasi Produk' },
  { id: 2, title: 'Detail & Spesifikasi' },
  { id: 3, title: 'Harga & Stok' },
  { id: 4, title: 'Media Produk' },
  { id: 5, title: 'Ringkasan & Terbitkan' },
];

export function ProductEntryForm() {
  const [currentStep] = useState(1);
  const [tags, setTags] = useState<string[]>(['pupuk organik', 'pertanian', 'tanaman pangan']);
  const [features, setFeatures] = useState<string[]>([
    'Meningkatkan hasil panen hingga 20%',
    'Cocok untuk semua jenis tanaman pangan',
  ]);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      sku: '',
      category: '',
      brand: '',
      unit: '',
      type: 'physical',
      shortDescription: '',
      fullDescription: '',
      features: ['Meningkatkan hasil panen hingga 20%', 'Cocok untuk semua jenis tanaman pangan'],
      tags: ['pupuk organik', 'pertanian', 'tanaman pangan'],
      status: 'draft',
      availableDate: '',
      storeName: 'PT. Tani Makmur Official',
      sellerType: 'distributor_resmi',
      warehouseLocation: 'lamongan_jatim',
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    console.log(data);
  };

  const handleAddFeature = () => {
    setFeatures([...features, '']);
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
    form.setValue('features', newFeatures);
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value && !tags.includes(value)) {
        const newTags = [...tags, value];
        setTags(newTags);
        form.setValue('tags', newTags);
        e.currentTarget.value = '';
      }
    }
  };

  const handleRemoveTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    form.setValue('tags', newTags);
  };

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-4">
        {/* Breadcrumbs */}
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/farmer">Marketplace</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Entry Produk</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-bold tracking-tight lg:text-2xl">
              Entry Produk Marketplace
            </h1>
            <p className="text-sm text-muted-foreground">
              Tambahkan produk baru ke marketplace SmartTani.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <Button variant="outline" className="bg-background">
              Batal
            </Button>
            <Button className="bg-green-700 text-white hover:bg-green-800">Simpan Draft</Button>
          </div>
        </div>

        {/* Stepper */}
        <div className="rounded-xl border bg-card p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex min-w-0 items-center gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium transition-colors',
                      currentStep === step.id
                        ? 'border-green-600 bg-green-600 text-white'
                        : currentStep > step.id
                          ? 'border-green-200 bg-green-50 text-green-600'
                          : 'border-slate-200 bg-slate-50 text-slate-400'
                    )}
                  >
                    {currentStep > step.id ? <CheckCircle2 className="h-5 w-5" /> : step.id}
                  </div>
                  <span
                    className={cn(
                      'text-sm font-medium',
                      currentStep === step.id
                        ? 'text-slate-900'
                        : currentStep > step.id
                          ? 'text-slate-700'
                          : 'text-slate-400'
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div
                    className={cn(
                      'hidden h-px flex-1 xl:block',
                      currentStep > step.id ? 'bg-green-200' : 'bg-slate-200'
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 xl:items-stretch xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
          {/* Main Content */}
          <div className="min-w-0 space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col gap-4">
              <Card className="flex-1 rounded-xl">
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Informasi Dasar Produk</h2>

                    <div className="space-y-5">
                      {/* Row 1: Nama Produk & SKU */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Controller
                          name="name"
                          control={form.control}
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
                          control={form.control}
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
                          control={form.control}
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
                          control={form.control}
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
                          control={form.control}
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
                          control={form.control}
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

                    <Controller
                      name="shortDescription"
                      control={form.control}
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
                      control={form.control}
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="flex items-center gap-1 text-sm font-medium">
                          Fitur & Manfaat Produk <Info className="w-3 h-3 text-muted-foreground" />
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-green-600 text-xs hover:text-green-700 hover:bg-green-50"
                          onClick={handleAddFeature}
                        >
                          <Plus className="w-3 h-3 mr-1" /> Tambah Fitur
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 group">
                            <div className="flex items-center justify-center w-6 h-6 bg-slate-100 rounded text-[10px] text-slate-400">
                              :::
                            </div>
                            <Input
                              value={feature}
                              onChange={(e) => handleFeatureChange(idx, e.target.value)}
                              className="h-9 text-sm"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon-xs"
                              className="text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity"
                              onClick={() => handleRemoveFeature(idx)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Tag / Keyword</Label>
                      <div className="space-y-3">
                        <Input
                          placeholder="Tambahkan tag"
                          className="h-9 text-sm"
                          onKeyDown={handleAddTag}
                        />
                        <p className="text-[10px] text-muted-foreground italic">
                          Tekan Enter untuk menambahkan tag
                        </p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="px-2 py-1 bg-slate-100 text-slate-700 font-normal hover:bg-slate-200 border-none"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-1 text-slate-400 hover:text-slate-600 transition-colors"
                              >
                                <Plus className="w-3 h-3 rotate-45" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-3 rounded-xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                <Button type="button" variant="outline" className="px-6">
                  Batal
                </Button>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button type="button" variant="outline" className="px-6">
                    Simpan Draft
                  </Button>
                  <Button
                    type="button"
                    className="gap-2 bg-green-700 px-6 text-white hover:bg-green-800"
                  >
                    Lanjutkan <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="min-w-0">
            <Card className="h-full rounded-xl">
              <CardContent className="flex h-full flex-col space-y-6 pt-6">
                <div className="space-y-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Status Produk
                  </h2>
                  <div className="space-y-4">
                    <Controller
                      name="status"
                      control={form.control}
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
                      control={form.control}
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

                <Separator />

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
                      control={form.control}
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
                      control={form.control}
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
                <Separator />

                <div className="space-y-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Preview Produk
                  </h2>
                  <div className="flex aspect-square flex-col items-center justify-center gap-2 rounded-lg border border-dashed bg-slate-50 p-8 text-center text-muted-foreground">
                    <div className="flex h-16 w-16 items-center justify-center rounded bg-slate-200/50">
                      <Plus className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-xs">Belum ada gambar</p>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                        Nama Produk
                      </p>
                      <p className="text-sm font-medium">-</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                          Kategori
                        </p>
                        <p className="text-sm">-</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                          Harga
                        </p>
                        <p className="text-sm">-</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                          Stok
                        </p>
                        <p className="text-sm">-</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                          Rating
                        </p>
                        <p className="text-sm text-yellow-500">☆☆☆☆☆ (0)</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-[10px] italic text-muted-foreground">
                    Preview akan tersedia setelah semua informasi diisi.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
