"use client";

import Image from "next/image";
import { INVESTASI_HERO } from "@/constants/investasi";
import { Button } from "@/components/ui/button";
import { ShieldCheck, TrendingUp, Sprout, PlayCircle, Search } from "lucide-react";

export default function InvestasiHeroSection() {
  const icons = [ShieldCheck, TrendingUp, Sprout];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full overflow-hidden min-h-[500px] lg:h-[650px] flex items-center">
      {/* Background Image */}
      <Image
        src={INVESTASI_HERO.image}
        alt="Petani Smarttani sedang memantau lahan"
        width={1920}
        height={1080}
        priority
        quality={90}
        className="absolute inset-0 w-full h-full object-cover object-[80%_50%]"
        sizes="100vw"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,56,27,0.92)_0%,rgba(18,56,27,0.8)_28%,rgba(18,56,27,0.18)_45%,rgba(18,56,27,0.15)_50%)]" />

      {/* Content Wrapper */}
      <div className="container-smarttani relative z-10 py-16 pb-24 lg:py-24 lg:pb-32">
        <div className="grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-16 lg:items-center">

          {/* Left Content */}
          <div className="max-w-2xl text-white">
            {/* Badge */}
            <div className="mb-6 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-4 py-2 text-caption font-bold text-white md:text-body-sm">
              {INVESTASI_HERO.badge}
            </div>

            <h1 className="text-display mt-4 text-white">
              {INVESTASI_HERO.heading}
            </h1>
            <p className="text-body-lg mt-6 max-w-lg text-white/85">
              {INVESTASI_HERO.subtext}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button
                size="lg"
                onClick={() => scrollToSection('proyek-investasi')}
                className="h-12 rounded-xl bg-primary px-6 text-body-sm font-bold !text-white shadow-lg hover:bg-primary-dark sm:h-14 sm:px-8 sm:text-base cursor-pointer"
              >
                <Search className="mr-2 size-5" strokeWidth={2.5} />
                {INVESTASI_HERO.cta[0].label}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('cara-investasi')}
                className="h-12 rounded-xl border-none bg-white px-6 text-body-sm font-bold text-primary-dark shadow-lg hover:bg-slate-100 sm:h-14 sm:px-8 sm:text-base cursor-pointer"
              >
                <PlayCircle className="mr-2 size-5 text-primary" strokeWidth={2.5} />
                {INVESTASI_HERO.cta[1].label}
              </Button>
            </div>
          </div>

          {/* Right Area */}
          <div className="rounded-2xl bg-white p-6 shadow-2xl md:p-8 lg:self-end lg:mb-4">
            <div className="flex flex-col gap-6">
              {INVESTASI_HERO.badges.map((badge, index) => {
                const Icon = icons[index];
                return (
                  <div key={badge.label} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="text-body-sm font-bold text-foreground">
                        {badge.label}
                      </h4>
                      <p className="mt-1 text-caption text-muted-foreground">
                        {badge.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}