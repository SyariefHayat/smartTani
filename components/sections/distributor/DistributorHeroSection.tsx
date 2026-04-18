"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DISTRIBUTOR_HERO } from "@/constants/distributor";
import { ShieldCheck, Tag, Headphones, UsersRound, Download } from "lucide-react";

const ICON_MAP = [ShieldCheck, Tag, Headphones, UsersRound];

const DistributorHeroSection = () => {
  const handleAction = (index: number) => {
    if (index === 1) {
      alert('Brosur sedang diunduh...');
    }
  };

  return (
    <section className="relative flex items-center overflow-hidden min-h-[520px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source media="(min-width: 1024px)" srcSet={DISTRIBUTOR_HERO.bgImageDesktop} />
          <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={DISTRIBUTOR_HERO.bgImageTablet} />
          <source media="(max-width: 767px)" srcSet={DISTRIBUTOR_HERO.bgImageMobile} />
          <img
            src={DISTRIBUTOR_HERO.bgImageDesktop}
            alt="Distributor Smarttani"
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
          <div className="lg:col-span-9 text-white">
            <div className="mb-3 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-3 py-1.5 text-caption font-bold text-white">
              {DISTRIBUTOR_HERO.badge}
            </div>
            <h1 className="text-heading-1 md:text-display text-white mb-3 max-w-sm lg:max-w-lg">
              {DISTRIBUTOR_HERO.heading}
            </h1>
            <p className="text-body-sm mb-5 max-w-sm md:max-w-md text-white/85">
              {DISTRIBUTOR_HERO.subtext}
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {DISTRIBUTOR_HERO.cta.map((cta, index) => (
                <Button
                  key={index}
                  asChild={index === 0}
                  onClick={() => handleAction(index)}
                  className={`h-10 w-full rounded-md px-6 text-sm font-bold transition-colors sm:w-auto cursor-pointer ${index === 1
                    ? "bg-white text-primary-dark hover:bg-white/90"
                    : "bg-primary hover:bg-primary-dark !text-white shadow-lg shadow-primary/20"
                    }`}
                >
                  {index === 0 ? (
                    <Link href="/signup?role=distributor">{cta.label}</Link>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      {cta.label}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-3 lg:flex lg:justify-end">
            <div className="w-full lg:max-w-xs rounded-2xl bg-white p-4 md:p-5 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6 lg:gap-6">
                {DISTRIBUTOR_HERO.advantages.map((item, index) => {
                  const Icon = ICON_MAP[index] || ShieldCheck;
                  return (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                        <Icon className="h-4 w-4 md:h-5 md:w-5" />
                      </div>
                      <div>
                        <h4 className="text-body-sm font-bold text-foreground leading-snug">
                          {item.label}
                        </h4>
                        <p className="mt-1 text-caption text-muted-foreground leading-snug">
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
      </div>
    </section>
  );
};

export default DistributorHeroSection;