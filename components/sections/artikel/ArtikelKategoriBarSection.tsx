"use client";

import React from "react";
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

const ArtikelKategoriBarSection = () => {
  return (
    <section className="bg-[#f8fafc] py-12">
      <div className="container-smarttani px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {ARTICLE_KATEGORI.map((kategori, index) => {
            const Icon = CATEGORY_ICONS[index] || LayoutGrid;
            return (
              <button
                key={kategori}
                className="group flex flex-col items-center justify-center gap-4 rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#f1f5f9] text-[#1e3a1f] transition-colors group-hover:bg-[#1e3a1f] group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-center text-xs font-bold text-[#1e3a1f]">
                  {kategori}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ArtikelKategoriBarSection;
