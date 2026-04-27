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
    <section className="section-padding">
      <div className="container-smarttani">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {ARTICLE_CATEGORIES.map((kategori, index) => {
            const Icon = CATEGORY_ICONS[index] || LayoutGrid;
            const isActive = activeCategory === kategori;
            return (
              <button
                key={kategori}
                onClick={() => handleCategoryClick(kategori)}
                className={cn(
                  "group flex flex-col items-center justify-center gap-4 rounded-3xl p-6 border transition-all hover:shadow-xl hover:-translate-y-1.5 cursor-pointer",
                  isActive 
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                    : "bg-white border-slate-100 hover:border-slate-300"
                )}
              >
                <div className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl transition-all duration-300",
                  isActive
                    ? "bg-white/20 text-white scale-110"
                    : "bg-primary-light text-primary group-hover:bg-primary group-hover:text-white"
                )}>
                  <Icon className="h-7 w-7" />
                </div>
                <span className={cn(
                  "text-center text-[11px] font-extrabold uppercase tracking-wider",
                  isActive ? "text-white" : "text-[#17391f]"
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
