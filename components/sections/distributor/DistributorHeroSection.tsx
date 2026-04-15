"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DISTRIBUTOR_HERO } from "@/constants/distributor";

import {
  ShieldCheck,
  Tag,
  Headphones,
  UsersRound,
  Download,
} from "lucide-react";

const ICON_MAP = [ShieldCheck, Tag, Headphones, UsersRound];

const DistributorHeroSection = () => {
  return (
    <section className="relative flex min-h-screen md:min-h-[65vh] items-center overflow-hidden bg-[#245a2f] lg:min-h-[80vh] lg:py-0">
      {/* Background Image */}
      <Image
        src={DISTRIBUTOR_HERO.image}
        alt="Distributor Smarttani"
        fill
        priority
        quality={90}
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient Overlay - Ditingkatkan untuk keterbacaan di Mobile */}
      <div className="absolute inset-0 bg-linear-to-r from-[#12381b]/95 via-[#12381b]/80 to-transparent lg:bg-[linear-gradient(90deg,rgba(18,56,27,0.95)_0%,rgba(18,56,27,0.85)_35%,rgba(18,56,27,0.4)_45%,rgba(18,56,27,0.2)_100%)]" />

      {/* Content */}
      <div className="container-smarttani relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* Left Column: Text Content */}
          <div className="text-white">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 sm:text-xs">
              {DISTRIBUTOR_HERO.badge}
            </p>

            <h1 className="mb-4 text-3xl font-bold leading-[1.1] sm:text-4xl lg:text-5xl xl:text-6xl">
              {DISTRIBUTOR_HERO.heading}
            </h1>

            <p className="mb-8 max-w-lg text-sm leading-relaxed text-white/90 sm:text-base lg:text-lg">
              {DISTRIBUTOR_HERO.subtext}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {DISTRIBUTOR_HERO.cta.map((cta, index) => (
                <Button
                  key={index}
                  size="lg"
                  className={`h-12 w-full rounded-md px-8 text-sm font-bold transition-transform active:scale-95 sm:h-14 sm:w-auto sm:text-base cursor-pointer ${
                    index === 1
                      ? "bg-white text-[#245a2f] hover:bg-white/90"
                      : "bg-primary hover:bg-primary/90"
                  }`}
                >
                  {index === 1 && <Download className="mr-2 size-5" />}
                  {cta.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Right Column: Advantage Cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-col lg:gap-4">
            {DISTRIBUTOR_HERO.advantages.map((advantage, index) => {
              const Icon = ICON_MAP[index] || ShieldCheck;
              return (
                <div
                  key={index}
                  className="group rounded-xl border border-white/20 bg-white/95 p-4 shadow-xl backdrop-blur-sm transition-all duration-300 hover:bg-white lg:hover:translate-x-2"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white sm:size-12">
                      <Icon className="size-5 sm:size-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-primary/70 sm:text-[10px]">
                        {advantage.label}
                      </p>
                      <p className="truncate text-xs font-extrabold text-[#17391f] sm:text-sm md:whitespace-normal">
                        {advantage.sublabel}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DistributorHeroSection;
