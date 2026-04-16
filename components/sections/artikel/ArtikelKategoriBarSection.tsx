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
    <section className="section-padding">
      <div className="container-smarttani">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
          {ARTICLE_KATEGORI.map((kategori, index) => {
            const Icon = CATEGORY_ICONS[index] || LayoutGrid;
            return (
              <button
                key={kategori}
                className="group flex flex-col items-center justify-center gap-4 rounded-2xl bg-slate-50 p-6 border border-transparent transition-all hover:shadow-md hover:border-slate-100 hover:-translate-y-1 cursor-pointer"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-center text-caption font-bold text-foreground">
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
