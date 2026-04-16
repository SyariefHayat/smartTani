"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DISTRIBUTOR_HERO } from "@/constants/distributor";
import { ShieldCheck, Tag, Headphones, UsersRound, Download } from "lucide-react";

const ICON_MAP = [ShieldCheck, Tag, Headphones, UsersRound];

const DistributorHeroSection = () => {
  return (
    <section className="relative flex min-h-[500px] lg:min-h-[650px] items-center overflow-hidden">
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

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/20 lg:via-primary-dark/60 lg:to-transparent" />

      {/* Content */}
      <div className="container-smarttani relative z-10 py-16 pb-24 lg:py-24 lg:pb-32">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">

          {/* Left Column */}
          <div className="text-white">
            <div className="mb-6 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-4 py-2 text-caption font-bold text-white md:text-body-sm">
              {DISTRIBUTOR_HERO.badge}
            </div>
            <h1 className="text-display mb-4 text-white">
              {DISTRIBUTOR_HERO.heading}
            </h1>
            <p className="text-body-lg mb-8 max-w-lg text-white/85">
              {DISTRIBUTOR_HERO.subtext}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {DISTRIBUTOR_HERO.cta.map((cta, index) => (
                <Button
                  key={index}
                  size="lg"
                  className={`h-12 w-full rounded-md px-8 text-body-sm font-bold transition-transform active:scale-95 sm:h-14 sm:w-auto sm:text-base cursor-pointer ${index === 1
                      ? "bg-white text-primary-dark hover:bg-white/90"
                      : "bg-primary hover:bg-primary/90 !text-white"
                    }`}
                >
                  {index === 1 && <Download className="mr-2 size-5" />}
                  {cta.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Right Column - style Artikel */}
          <div className="rounded-2xl bg-white p-6 shadow-2xl md:p-8">
            <div className="flex flex-col gap-6">
              {DISTRIBUTOR_HERO.advantages.map((item, index) => {
                const Icon = ICON_MAP[index] || ShieldCheck;
                return (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-body-sm font-bold text-foreground">
                        {item.label}
                      </h4>
                      <p className="mt-1 text-caption text-muted-foreground">
                        {item.sublabel}
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
};

export default DistributorHeroSection;