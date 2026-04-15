"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ACADEMY_HERO } from "@/constants/sitani-academy";
import { GraduationCap, Monitor, Users, Award, ArrowRight } from "lucide-react";

const ICON_MAP = [Monitor, Users, Award];

const AcademyHeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden bg-[#163e1f]">
      {/* Background Image */}
      <Image
        src={ACADEMY_HERO.image}
        alt="Academy Smarttani"
        fill
        priority
        quality={90}
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent lg:from-black/70 lg:via-black/30" />

      {/* Content */}
      <div className="container-smarttani relative z-10 px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Left Column: Text & Badges */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Top Badge/Logo */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/20 px-4 py-2 text-white backdrop-blur-sm">
              <GraduationCap className="h-5 w-5 text-yellow-400" />
              <span className="text-sm font-bold tracking-tight">
                {ACADEMY_HERO.badge}
              </span>
            </div>

            <h1 className="mb-6 text-3xl font-bold leading-[1.15] text-white sm:text-4xl lg:text-5xl xl:text-6xl max-w-2xl">
              {ACADEMY_HERO.heading}
            </h1>

            <p className="mb-10 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              {ACADEMY_HERO.subtext}
            </p>

            {/* Badges */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {ACADEMY_HERO.badges.map((badge, index) => {
                const Icon = ICON_MAP[index] || Monitor;
                return (
                  <div
                    key={index}
                    className="flex flex-row items-center gap-3 rounded-xl bg-white p-4 shadow-lg transition-all hover:translate-y-[-4px]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#17391f] leading-tight sm:text-sm">
                        {badge.label}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500 font-medium">
                        {badge.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: CTA Card */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
              <h3 className="mb-2 text-xl font-bold text-[#17391f] sm:text-2xl">
                {ACADEMY_HERO.sidebar.heading}
              </h3>
              <p className="mb-8 text-sm text-slate-500 leading-relaxed">
                {ACADEMY_HERO.sidebar.subtext}
              </p>

              <div className="space-y-4">
                <Button className="h-12 w-full bg-primary text-base font-bold text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                  {ACADEMY_HERO.sidebar.ctaPrimary}
                </Button>

                <button className="flex w-full items-center justify-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-all py-2 group">
                  {ACADEMY_HERO.sidebar.ctaSecondary}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AcademyHeroSection;
