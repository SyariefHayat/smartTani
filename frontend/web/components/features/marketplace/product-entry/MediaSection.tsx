'use client';

import { useState, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProductFormValues } from './schema';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { UploadCloud, Trash2, Star, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface MediaSectionProps {
  form: UseFormReturn<ProductFormValues>;
}

export function MediaSection({ form }: MediaSectionProps) {
  const [images, setImages] = useState<string[]>(form.getValues('images') || []);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      const updated = [...images, ...newImages];
      setImages(updated);
      form.setValue('images', updated, { shouldValidate: true });
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    form.setValue('images', updated, { shouldValidate: true });
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    const updated = [...images];
    const item = updated.splice(index, 1)[0];
    updated.unshift(item);
    setImages(updated);
    form.setValue('images', updated, { shouldValidate: true });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
      const updated = [...images, ...newImages];
      setImages(updated);
      form.setValue('images', updated, { shouldValidate: true });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const errors = form.formState.errors;

  return (
    <div className="space-y-6 text-slate-900">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Media & Foto Produk</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Unggah foto produk terbaik Anda. Format gambar yang didukung adalah JPG, PNG, dan WEBP
          (Maksimal 5MB).
        </p>
      </div>

      <div className="space-y-4">
        {/* Upload Container */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={cn(
            'flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 select-none min-h-56 bg-slate-50/50',
            isDragActive
              ? 'border-green-600 bg-green-50/30'
              : errors.images
                ? 'border-destructive bg-destructive/5'
                : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300'
          )}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
            accept="image/*"
            className="hidden"
          />
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500 mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="h-6 w-6 text-slate-500" />
          </div>
          <p className="text-sm font-medium text-slate-800">
            Tarik & lepas file foto di sini, atau{' '}
            <span className="text-green-600 hover:text-green-700 underline font-semibold">
              klik untuk memilih
            </span>
          </p>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            Dianjurkan menggunakan foto berukuran minimal 800x800 px dengan rasio 1:1.
          </p>
        </div>

        {/* Validation Error Message */}
        {errors.images && (
          <div className="flex items-center gap-1.5 text-xs text-destructive mt-1 font-medium bg-destructive/5 p-2 rounded-md border border-destructive/10">
            <AlertCircle className="w-4 h-4" />
            <span>{errors.images.message}</span>
          </div>
        )}

        {/* Thumbnail Preview Grid */}
        {images.length > 0 && (
          <div className="space-y-3 pt-2">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Daftar Foto Terunggah ({images.length})
            </Label>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {images.map((imgUrl, index) => (
                <div
                  key={index}
                  className={cn(
                    'group relative aspect-square rounded-lg border overflow-hidden bg-slate-50 transition-all duration-150',
                    index === 0 ? 'border-green-500 ring-2 ring-green-500/20' : 'border-slate-200'
                  )}
                >
                  <Image
                    src={imgUrl}
                    alt={`Product preview ${index + 1}`}
                    fill
                    unoptimized
                    className="object-cover"
                  />

                  {/* Primary Photo Badge */}
                  {index === 0 ? (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 rounded bg-green-600 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-sm">
                      <Star className="h-2.5 w-2.5 fill-current text-white" /> Foto Utama
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleSetCover(index)}
                      className="absolute top-2 left-2 hidden group-hover:inline-flex items-center gap-1 rounded bg-slate-900/80 px-1.5 py-0.5 text-[9px] font-medium text-white hover:bg-slate-950 transition-colors shadow-sm"
                    >
                      Jadikan Utama
                    </button>
                  )}

                  {/* Action Buttons overlay */}
                  <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => handleRemoveImage(index)}
                      className="h-8 w-8 rounded-full bg-white text-destructive hover:bg-red-50 shadow-md hover:text-destructive active:scale-95 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
