"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ACADEMY_HERO } from "@/constants/sitani-academy";
import { GraduationCap, Monitor, Users, Award, ArrowRight } from "lucide-react";

const ICON_MAP = [Monitor, Users, Award];

const AcademyHeroSection = () => {
  return (
    <section className="relative min-h-[500px] lg:min-h-[650px] flex items-center overflow-hidden">
      {/* Background Image */}
      <Image
        src={ACADEMY_HERO.image}
        alt="Academy Smarttani"
        width={1920}
        height={1080}
        priority
        quality={90}
        className="absolute inset-0 w-full h-full object-cover object-center"
        sizes="100vw"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/20 lg:via-primary-dark/60 lg:to-transparent" />

      {/* Content */}
      <div className="container-smarttani relative z-10 py-16 pb-24 lg:py-24 lg:pb-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">

          {/* Left Column: Text & Badges */}
          <div className="lg:col-span-7 xl:col-span-8">
            {/* Badge */}
            <div className="mb-6 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-4 py-2 text-caption font-bold text-white md:text-body-sm">
              {ACADEMY_HERO.badge}
            </div>

            <h1 className="text-display mb-6 text-white max-w-2xl">
              {ACADEMY_HERO.heading}
            </h1>

            <p className="text-body-lg mb-10 max-w-xl text-white/85">
              {ACADEMY_HERO.subtext}
            </p>

            {/* Badges */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {ACADEMY_HERO.badges.map((badge, index) => {
                const Icon = ICON_MAP[index] || Monitor;
                return (
                  <div
                    key={index}
                    className="flex flex-row items-center gap-3 rounded-xl bg-white p-4 shadow-lg transition-all hover:translate-y-[-4px]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-body-sm font-bold text-foreground leading-tight">
                        {badge.label}
                      </p>
                      <p className="mt-1 text-caption text-muted-foreground">
                        {badge.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: CTA Card */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
              <h3 className="text-heading-3 font-bold text-foreground mb-2">
                {ACADEMY_HERO.sidebar.heading}
              </h3>
              <p className="text-body-sm text-muted-foreground mb-8">
                {ACADEMY_HERO.sidebar.subtext}
              </p>

              <div className="space-y-4">
                <Button className="h-12 w-full bg-primary text-base font-bold !text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20">
                  {ACADEMY_HERO.sidebar.ctaPrimary}
                </Button>

                <button className="flex w-full items-center justify-center gap-2 text-body-sm font-bold text-primary hover:text-primary/80 transition-all py-2 group">
                  {ACADEMY_HERO.sidebar.ctaSecondary}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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