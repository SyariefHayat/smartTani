"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ARTICLE_CATEGORIES } from "@/constants/article";
import {
  Sprout,
  Beef,
  FlaskConical,
  Cpu,
  BarChart3,
  ShoppingBasket,
  ShieldCheck,
  LayoutGrid
} from "lucide-react";
import { cn } from "@/lib/utils";

const CATEGORY_ICONS = [
  Sprout,
  Beef,
  FlaskConical,
  Cpu,
  BarChart3,
  ShoppingBasket,
  ShieldCheck,
  LayoutGrid
];

const ARTICLE_CATEGORY_BG_COLORS = [
  "#FEF9C3", // Budidaya Tanaman
  "#DCFCE7", // Peternakan
  "#FEF3C7", // Pupuk & Nutrisi
  "#DBEAFE", // Teknologi Pertanian
  "#FCE7F3", // Manajemen Usaha
  "#EDE9FE", // Pasca Panen
  "#E0F2FE", // Kebijakan & Regulasi
  "#F1F5F9", // Lainnya
];

const KategoriBarContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("kategori");

  const handleCategoryClick = (kategori: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (activeCategory === kategori) {
      params.delete("kategori");
    } else {
      params.set("kategori", kategori);
    }
    router.push(`/articles?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="">
      <div className="container-smarttani">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {ARTICLE_CATEGORIES.map((kategori, index) => {
            const Icon = CATEGORY_ICONS[index] || LayoutGrid;
            const isActive = activeCategory === kategori;
            return (
              <button
                key={kategori}
                onClick={() => handleCategoryClick(kategori)}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all cursor-pointer text-center hover:-translate-y-1",
                  isActive
                    ? "bg-primary border-primary text-white shadow-md shadow-primary/20"
                    : "border-gray-100 hover:border-gray-300"
                )}
                style={!isActive ? { backgroundColor: ARTICLE_CATEGORY_BG_COLORS[index % ARTICLE_CATEGORY_BG_COLORS.length] } : {}}
              >
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
                  isActive
                    ? "bg-white/20 text-white"
                    : "text-primary"
                )}>
                  <Icon className="size-7" />
                </div>
                <span className={cn(
                  "text-[11px] font-medium leading-tight",
                  isActive ? "text-white" : "text-[#5d7a64]"
                )}>
                  {kategori}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const ArticleCategoryBarSection = () => {
  return (
    <Suspense fallback={<div className="h-32 bg-slate-50 animate-pulse"></div>}>
      <KategoriBarContent />
    </Suspense>
  );
};

export default ArticleCategoryBarSection;
