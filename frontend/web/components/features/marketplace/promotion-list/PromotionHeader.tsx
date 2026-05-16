'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

export function PromotionHeader() {
  return (
    <div className="space-y-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard/farmer">Marketplace</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Promo & Diskon</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight lg:text-2xl">Promo & Diskon</h1>
          <p className="text-sm text-muted-foreground">
            Kelola kampanye pemasaran dan kupon diskon Anda.
          </p>
        </div>
        <Button className="w-full bg-green-700 text-white hover:bg-green-800 sm:w-auto">
          <Plus className="mr-2 h-4 w-4" /> Buat Promo Baru
        </Button>
      </div>
    </div>
  );
}
