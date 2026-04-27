"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ARTICLE_HERO } from "@/constants/article";
import { Search, ShieldCheck, Zap, RotateCcw } from "lucide-react";

const ICON_MAP = [ShieldCheck, Zap, RotateCcw];

const ArticleHeroSection = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/artikel?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="relative flex items-starts overflow-hidden min-h-[850px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source
            media="(min-width: 1024px)"
            srcSet={ARTICLE_HERO.bgImageDesktop}
          />
          <source
            media="(min-width: 768px) and (max-width: 1023px)"
            srcSet={ARTICLE_HERO.bgImageTablet}
          />
          <source
            media="(max-width: 767px)"
            srcSet={ARTICLE_HERO.bgImageMobile}
          />
          <img
            src={ARTICLE_HERO.bgImageDesktop}
            alt="Hero Background"
            className="w-full h-full object-cover object-center"
          />
        </picture>

        {/* Overlay: mobile & tablet */}
        {/* <div className="absolute inset-0 bg-black/55 md:hidden" /> */}
      </div>

      {/* Content */}
      <div className="container-smarttani relative z-10 py-10 lg:py-0 mt-10 lg:mt-15">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">

          {/* Left Column: Text & Search */}
          <div className="lg:col-span-9">
            {/* Badge */}
            <div className="mb-3 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-3 py-1.5 text-caption font-bold text-white">
              {ARTICLE_HERO.badge}
            </div>

            <h1 className="text-heading-1 text-white mb-3 max-w-xl">
              {ARTICLE_HERO.heading}
            </h1>

            <p className="text-body-sm mb-5 max-w-sm text-white/85">
              {ARTICLE_HERO.subtext}
            </p>

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex w-full max-w-sm md:max-w-md items-center gap-2 rounded-xl bg-white p-1 shadow-2xl"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder={ARTICLE_HERO.searchPlaceholder}
                  className="h-10 border-none bg-transparent pl-10 text-caption font-semibold text-foreground placeholder:text-muted-foreground focus-visible:ring-0"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="h-10 bg-primary px-4 md:px-6 text-sm font-bold !text-white transition-all hover:bg-primary-dark shrink-0 cursor-pointer">
                {ARTICLE_HERO.searchCta}
              </Button>
            </form>
          </div>

          {/* Right Column: Highlights Card */}
          {/* Mobile/Tablet: full width card horizontal, Desktop: card vertikal di kanan */}
          {/* <div className="lg:col-span-3 lg:flex lg:justify-end">
            <div className="w-full lg:max-w-xs rounded-2xl bg-white p-4 md:p-5 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-1 gap-4 md:gap-6 lg:gap-6">
                {ARTICLE_HERO.highlights.map((highlight, index) => {
                  const Icon = ICON_MAP[index] || ShieldCheck;
                  return (
                    <div key={index} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                        <Icon className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <div>
                        <h4 className="text-body-sm font-bold text-foreground leading-snug">
                          {highlight.title}
                        </h4>
                        <p className="mt-1 text-caption text-muted-foreground leading-snug">
                          {highlight.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div> */}

        </div>
      </div>
    </section>
  );
};

export default ArticleHeroSection;
