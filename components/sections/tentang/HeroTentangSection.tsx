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
    <section className="relative min-h-[500px] lg:min-h-[650px] w-full overflow-hidden flex items-center">
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          {/* Desktop: ≥1024px */}
          <source
            media="(min-width: 1024px)"
            srcSet={ABOUT_HERO.bgImageDesktop}
          />
          {/* Tablet: 768px – 1023px */}
          <source
            media="(min-width: 768px) and (max-width: 1023px)"
            srcSet={ABOUT_HERO.bgImageTablet}
          />
          {/* Mobile: <768px */}
          <source
            media="(max-width: 767px)"
            srcSet={ABOUT_HERO.bgImageMobile}
          />
          {/* Fallback */}
          <img
            src={ABOUT_HERO.bgImageDesktop}
            alt="Hero Background"
            className="w-full h-full object-cover object-center"
          />
        </picture>

        {/* Overlay: hanya tampil di tablet & mobile (tersembunyi di desktop) */}
        <div className="absolute inset-0 bg-black/50 lg:hidden" />
      </div>
      {/* Content */}
      <div className="container-smarttani relative z-10 py-16 lg:py-24">
        <div className="max-w-xl">
          {/* Badge */}
          <div className="inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-4 py-2 text-caption font-bold text-white md:text-body-sm">
            {ABOUT_HERO.badge}
          </div>

          {/* Headings */}
          <div className="mt-8 space-y-2">
            <h1 className="text-display text-white">
              {ABOUT_HERO.heading}
            </h1>
          </div>

          {/* Subtext */}
          <p className="mt-8 max-w-2xl text-body-lg text-white/85">
            {ABOUT_HERO.subtext}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Button
              size="lg"
              variant="accent"
              className="rounded-full px-8 h-12 md:h-14 text-base font-semibold transition-all cursor-pointer"
              onClick={scrollToDetail}
            >
              {ABOUT_HERO.cta[0].label}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="rounded-full px-8 h-12 md:h-14 text-base font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary transition-all cursor-pointer"
            >
              <Link href="/kontak">
                <Phone className="mr-2 h-5 w-5" />
                {ABOUT_HERO.cta[1].label}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroTentangSection;
