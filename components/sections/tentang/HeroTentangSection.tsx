"use client";

import React from "react";
import Link from "next/link";
import { ABOUT_HERO } from "@/constants/about";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

const HeroTentangSection = () => {
  const scrollToDetail = () => {
    const element = document.getElementById('profil');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative flex items-center overflow-hidden min-h-[520px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source media="(min-width: 1024px)" srcSet={ABOUT_HERO.bgImageDesktop} />
          <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={ABOUT_HERO.bgImageTablet} />
          <source media="(max-width: 767px)" srcSet={ABOUT_HERO.bgImageMobile} />
          <img
            src={ABOUT_HERO.bgImageDesktop}
            alt="Tentang Smarttani"
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
          <div className="lg:col-span-9">
            {/* Badge */}
            <div className="mb-3 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-3 py-1.5 text-caption font-bold text-white">
              {ABOUT_HERO.badge}
            </div>

            <h1 className="text-heading-1 md:text-display text-white mb-3 max-w-sm lg:max-w-lg">
              {ABOUT_HERO.heading}
            </h1>

            <p className="text-body-sm mb-5 max-w-sm md:max-w-md text-white/85">
              {ABOUT_HERO.subtext}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                onClick={scrollToDetail}
                className="h-10 w-full rounded-md px-6 text-sm font-bold transition-colors sm:w-auto cursor-pointer bg-primary hover:bg-primary-dark !text-white shadow-lg shadow-primary/20"
              >
                {ABOUT_HERO.cta[0].label}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                asChild
                className="h-10 w-full rounded-md px-6 text-sm font-bold transition-colors sm:w-auto cursor-pointer border-none bg-white text-primary-dark hover:bg-white/90"
              >
                <Link href="/kontak">
                  <Phone className="mr-2 h-4 w-4" />
                  {ABOUT_HERO.cta[1].label}
                </Link>
              </Button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroTentangSection;
