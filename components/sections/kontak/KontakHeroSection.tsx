"use client";

import { KONTAK_HERO } from "@/constants/kontak";
import { Headphones, ShieldCheck, Users } from "lucide-react";

const ICON_MAP = [Headphones, ShieldCheck, Users];

export default function KontakHeroSection() {
  return (
    <section className="relative flex items-center overflow-hidden min-h-[520px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source media="(min-width: 1024px)" srcSet={KONTAK_HERO.bgImageDesktop} />
          <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={KONTAK_HERO.bgImageTablet} />
          <source media="(max-width: 767px)" srcSet={KONTAK_HERO.bgImageMobile} />
          <img
            src={KONTAK_HERO.bgImageDesktop}
            alt="Kontak Smarttani"
            className="w-full h-full object-cover object-center"
          />
        </picture>

        {/* Overlay mobile */}
        <div className="absolute inset-0 bg-black/55 md:hidden" />
      </div>

      {/* Content */}
      <div className="container-smarttani relative z-10 py-10 lg:py-0">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">

          {/* Left Column */}
          <div className="lg:col-span-9">
            {/* Badge */}
            <div className="mb-3 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-3 py-1.5 text-caption font-bold text-white">
              {KONTAK_HERO.badge}
            </div>

            <h1 className="text-heading-1 md:text-display text-white mb-3 max-w-sm lg:max-w-lg">
              {KONTAK_HERO.heading}
            </h1>

            <p className="text-body-sm mb-5 max-w-sm md:max-w-md text-white/85">
              {KONTAK_HERO.subtext}
            </p>

            {/* Feature Badges */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-3 max-w-md lg:max-w-xl">
              {KONTAK_HERO.features.map((feature, index) => {
                const Icon = ICON_MAP[index] || ShieldCheck;
                return (
                  <div
                    key={index}
                    className="flex flex-row md:flex-col lg:flex-row items-center md:items-start gap-3 rounded-xl bg-white p-3 shadow-lg transition-all hover:translate-y-[-2px]"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-caption font-bold text-foreground leading-tight">
                        {feature.title}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">
                        {feature.description}
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