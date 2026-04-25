"use client";

import Link from "next/link";

import {
  HERO_ACTION,
  HOME_HERO,
  HOME_HERO_STATS,
  STAT_ICONS,
} from "@/constants";

import { Button } from "@/components/ui/button";
import { ShieldCheck, Sprout } from "lucide-react";

export default function HeroSection() {

  return (
    <section className="relative flex items-start md:items-center overflow-hidden min-h-[850px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source media="(min-width: 1024px)" srcSet={HOME_HERO.bgImageDesktop} />
          <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={HOME_HERO.bgImageTablet} />
          <source media="(max-width: 767px)" srcSet={HOME_HERO.bgImageMobile} />
          <img
            src={HOME_HERO.bgImageDesktop}
            alt="Petani Smarttani sedang memantau lahan"
            className="w-full h-full object-cover object-center"
          />
        </picture>

      </div>

      {/* Content */}
      <div className="container-smarttani relative z-10 py-10 lg:py-0">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">

          {/* Left Column */}
          <div className="lg:col-span-9 text-white mt-9 md:mt-0">
            <h1 className="text-heading-1 md:text-display text-white mb-3 max-w-sm lg:max-w-lg">
              {HOME_HERO.heading}
            </h1>
            <p className="text-body-sm mb-5 max-w-sm md:max-w-md text-white/85">
              {HOME_HERO.subtext}
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-sm mb-4">
              {HERO_ACTION.map(({ prefix, role, icon: Icon, className }) => (
                <Button
                  key={role}
                  aria-label={`${prefix} sebagai ${role}`}
                  className={`h-14 justify-start rounded-lg px-4 text-left shadow-lg cursor-pointer ${className}`}
                  asChild
                >
                  <Link href={"/signup"}>
                    <Icon className="size-7 shrink-0 mr-3" />
                    <div className="flex flex-col items-start leading-tight">
                      <span className="prefix text-[0.65rem] font-normal opacity-80">
                        {prefix}
                      </span>
                      <span className="text-sm font-bold">{role}</span>
                    </div>
                  </Link>
                </Button>
              ))}
            </div>

            {/* <div className="inline-flex items-center gap-2 rounded-full border border-[#b5d296]/30 bg-[#163e1f]/60 px-4 py-2 text-xs font-medium text-[#eef8e5] backdrop-blur-sm sm:text-sm">
              <ShieldCheck className="size-7 text-[#f5c35b]" />
              {HOME_HERO.trustBar}
            </div> */}
          </div>

          {/* Right Column: Stat Cards */}
          <div className="hidden lg:col-span-3 lg:flex lg:justify-end">
            <div className="w-full lg:max-w-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-2">
                {HOME_HERO_STATS.map((item, index) => {
                  const Icon = STAT_ICONS[index] ?? Sprout;
                  return (
                    <div
                      key={item.label}
                      className="rounded-xl border border-white/60 bg-white p-4 shadow-lg backdrop-blur-md"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-9 w-9 md:h-10 md:w-10 shrink-0 items-center justify-center rounded-xl"
                          style={{ background: item.iconBg }}
                        >
                          <Icon
                            className="size-7"
                            style={{ color: item.iconColor }}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-semibold uppercase text-muted-foreground leading-snug">
                            {item.label}
                          </p>
                          <div className="mt-0.5 flex items-center gap-2">
                            <p className="text-caption font-extrabold text-foreground">
                              {item.value}
                            </p>
                            <p
                              className="text-caption"
                              style={{ color: item.sublabelColor }}
                            >
                              {item.sublabel}
                            </p>
                          </div>
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
