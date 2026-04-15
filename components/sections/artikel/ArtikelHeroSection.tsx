"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ARTICLE_HERO } from "@/constants/article";
import { Search, ShieldCheck, Zap, RotateCcw } from "lucide-react";

const ICON_MAP = [ShieldCheck, Zap, RotateCcw];

const ArtikelHeroSection = () => {
  return (
    <section className="relative min-h-[500px] flex items-center overflow-hidden bg-[#1e3a1f]">
      {/* Background Image */}
      <Image
        src={ARTICLE_HERO.image}
        alt="Artikel Smarttani"
        fill
        priority
        quality={90}
        className="object-cover object-right"
        sizes="100vw"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a1f] via-[#1e3a1f]/80 to-transparent" />

      {/* Content */}
      <div className="container-smarttani relative z-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Text & Search */}
          <div className="lg:col-span-8">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-yellow-400 text-[#1e3a1f]">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <span className="text-sm font-black tracking-tight text-white uppercase">
                {ARTICLE_HERO.badge}
              </span>
            </div>

            <h1 className="text-display mb-6 text-white max-w-2xl">
              {ARTICLE_HERO.heading}
            </h1>

            <p className="text-body-lg mb-10 max-w-xl text-white/80">
              {ARTICLE_HERO.subtext}
            </p>

            {/* Search Bar */}
            <div className="flex max-w-xl items-center gap-2 rounded-xl bg-white p-1.5 shadow-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#94a3b8]" />
                <Input
                  type="text"
                  placeholder={ARTICLE_HERO.searchPlaceholder}
                  className="h-12 border-none bg-transparent pl-12 text-sm font-bold text-[#1e3a1f] placeholder:text-[#94a3b8] focus-visible:ring-0"
                />
              </div>
              <Button className="h-12 bg-[#2d7a3a] px-8 font-black text-white transition-all hover:bg-[#1e3a1f]">
                {ARTICLE_HERO.searchCta}
              </Button>
            </div>
          </div>

          {/* Right Column: Highlights Card */}
          <div className="lg:col-span-4">
            <div className="rounded-2xl bg-white p-6 shadow-2xl md:p-8">
              <div className="flex flex-col gap-6">
                {ARTICLE_HERO.highlights.map((highlight, index) => {
                  const Icon = ICON_MAP[index] || ShieldCheck;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#e1f5ee] text-[#2d7a3a]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-[#1e3a1f]">
                          {highlight.title}
                        </h4>
                        <p className="mt-1 text-[11px] font-bold text-[#64748b] leading-relaxed">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ArtikelHeroSection;
