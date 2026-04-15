"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOGISTIC_HERO } from "@/constants/logistic";
import { ShieldCheck, Truck, Globe, Search, ArrowRight } from "lucide-react";

const ICON_MAP = [ShieldCheck, Truck, Globe];

const LogisticHeroSection = () => {
  return (
    <section className="relative min-h-[600px] flex items-center overflow-hidden bg-[#1a4d2e]">
      {/* Background Image */}
      <Image
        src={LOGISTIC_HERO.image}
        alt="Logistic Smarttani"
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
            <h1 className="mb-6 text-3xl font-bold leading-[1.15] text-white sm:text-4xl lg:text-5xl xl:text-6xl max-w-2xl">
              {LOGISTIC_HERO.heading}
            </h1>

            <p className="mb-10 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
              {LOGISTIC_HERO.subtext}
            </p>

            {/* Badges */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {LOGISTIC_HERO.badges.map((badge, index) => {
                const Icon = ICON_MAP[index] || ShieldCheck;
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-2 rounded-xl border border-white/10 bg-white p-4 shadow-lg transition-all hover:translate-y-[-4px]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#17391f] leading-tight">
                        {badge.label}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500 font-medium uppercase tracking-wider">
                        {badge.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Tracking Form */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
              <h3 className="mb-1 text-xl font-bold text-[#17391f] sm:text-2xl">
                {LOGISTIC_HERO.tracking.label}
              </h3>
              <p className="mb-6 text-sm text-slate-500">
                {LOGISTIC_HERO.tracking.placeholder}
              </p>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Input
                    type="text"
                    placeholder={LOGISTIC_HERO.tracking.inputHint}
                    className="h-12 border-slate-200 bg-slate-50 px-4 focus:ring-primary"
                  />
                </div>
                
                <Button className="h-12 w-full bg-primary text-base font-bold text-white hover:bg-primary/90 transition-colors">
                  <Search className="mr-2 h-5 w-5" />
                  {LOGISTIC_HERO.tracking.ctaPrimary}
                </Button>

                <button className="flex w-full items-center justify-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors py-2">
                  {LOGISTIC_HERO.tracking.ctaSecondary}
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default LogisticHeroSection;
