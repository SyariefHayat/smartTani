"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ACADEMY_HERO } from "@/constants/academy";
import { Monitor, Users, Award, ArrowRight } from "lucide-react";

const ICON_MAP = [Monitor, Users, Award];

const AcademyHeroSection = () => {
  const scrollToModel = () => {
    const element = document.getElementById('academy-model');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative flex items-start md:items-center overflow-hidden min-h-[850px] md:min-h-[460px] lg:min-h-[420px]">
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
      </div>

      {/* Content */}
      <div className="container-smarttani relative z-10 py-10 lg:py-0 lg:mt-3.5">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:items-center lg:gap-0">

          {/* Left Column: Text & Badges */}
          <div className="lg:col-span-9 text-white mt-9 md:mt-0">
            {/* Badge */}
            <div className="mb-3 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-3 py-1.5 text-caption font-bold text-white">
              {ACADEMY_HERO.badge}
            </div>

            <h1 className="text-heading-1 md:text-display text-white mb-3 max-w-sm lg:max-w-md">
              {ACADEMY_HERO.heading}
            </h1>

            <p className="text-body-sm max-w-sm md:max-w-md text-white/85">
              {ACADEMY_HERO.subtext}
            </p>
          </div>

          {/* Right Column: CTA Card */}
          <div className="md:col-span-4 lg:col-span-3 flex md:justify-end lg:justify-end">
            <div className="w-full lg:max-w-xs rounded-2xl bg-white p-5 md:p-6 shadow-2xl overflow-hidden">
              <h3 className="text-lg font-extrabold text-[#17391f] mb-1">
                {ACADEMY_HERO.sidebar.heading}
              </h3>
              <p className="text-body-sm font-medium text-[#5d7a64] mb-6">
                {ACADEMY_HERO.sidebar.subtext}
              </p>

              <div className="space-y-4">
                <Button asChild className="h-12 w-full bg-primary text-sm font-bold !text-white hover:bg-primary-dark transition-colors shadow-lg shadow-primary/20 cursor-pointer">
                  <Link href="/register">{ACADEMY_HERO.sidebar.ctaPrimary}</Link>
                </Button>

                <button
                  onClick={scrollToModel}
                  className="flex w-full items-center justify-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-all py-1.5 group cursor-pointer"
                >
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
