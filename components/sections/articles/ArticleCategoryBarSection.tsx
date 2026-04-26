"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ARTICLE_KATEGORI } from "@/constants/article";
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
  LayoutGrid,
];

function KategoriBarContent() {
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
    router.push(`/artikel?${params.toString()}`, { scroll: false });
  };

  return (
    <section className="section-padding">
      <div className="container-smarttani">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {ARTICLE_KATEGORI.map((kategori, index) => {
            const Icon = CATEGORY_ICONS[index] || LayoutGrid;
            const isActive = activeCategory === kategori;
            return (
              <button
                key={kategori}
                onClick={() => handleCategoryClick(kategori)}
                className={cn(
                  "group flex flex-col items-center justify-center gap-4 rounded-2xl p-6 border transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer",
                  isActive 
                    ? "bg-primary border-primary text-white" 
                    : "bg-slate-50 border-transparent hover:border-slate-200"
                )}
              >
                <div className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-primary-light text-primary group-hover:bg-primary group-hover:text-white"
                )}>
                  <Icon className="h-6 w-6" />
                </div>
                <span className={cn(
                  "text-center text-caption font-bold",
                  isActive ? "text-white" : "text-foreground"
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
