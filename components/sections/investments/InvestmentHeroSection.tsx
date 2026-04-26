"use client";

import { INVESTMENT_HERO, INVESTMENT_HERO_ACTIONS } from "@/constants/investments";
import { Button } from "@/components/ui/button";
import { ShieldCheck, TrendingUp, Sprout } from "lucide-react";

export default function InvestmentHeroSection() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative flex items-start md:items-center overflow-hidden min-h-[850px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source media="(min-width: 1024px)" srcSet={INVESTMENT_HERO.bgImageDesktop} />
          <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={INVESTMENT_HERO.bgImageTablet} />
          <source media="(max-width: 767px)" srcSet={INVESTMENT_HERO.bgImageMobile} />
          <img
            src={INVESTMENT_HERO.bgImageDesktop}
            alt="Investasi Smarttani"
            className="w-full h-full object-cover object-center"
          />
        </picture>
      </div>

      {/* Content */}
      <div className="container-smarttani relative z-10 py-10 lg:py-0 mt-1 md:mt-7 lg:mt-6">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">

          {/* Left Column */}
          <div className="lg:col-span-9 text-white mt-9 md:mt-0">
            {/* Badge */}
            <div className="mb-3 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-3 py-1.5 text-caption font-bold text-white">
              {INVESTMENT_HERO.badge}
            </div>

            <h1 className="text-heading-1 md:text-display text-white mb-3 max-w-sm lg:max-w-lg">
              {INVESTMENT_HERO.heading}
            </h1>
            <p className="text-body-sm mb-5 max-w-sm md:max-w-md text-white/85">
              {INVESTMENT_HERO.subtext}
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-sm mb-4">
              {INVESTMENT_HERO_ACTIONS.map(({ prefix, label, icon: Icon, className, sectionId }) => (
                <Button
                  key={label}
                  onClick={() => scrollToSection(sectionId)}
                  className={`h-14 justify-start rounded-lg px-4 text-left shadow-lg cursor-pointer ${className}`}
                >
                  <Icon className="size-7 shrink-0 mr-3" />
                  <div className="flex flex-col items-start leading-tight">
                    <span className="prefix text-[0.65rem] font-normal opacity-80">
                      {prefix}
                    </span>
                    <span className="text-sm font-bold">{label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Right Column: Stat Cards (Optional, keeping structure consistent with HeroSection) */}
          <div className="hidden lg:col-span-3 lg:flex lg:justify-end">
            <div className="w-full lg:max-w-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
                {INVESTMENT_HERO.badges.map((badge, index) => {
                  const icons = [ShieldCheck, TrendingUp, Sprout];
                  const Icon = icons[index] ?? Sprout;
                  const iconBg = ["#EAF3DE", "#FAEEDA", "#E6F1FB"][index] ?? "#EAF3DE";
                  const iconColor = ["#3B6D11", "#854F0B", "#185FA5"][index] ?? "#3B6D11";
                  
                  return (
                    <div
                      key={badge.label}
                      className="rounded-xl border border-white/60 bg-white p-4 shadow-lg backdrop-blur-md"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{ background: iconBg }}
                        >
                          <Icon
                            className="size-7"
                            style={{ color: iconColor }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase text-muted-foreground leading-snug">
                            {badge.label}
                          </p>
                          <p className="mt-0.5 text-caption font-extrabold text-foreground">
                            {badge.sublabel}
                          </p>
                        </div>
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
}
