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
    <section className="relative flex min-h-screen md:min-h-[50vh] items-center overflow-hidden bg-[#245a2f] lg:min-h-[410px]">
      {/* Background Image */}
      <Image
        src={DISTRIBUTOR_HERO.image}
        alt="Distributor Smarttani"
        fill
        priority
        quality={90}
        className="object-cover object-left"
        sizes="100vw"
      />

      {/* Gradient Overlay - Hanya menutupi 50% kiri */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,56,27,0.95)_0%,rgba(18,56,27,0.85)_25%,rgba(18,56,27,0.5)_40%,rgba(18,56,27,0)_50%)]" />

      {/* Content */}
      <div className="container-smarttani relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
          {/* Left Column: Text Content */}
          <div className="text-white">
            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/80 sm:text-xs">
              {DISTRIBUTOR_HERO.badge}
            </p>

            <h1 className="text-display mb-4 text-white">
              {DISTRIBUTOR_HERO.heading}
            </h1>

            <p className="text-body-lg mb-8 max-w-lg text-white/90">
              {DISTRIBUTOR_HERO.subtext}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {DISTRIBUTOR_HERO.cta.map((cta, index) => (
                <Button
                  key={index}
                  size="lg"
                  className={`h-12 w-full rounded-md px-8 text-sm font-bold transition-transform active:scale-95 sm:h-14 sm:w-auto sm:text-base cursor-pointer ${index === 1
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


        </div>
      </div>
    </section>
  );
};

export default DistributorHeroSection;
