"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ACADEMY_HERO } from "@/constants/sitani-academy";
import { GraduationCap, Monitor, Users, Award, ArrowRight } from "lucide-react";

const ICON_MAP = [Monitor, Users, Award];

const AcademyHeroSection = () => {
  const scrollToModel = () => {
    const element = document.getElementById('academy-model');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative flex items-center overflow-hidden min-h-[520px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source
            media="(min-width: 1024px)"
            srcSet={ACADEMY_HERO.bgImageDesktop}
          />
          <source
            media="(min-width: 768px) and (max-width: 1023px)"
            srcSet={ACADEMY_HERO.bgImageTablet}
          />
          <source
            media="(max-width: 767px)"
            srcSet={ACADEMY_HERO.bgImageMobile}
          />
          <img
            src={ACADEMY_HERO.bgImageDesktop}
            alt="Hero Background"
            className="w-full h-full object-cover object-center"
          />
        </picture>

        {/* Overlay: mobile & tablet */}
        <div className="absolute inset-0 bg-black/55 md:hidden" />
      </div>

      {/* Content */}
      <div className="container-smarttani relative z-10 py-10 md:py-12 lg:py-14">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">

          {/* Left Column: Text & Badges */}
          <div className="md:col-span-8 lg:col-span-9">
            {/* Badge */}
            <div className="mb-3 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-3 py-1.5 text-caption font-bold text-white">
              {ACADEMY_HERO.badge}
            </div>

            <h1 className="text-heading-1 text-white mb-3 max-w-sm">
              {ACADEMY_HERO.heading}
            </h1>

            <p className="text-body-sm mb-5 max-w-sm text-white/85">
              {ACADEMY_HERO.subtext}
            </p>

            {/* Badges */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 max-w-2xl">
              {ACADEMY_HERO.badges.map((badge, index) => {
                const Icon = ICON_MAP[index] || Monitor;
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

          {/* Right Column: CTA Card */}
          <div className="md:col-span-4 lg:col-span-3 flex md:justify-end lg:justify-end md:self-end lg:self-center">
            <div className="w-full md:max-w-xs lg:max-w-xs rounded-2xl bg-white p-4 md:p-5 shadow-2xl">
              <h3 className="text-body-sm font-bold text-foreground mb-1.5">
                {ACADEMY_HERO.sidebar.heading}
              </h3>
              <p className="text-caption text-muted-foreground mb-5">
                {ACADEMY_HERO.sidebar.subtext}
              </p>

              <div className="space-y-3">
                <Button asChild className="h-10 w-full bg-primary text-sm font-bold !text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 cursor-pointer">
                  <Link href="/signup">{ACADEMY_HERO.sidebar.ctaPrimary}</Link>
                </Button>

                <button
                  onClick={scrollToModel}
                  className="flex w-full items-center justify-center gap-2 text-caption font-bold text-primary hover:text-primary/80 transition-all py-1.5 group cursor-pointer"
                >
                  {ACADEMY_HERO.sidebar.ctaSecondary}
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

export default AcademyHeroSection;