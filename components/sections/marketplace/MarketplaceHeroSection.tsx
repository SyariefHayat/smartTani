"use client";

import { MARKETPLACE_HERO, ICON_MAP } from "@/constants/marketplace";
import { ShieldCheck } from "lucide-react";

const MarketplaceHeroSection = () => {
  return (
    <section className="relative flex items-center overflow-hidden min-h-[520px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source media="(min-width: 1024px)" srcSet={MARKETPLACE_HERO.bgImageDesktop} />
          <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={MARKETPLACE_HERO.bgImageTablet} />
          <source media="(max-width: 767px)" srcSet={MARKETPLACE_HERO.bgImageMobile} />
          <img
            src={MARKETPLACE_HERO.bgImageDesktop}
            alt="Marketplace Smarttani"
            className="w-full h-full object-cover object-center"
          />
        </picture>

        {/* Overlay mobile */}
        <div className="absolute inset-0 bg-black/55 md:hidden" />
      </div>

      {/* Content */}
      <div className="container-smarttani relative z-10 py-10 lg:py-0">
        <div>
          {/* Badge */}
          <div className="mb-3 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-3 py-1.5 text-caption font-bold text-white">
            {MARKETPLACE_HERO.badge}
          </div>

          <h1 className="text-heading-1 text-white mb-3 max-w-xl">
            {MARKETPLACE_HERO.heading}
          </h1>

          <p className="text-body-sm mb-5 max-w-sm text-white/85">
            {MARKETPLACE_HERO.subtext}
          </p>

          {/* Badges */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-3 max-w-md lg:max-w-xl">
            {MARKETPLACE_HERO.badges.map((badge, index) => {
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
      </div>
    </section>
  );
};

export default MarketplaceHeroSection;
