"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LOGISTIC_HERO } from "@/constants/logistic";
import { ShieldCheck, Truck, Globe, Search, ArrowRight } from "lucide-react";

const ICON_MAP = [ShieldCheck, Truck, Globe];

const LogisticHeroSection = () => {
  const [trackingNo, setTrackingNo] = useState("");

  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingNo.trim()) {
      // handle tracking
    }
  };

  return (
    <section className="relative flex items-center overflow-hidden min-h-[520px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source media="(min-width: 1024px)" srcSet={LOGISTIC_HERO.bgImageDesktop} />
          <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={LOGISTIC_HERO.bgImageTablet} />
          <source media="(max-width: 767px)" srcSet={LOGISTIC_HERO.bgImageMobile} />
          <img
            src={LOGISTIC_HERO.bgImageDesktop}
            alt="Logistic Smarttani"
            className="w-full h-full object-cover object-center"
          />
        </picture>

        {/* Overlay mobile */}
        <div className="absolute inset-0 bg-black/55 md:hidden" />
      </div>

      {/* Content */}
      <div className="container-smarttani relative z-10 py-10 md:py-5 lg:py-">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12 md:gap-6 lg:gap-8 lg:items-center">

          {/* Left Column */}
          <div className="md:col-span-8 lg:col-span-9">
            {/* Badge */}
            <div className="mb-3 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-3 py-1.5 text-caption font-bold text-white">
              Logistik Pertanian
            </div>

            <h1 className="text-heading-1 md:text-display text-white mb-3 max-w-sm lg:max-w-lg">
              {LOGISTIC_HERO.heading}
            </h1>

            <p className="text-body-sm mb-5 max-w-sm md:max-w-md text-white/85">
              {LOGISTIC_HERO.subtext}
            </p>

            {/* Badges */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-3 md:max-w-3xl max-w-xl">
              {LOGISTIC_HERO.badges.map((badge, index) => {
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
                        {badge.label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground leading-tight">
                        {badge.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Tracking Form */}
          <div className="md:col-span-4 lg:col-span-3 flex md:justify-end lg:justify-end md:self-end">
            <div className="w-full md:max-w-[220px] lg:max-w-xs rounded-2xl bg-white p-4 md:p-5 shadow-2xl">
              <h3 className="text-body-sm font-bold text-foreground mb-1.5">
                {LOGISTIC_HERO.tracking.label}
              </h3>
              <p className="text-caption text-muted-foreground mb-5">
                {LOGISTIC_HERO.tracking.placeholder}
              </p>

              <div className="space-y-3">
                <form onSubmit={handleTracking} className="space-y-3">
                  <Input
                    type="text"
                    placeholder={LOGISTIC_HERO.tracking.inputHint}
                    className="h-10 border-slate-200 bg-slate-50 px-4 focus:ring-primary rounded-xl"
                    value={trackingNo}
                    onChange={(e) => setTrackingNo(e.target.value)}
                  />
                  <Button
                    type="submit"
                    className="h-10 w-full bg-primary text-sm font-bold !text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {LOGISTIC_HERO.tracking.ctaPrimary}
                  </Button>
                </form>

                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 text-caption font-bold text-primary hover:text-primary/80 transition-all py-1.5 group cursor-pointer"
                >
                  {LOGISTIC_HERO.tracking.ctaSecondary}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
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