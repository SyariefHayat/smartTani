'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { marketplaceService } from '@/services/marketplace';
import Image from 'next/image';

import { productSchema, ProductFormValues } from './product-entry/schema';
import { EntryHeader } from './product-entry/EntryHeader';
import { EntryStepper } from './product-entry/EntryStepper';
import { BasicInfoSection } from './product-entry/BasicInfoSection';
import { DescriptionSection } from './product-entry/DescriptionSection';
import { FeaturesTagsSection } from './product-entry/FeaturesTagsSection';
import { SpecsSection } from './product-entry/SpecsSection';
import { PricingStockSection } from './product-entry/PricingStockSection';
import { MediaSection } from './product-entry/MediaSection';
import { EntryFooter } from './product-entry/EntryFooter';
import { SidebarStatus } from './product-entry/SidebarStatus';
import { SidebarSellerInfo } from './product-entry/SidebarSellerInfo';
import { SidebarPreview } from './product-entry/SidebarPreview';

export function ProductEntryForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const queryClient = useQueryClient();
  const { isError: isMarketplaceOffline } = useQuery({
    queryKey: ['categories-health'],
    queryFn: () => marketplaceService.getCategories(),
    retry: 1,
  });

  useEffect(() => {
    if (isMarketplaceOffline) {
      toast.error('Gagal menghubungkan ke layanan marketplace. Koneksi terputus.');
    }
  }, [isMarketplaceOffline]);

  const handleRetry = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    queryClient.invalidateQueries({ queryKey: ['brands'] });
    queryClient.invalidateQueries({ queryKey: ['categories-health'] });
  };

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
      // Step 2: Detail & Spesifikasi
      origin: 'lokal',
      shelfLife: '12_bulan',
      composition: 'Nitrogen 15%, Fosfat 15%, Kalium 15%',
      usageInstructions:
        'Larutkan 10 gram ke dalam 1 liter air, lalu semprotkan secara merata pada pangkal tanaman setiap 2 minggu sekali.',
      certification: 'KEMENTAN RI No. 01.02.2023.123',
      // Step 3: Harga & Stok
      pricePerUnit: 15000,
      stock: 100,
      minStock: 10,
      minOrder: 1,
      // Step 4: Media Produk
      images: [],
    },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const values = form.watch();

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const payload = {
        title: data.name,
        description: data.fullDescription || data.shortDescription,
        category: data.category,
        price_per_unit: data.pricePerUnit,
        unit: data.unit,
        stock: data.stock,
        min_stock: data.minStock,
        min_order: data.minOrder,
        location: {
          province: 'Jawa Timur',
          city: 'Lamongan',
        },
        images: data.images || [],
        status: 'active',
        search_text: `${data.name} ${data.category}`.toLowerCase(),
      };
      await marketplaceService.createProduct(payload);
      toast.success('Produk berhasil diterbitkan!');
      router.push('/dashboard/farmer/products');
    } catch (error) {
      console.error(error);
      toast.error('Gagal menerbitkan produk.');
    }
  };

  const handleSaveDraft = async () => {
    const nameValue = form.getValues('name');
    if (!nameValue || nameValue.trim().length < 5) {
      form.setError('name', {
        type: 'manual',
        message: 'Nama produk minimal 5 karakter wajib diisi untuk menyimpan draft',
      });
      toast.error('Nama produk wajib diisi untuk menyimpan draft!');
      return;
    }

    try {
      setIsSavingDraft(true);
      const values = form.getValues();
      const payload = {
        title: values.name,
        description: values.fullDescription || values.shortDescription || 'Deskripsi draft',
        category: values.category || 'Lainnya',
        price_per_unit: values.pricePerUnit || 1,
        unit: values.unit || 'pcs',
        stock: values.stock || 0,
        min_stock: values.minStock || 10,
        min_order: values.minOrder || 1,
        location: {
          province: 'Jawa Timur',
          city: 'Lamongan',
        },
        images: values.images || [],
        status: 'pending',
        search_text: `${values.name} ${values.category || ''}`.toLowerCase(),
      };

      await marketplaceService.createProduct(payload);
      toast.success('Produk berhasil disimpan sebagai draft!');
      router.push('/dashboard/farmer/products');
    } catch (error) {
      console.error(error);
      toast.error('Gagal menyimpan draft produk.');
    } finally {
      setIsSavingDraft(false);
    }
  };

  const handleNextStep = async () => {
    let isValid = false;
    if (currentStep === 1) {
      isValid = await form.trigger([
        'name',
        'sku',
        'category',
        'brand',
        'unit',
        'type',
        'shortDescription',
        'fullDescription',
        'features',
        'tags',
      ]);
    } else if (currentStep === 2) {
      isValid = await form.trigger(['origin', 'shelfLife', 'usageInstructions']);
    } else if (currentStep === 3) {
      isValid = await form.trigger(['pricePerUnit', 'stock', 'minStock', 'minOrder']);
    } else if (currentStep === 4) {
      isValid = await form.trigger(['images']);
    } else {
      isValid = true;
    }

    if (isValid) {
      if (currentStep < 5) {
        setCurrentStep((prev) => prev + 1);
      } else {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  const handleBackStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-4">
        <EntryHeader />
        <EntryStepper currentStep={currentStep} />

        <div className="grid grid-cols-1 gap-4 xl:items-stretch xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
          {/* Main Content */}
          <div className="min-w-0 space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className="flex h-full flex-col gap-4"
            >
              <Card className="flex-1 rounded-xl">
                <CardContent className="space-y-6 pt-6">
                  {currentStep === 1 && (
                    <>
                      {isMarketplaceOffline ? (
                        <div className="space-y-4">
                          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                            Gagal memuat data Informasi Dasar / Koneksi ke server terputus
                          </div>
                          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                            Gagal memuat data Deskripsi / Koneksi ke server terputus
                          </div>
                          <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                            Gagal memuat data Fitur & Tag / Koneksi ke server terputus
                          </div>
                        </div>
                      ) : (
                        <>
                          <BasicInfoSection control={form.control} />
                          <DescriptionSection control={form.control} />
                          <FeaturesTagsSection form={form} />
                        </>
                      )}
                    </>
                  )}

                  {currentStep === 2 &&
                    (isMarketplaceOffline ? (
                      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                        Gagal memuat data Spesifikasi / Koneksi ke server terputus
                      </div>
                    ) : (
                      <SpecsSection control={form.control} />
                    ))}

                  {currentStep === 3 &&
                    (isMarketplaceOffline ? (
                      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                        Gagal memuat data Harga & Stok / Koneksi ke server terputus
                      </div>
                    ) : (
                      <PricingStockSection control={form.control} />
                    ))}

                  {currentStep === 4 &&
                    (isMarketplaceOffline ? (
                      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                        Gagal memuat data Media Produk / Koneksi ke server terputus
                      </div>
                    ) : (
                      <MediaSection form={form} />
                    ))}

                  {currentStep === 5 &&
                    (isMarketplaceOffline ? (
                      <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                        Gagal memuat data Ringkasan / Koneksi ke server terputus
                      </div>
                    ) : (
                      <div className="space-y-6 text-slate-800">
                        <div className="border-b pb-4">
                          <h3 className="text-lg font-bold text-slate-900">
                            Ringkasan & Terbitkan
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            Tinjau kembali seluruh informasi produk Anda sebelum dipublikasikan ke
                            marketplace.
                          </p>
                        </div>

                        <div className="space-y-6">
                          {/* Section 1: Basic Info */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-emerald-700 border-l-2 border-emerald-500 pl-2">
                              1. Informasi Produk
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm">
                              <div>
                                <span className="text-muted-foreground block text-xs">
                                  Nama Produk
                                </span>
                                <span className="font-semibold text-slate-900">
                                  {values.name || '-'}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-xs">SKU</span>
                                <span className="font-mono font-semibold text-slate-900">
                                  {values.sku || '-'}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-xs">
                                  Kategori
                                </span>
                                <span className="font-medium text-slate-900">
                                  {values.category || '-'}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-xs">
                                  Merk/Brand
                                </span>
                                <span className="font-medium text-slate-900">
                                  {values.brand || '-'}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-xs">
                                  Satuan Penjualan
                                </span>
                                <span className="font-medium text-slate-900">
                                  {values.unit || '-'}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-xs">
                                  Tipe Produk
                                </span>
                                <span className="font-medium text-slate-900 uppercase">
                                  {values.type || '-'}
                                </span>
                              </div>
                              <div className="col-span-full">
                                <span className="text-muted-foreground block text-xs">
                                  Deskripsi Singkat
                                </span>
                                <span className="text-slate-700">
                                  {values.shortDescription || '-'}
                                </span>
                              </div>
                              <div className="col-span-full">
                                <span className="text-muted-foreground block text-xs">
                                  Deskripsi Lengkap
                                </span>
                                <span className="text-slate-700 whitespace-pre-wrap">
                                  {values.fullDescription || '-'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Section 2: Specs */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-emerald-700 border-l-2 border-emerald-500 pl-2">
                              2. Detail & Spesifikasi
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm">
                              <div>
                                <span className="text-muted-foreground block text-xs">
                                  Asal Produk
                                </span>
                                <span className="font-medium text-slate-900 capitalize">
                                  {values.origin || '-'}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-xs">
                                  Masa Simpan
                                </span>
                                <span className="font-medium text-slate-900 capitalize">
                                  {values.shelfLife?.replace('_', ' ') || '-'}
                                </span>
                              </div>
                              <div className="col-span-full">
                                <span className="text-muted-foreground block text-xs">
                                  Komposisi
                                </span>
                                <span className="text-slate-700">{values.composition || '-'}</span>
                              </div>
                              <div className="col-span-full">
                                <span className="text-muted-foreground block text-xs">
                                  Petunjuk Penggunaan
                                </span>
                                <span className="text-slate-700 whitespace-pre-wrap">
                                  {values.usageInstructions || '-'}
                                </span>
                              </div>
                              <div className="col-span-full">
                                <span className="text-muted-foreground block text-xs">
                                  Sertifikasi
                                </span>
                                <span className="text-slate-700">
                                  {values.certification || '-'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Section 3: Pricing & Stock */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-emerald-700 border-l-2 border-emerald-500 pl-2">
                              3. Harga & Stok
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100 text-sm">
                              <div>
                                <span className="text-muted-foreground block text-xs">
                                  Harga per Satuan
                                </span>
                                <span className="font-bold text-slate-900">
                                  {values.pricePerUnit
                                    ? `Rp ${values.pricePerUnit.toLocaleString('id-ID')}`
                                    : '-'}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-xs">
                                  Stok Awal
                                </span>
                                <span className="font-bold text-slate-900">
                                  {values.stock ?? 0} {values.unit}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-xs">
                                  Stok Minimum
                                </span>
                                <span className="font-bold text-slate-900">
                                  {values.minStock ?? 0} {values.unit}
                                </span>
                              </div>
                              <div>
                                <span className="text-muted-foreground block text-xs">
                                  Min. Order
                                </span>
                                <span className="font-bold text-slate-900">
                                  {values.minOrder ?? 1} {values.unit}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Section 4: Media */}
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-emerald-700 border-l-2 border-emerald-500 pl-2">
                              4. Foto Produk
                            </h4>
                            {values.images && values.images.length > 0 ? (
                              <div className="flex flex-wrap gap-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
                                {values.images.map((imgUrl: string, idx: number) => (
                                  <div
                                    key={idx}
                                    className="relative h-20 w-20 rounded-md border border-slate-200 overflow-hidden bg-white"
                                  >
                                    <Image
                                      src={imgUrl}
                                      alt={`Product ${idx}`}
                                      fill
                                      unoptimized
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs p-3 rounded-md">
                                Belum ada foto produk yang diunggah.
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-4 text-emerald-950 text-xs flex gap-3 items-start">
                          <span className="text-emerald-500 text-base font-bold mt-0.5">ℹ</span>
                          <div className="space-y-1">
                            <h5 className="font-semibold text-emerald-900">Siap Diterbitkan</h5>
                            <p className="text-emerald-800 leading-relaxed">
                              Pastikan kembali seluruh data di atas sudah valid. Jika produk
                              diterbitkan, status produk akan menjadi <strong>Aktif</strong> dan
                              pembeli dapat langsung memesannya di marketplace SmartTani.
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                </CardContent>
              </Card>
              <EntryFooter
                currentStep={currentStep}
                totalSteps={5}
                onNext={handleNextStep}
                onBack={handleBackStep}
                onSaveDraft={handleSaveDraft}
                isSubmitting={form.formState.isSubmitting || isSavingDraft || isMarketplaceOffline}
              />
            </form>
          </div>

          {/* Sidebar */}
          <div className="min-w-0">
            <Card className="h-full rounded-xl">
              <CardContent className="flex h-full flex-col space-y-6 pt-6">
                {isMarketplaceOffline ? (
                  <>
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                      Gagal memuat data Status / Koneksi ke server terputus
                    </div>
                    <Separator />
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                      Gagal memuat data Informasi Penjual / Koneksi ke server terputus
                    </div>
                    <Separator />
                    <div className="flex h-32 items-center justify-center rounded-lg border border-dashed border-red-200 bg-red-50 text-red-500 font-semibold text-sm">
                      Gagal memuat data Pratinjau / Koneksi ke server terputus
                    </div>
                  </>
                ) : (
                  <>
                    <SidebarStatus control={form.control} />
                    <Separator />
                    <SidebarSellerInfo control={form.control} />
                    <Separator />
                    <SidebarPreview control={form.control} />
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
