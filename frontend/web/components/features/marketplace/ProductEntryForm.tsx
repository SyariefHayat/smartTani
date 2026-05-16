'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { productSchema, ProductFormValues } from './product-entry/schema';
import { EntryHeader } from './product-entry/EntryHeader';
import { EntryStepper } from './product-entry/EntryStepper';
import { BasicInfoSection } from './product-entry/BasicInfoSection';
import { DescriptionSection } from './product-entry/DescriptionSection';
import { FeaturesTagsSection } from './product-entry/FeaturesTagsSection';
import { EntryFooter } from './product-entry/EntryFooter';
import { SidebarStatus } from './product-entry/SidebarStatus';
import { SidebarSellerInfo } from './product-entry/SidebarSellerInfo';
import { SidebarPreview } from './product-entry/SidebarPreview';

export function ProductEntryForm() {
  const [currentStep] = useState(1);

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

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-4">
        <EntryHeader />
        <EntryStepper currentStep={currentStep} />

        <div className="grid grid-cols-1 gap-4 xl:items-stretch xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
          {/* Main Content */}
          <div className="min-w-0 space-y-4">
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex h-full flex-col gap-4">
              <Card className="flex-1 rounded-xl">
                <CardContent className="space-y-6 pt-6">
                  <BasicInfoSection control={form.control} />
                  <DescriptionSection control={form.control} />
                  <FeaturesTagsSection form={form} />
                </CardContent>
              </Card>
              <EntryFooter />
            </form>
          </div>

          {/* Sidebar */}
          <div className="min-w-0">
            <Card className="h-full rounded-xl">
              <CardContent className="flex h-full flex-col space-y-6 pt-6">
                <SidebarStatus control={form.control} />
                <Separator />
                <SidebarSellerInfo control={form.control} />
                <Separator />
                <SidebarPreview />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
