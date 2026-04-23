"use client";

import { Button } from "@/components/ui/button";
import { MARKETPLACE_HERO, ICON_MAP } from "@/constants/marketplace";
import { ShieldCheck, ShoppingBag, Store } from "lucide-react";
import Link from "next/link";

const MarketplaceHeroSection = () => {
  return (
    <section className="relative flex items-start overflow-hidden min-h-[850px] md:min-h-[460px] lg:min-h-[420px]">
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

      </div>

      {/* Content */}
      <div className="container-smarttani relative z-10 py-10 lg:py-0 mt-10 md:mt-6 lg:mt-11">
        <div>
          {/* Badge */}
          <div className="mb-3 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-3 py-1.5 text-caption font-bold text-white">
            {MARKETPLACE_HERO.badge}
          </div>

          <h1 className="text-heading-1 md:text-display text-white mb-3 max-w-sm lg:max-w-lg">
            {MARKETPLACE_HERO.heading}
          </h1>

          <p className="text-body-sm mb-5 max-w-sm text-white/85">
            {MARKETPLACE_HERO.subtext}
          </p>

          <div className="grid grid-cols-2 gap-3 max-w-sm mb-4">
            <Button
              asChild
              className="h-14 justify-start rounded-lg px-4 text-left shadow-lg cursor-pointer bg-primary hover:bg-primary-dark !text-white shadow-primary/20"
            >
              <Link href="/marketplace">
                <ShoppingBag className="size-7 shrink-0 mr-3" />
                <div className="flex flex-col items-start leading-tight">
                  <span className="prefix text-[0.65rem] font-normal opacity-80">Temukan produk</span>
                  <span className="text-sm font-bold">Mulai Belanja</span>
                </div>
              </Link>
            </Button>

            <Button
              asChild
              className="h-14 justify-start rounded-lg px-4 text-left shadow-lg cursor-pointer bg-white text-primary-dark hover:bg-white/90"
            >
              <Link href="/marketplace/jual">
                <Store className="size-7 shrink-0 mr-3" />
                <div className="flex flex-col items-start leading-tight">
                  <span className="prefix text-[0.65rem] font-normal opacity-80">Daftarkan produkmu</span>
                  <span className="text-sm font-bold">Mulai Berjualan</span>
                </div>
              </Link>
            </Button>
          </div>

          {/* Badges */}
          {/* <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-3 max-w-md lg:max-w-xl">
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
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default MarketplaceHeroSection;
