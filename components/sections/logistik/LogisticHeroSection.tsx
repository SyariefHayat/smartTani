"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOGISTIC_HERO } from "@/constants/logistic";
import { ShieldCheck, Truck, Globe, Search } from "lucide-react";

const ICON_MAP = [ShieldCheck, Truck, Globe];

const LogisticHeroSection = () => {
  return (
    <section className="relative min-h-[480px] flex items-center overflow-hidden bg-[#1a4d2e]">
      {/* Background Image */}
      <Image
        src={LOGISTIC_HERO.image}
        alt="Logistic Smarttani"
        width={1920}
        height={1080}
        priority
        quality={90}
        className="absolute inset-0 w-full h-full object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient Overlay - Mengikuti Marketplace */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(9,35,17,0.92)_0%,rgba(9,35,17,0.80)_40%,rgba(9,35,17,0.30)_70%,rgba(9,35,17,0.10)_100%)]" />

      {/* Content */}
      <div className="container-smarttani relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">

          {/* Left Column: Text & Badges */}
          <div className="lg:col-span-7 xl:col-span-8">
            <h1 className="text-display mb-6 text-white max-w-2xl">
              {LOGISTIC_HERO.heading}
            </h1>

            <p className="text-body-lg mb-10 max-w-xl text-white/90">
              {LOGISTIC_HERO.subtext}
            </p>

            {/* Badges */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {LOGISTIC_HERO.badges.map((badge, index) => {
                const Icon = ICON_MAP[index] || ShieldCheck;
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
                    className="h-12 border-slate-200 bg-slate-50 px-4 focus:ring-primary rounded-xl"
                  />
                </div>

                <Button className="h-12 w-full bg-primary text-base font-bold text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20">
                  <Search className="mr-2 h-5 w-5" />
                  {LOGISTIC_HERO.tracking.ctaPrimary}
                </Button>

                <button className="flex w-full items-center justify-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors py-2 group">
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