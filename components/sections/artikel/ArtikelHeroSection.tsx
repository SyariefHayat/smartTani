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
    <section className="relative min-h-[500px] lg:min-h-[650px] flex items-center overflow-hidden">
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
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/20 lg:via-primary-dark/60 lg:to-transparent" />

      {/* Content */}
      <div className="container-smarttani relative z-10 py-16 lg:py-24">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">

          {/* Left Column: Text & Search */}
          <div className="lg:col-span-8">
            {/* Badge */}
            <div className="mb-6 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-4 py-2 text-caption font-bold text-white md:text-body-sm">
              {ARTICLE_HERO.badge}
            </div>

            <h1 className="text-display text-white mb-6 max-w-2xl">
              {ARTICLE_HERO.heading}
            </h1>

            <p className="text-body-lg mb-10 max-w-xl text-white/85">
              {ARTICLE_HERO.subtext}
            </p>

            {/* Search Bar */}
            <div className="flex max-w-xl items-center gap-2 rounded-xl bg-white p-1.5 shadow-2xl">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={ARTICLE_HERO.searchPlaceholder}
                  className="h-12 border-none bg-transparent pl-12 text-body-sm font-semibold text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                />
              </div>
              <Button className="h-12 bg-primary px-8 font-bold !text-white transition-all hover:bg-primary-dark">
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
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-body-sm font-bold text-foreground">
                          {highlight.title}
                        </h4>
                        <p className="mt-1 text-caption text-muted-foreground">
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
