"use client";

import React, { useState } from 'react';
import { 
  Sprout, 
  FlaskConical, 
  Bug, 
  Wrench, 
  Droplets, 
  Beef, 
  Wheat, 
  MoreHorizontal,
  Star,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { 
  MARKETPLACE_KATEGORI_SIDEBAR, 
  MARKETPLACE_FILTER 
} from '@/constants/marketplace';
import { FilterSection } from '@/components/ui/FilterSection';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/StarRating';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';
import MitraBannerSection from './MitraBannerSection';

const categoryIcons: Record<string, any> = {
  "Benih & Bibit": Sprout,
  "Pupuk & Nutrisi": FlaskConical,
  "Pestisida": Bug,
  "Alat & Mesin": Wrench,
  "Irigasi": Droplets,
  "Pakan Ternak": Beef,
  "Hasil Panen": Wheat,
  "Lainnya": MoreHorizontal,
};

interface SidebarFilterProps {
  className?: string;
  onClose?: () => void;
}

const SidebarFilter: React.FC<SidebarFilterProps> = ({ className, onClose }) => {
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const handleReset = () => {
    setPriceRange([0, 10000000]);
    setActiveCategory(null);
  };

  const formatPrice = (value: number) => {
    if (value >= 10000000) return "Rp 10.000.000+";
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <aside className={cn("bg-white rounded-xl border border-border shadow-sm p-5 space-y-6 overflow-y-auto max-h-full", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-5 h-5 text-neutral-800" />
          <h3 className="text-heading-4 font-semibold text-neutral-800">Filter Produk</h3>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleReset}
            className="text-primary text-caption font-medium hover:underline transition-all"
          >
            Reset
          </button>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-neutral-500">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <Separator />

      {/* Kategori */}
      <FilterSection title="Kategori">
        <ul className="space-y-1">
          {MARKETPLACE_KATEGORI_SIDEBAR.map((cat) => {
            const Icon = categoryIcons[cat.label] || MoreHorizontal;
            const isActive = activeCategory === cat.label;
            return (
              <li key={cat.label}>
                <button
                  onClick={() => setActiveCategory(cat.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-2 py-2 rounded-md transition-all group",
                    isActive 
                      ? "bg-primary/5 text-primary font-medium" 
                      : "text-neutral-600 hover:bg-neutral-50"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "text-neutral-400 group-hover:text-neutral-600")} />
                    <span className="text-body-sm">{cat.label}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{cat.count}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <button className="text-primary text-caption font-medium mt-1 hover:underline">
          Lihat Semua
        </button>
      </FilterSection>

      <Separator />

      {/* Rentang Harga */}
      <FilterSection title="Rentang Harga">
        <div className="pt-2 px-1">
          <Slider
            defaultValue={[0, 10000000]}
            max={10000000}
            step={50000}
            value={priceRange}
            onValueChange={setPriceRange}
            className="mb-4"
          />
          <div className="space-y-1.5">
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Harga Minimum</span>
              <span className="text-body-sm font-medium">{formatPrice(priceRange[0])}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Harga Maksimum</span>
              <span className="text-body-sm font-medium">{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>
      </FilterSection>

      <Separator />

      {/* Merek */}
      <FilterSection title="Merek">
        <div className="space-y-2.5 pt-1">
          {MARKETPLACE_FILTER.brands.map((brand) => (
            <div key={brand.label} className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-2">
                <Checkbox id={`brand-${brand.label}`} />
                <Label 
                  htmlFor={`brand-${brand.label}`}
                  className="text-body-sm text-neutral-600 cursor-pointer group-hover:text-neutral-900 transition-colors"
                >
                  {brand.label}
                </Label>
              </div>
              <span className="text-[10px] text-muted-foreground">{brand.count}</span>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Rating */}
      <FilterSection title="Rating">
        <div className="space-y-2.5 pt-1">
          {MARKETPLACE_FILTER.ratings.map((rating) => (
            <div key={rating.label} className="flex items-center gap-2 group cursor-pointer">
              <Checkbox id={`rating-${rating.value}`} />
              <Label 
                htmlFor={`rating-${rating.value}`}
                className="flex items-center gap-2 cursor-pointer"
              >
                <StarRating rating={rating.value} size="xs" />
                <span className="text-body-sm text-neutral-600 group-hover:text-neutral-900 transition-colors">
                  {rating.label}
                </span>
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Tipe Penjual */}
      <FilterSection title="Tipe Penjual">
        <div className="space-y-2.5 pt-1">
          {MARKETPLACE_FILTER.sellerTypes.map((type) => (
            <div key={type.value} className="flex items-center gap-2 group cursor-pointer">
              <Checkbox id={`seller-${type.value}`} />
              <Label 
                htmlFor={`seller-${type.value}`}
                className="text-body-sm text-neutral-600 cursor-pointer group-hover:text-neutral-900 transition-colors"
              >
                {type.label}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      {/* Lokasi */}
      <FilterSection title="Lokasi Pengiriman">
        <Select>
          <SelectTrigger className="w-full text-body-sm border-neutral-200">
            <SelectValue placeholder="Pilih Provinsi" />
          </SelectTrigger>
          <SelectContent>
            {MARKETPLACE_FILTER.locations.map(loc => (
              <SelectItem key={loc} value={loc.toLowerCase().replace(' ', '-')}>
                {loc}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterSection>

      {/* Banner Mitra - Desktop only inside sidebar */}
      <div className="hidden lg:block pt-4">
        <MitraBannerSection />
      </div>
    </aside>
  );
};

export default SidebarFilter;
