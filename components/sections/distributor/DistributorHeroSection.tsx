"use client";

import React from "react";
import Image from "next/image";
import { DISTRIBUTOR_HERO } from "@/constants/distributor";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
    <section className="relative min-h-[600px] flex items-center overflow-hidden bg-[#245a2f] lg:min-h-[700px]">
      {/* Background Image */}
      <Image
        src={DISTRIBUTOR_HERO.image}
        alt="Distributor Smarttani"
        fill
        priority
        quality={100}
        className="object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,56,27,0.95)_0%,rgba(18,56,27,0.85)_35%,rgba(18,56,27,0.4)_60%,rgba(18,56,27,0.2)_100%)]" />

      {/* Content */}
      <div className="container-smarttani relative z-10 py-12 lg:py-20">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_360px] lg:gap-16">
          {/* Left Column: Text Content */}
          <div className="max-w-3xl text-white">
            <Badge
              variant="outline"
              className="mb-6 rounded-full border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-sm sm:text-sm"
            >
              {DISTRIBUTOR_HERO.badge}
            </Badge>

            <h1 className="text-display mb-6 text-white drop-shadow-sm">
              {DISTRIBUTOR_HERO.heading}
            </h1>

            <p className="text-body-lg mb-10 max-w-xl leading-relaxed text-white/90">
              {DISTRIBUTOR_HERO.subtext}
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {DISTRIBUTOR_HERO.cta.map((cta, index) => (
                <Button
                  key={index}
                  variant={index === 0 ? "accent" : "outline"}
                  size="lg"
                  className={`h-14 rounded-full px-8 text-base font-bold transition-all duration-300 hover:scale-105 active:scale-95 ${
                    index === 1
                      ? "border-white text-white hover:bg-white/10"
                      : ""
                  }`}
                >
                  {index === 1 && <Download className="mr-2 size-5" />}
                  {cta.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Right Column: Advantage Cards */}
          <div className="flex flex-col gap-4">
            {DISTRIBUTOR_HERO.advantages.map((advantage, index) => {
              const Icon = ICON_MAP[index] || ShieldCheck;
              return (
                <div
                  key={index}
                  className="group rounded-2xl border border-white/60 bg-white p-5 shadow-[0_18px_40px_rgba(9,35,17,0.25)] backdrop-blur-md transition-all duration-300 hover:translate-x-2"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                      <Icon className="size-6 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest text-[#5d7a64] sm:text-xs">
                        {advantage.label}
                      </p>
                      <p className="text-sm font-extrabold leading-tight text-[#17391f] sm:text-base">
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
