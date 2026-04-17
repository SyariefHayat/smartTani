import React from "react";
import Image from "next/image";
import { ABOUT_HERO } from "@/constants/about";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

const HeroTentangSection = () => {
  return (
    <section className="relative min-h-[500px] lg:min-h-[650px] w-full overflow-hidden flex items-center">
      {/* Background Image */}
      <Image
        src={ABOUT_HERO.backgroundImage}
        alt={ABOUT_HERO.heading}
        width={1920}
        height={1080}
        priority
        quality={90}
        className="absolute inset-0 w-full h-full object-cover object-[50%_100%]"
        sizes="100vw"
      />

      {/* Dark overlay for text readability */}
      {/* <div className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary-dark/90 to-primary-dark/20 lg:via-primary-dark/60 lg:to-transparent" /> */}

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
              className="rounded-full px-8 h-12 md:h-14 text-base font-semibold transition-all hover:scale-105"
            >
              {ABOUT_HERO.cta[0].label}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-8 h-12 md:h-14 text-base font-semibold border-2 border-white bg-transparent text-white hover:bg-white hover:text-primary transition-all hover:scale-105"
            >
              <Phone className="mr-2 h-5 w-5" />
              {ABOUT_HERO.cta[1].label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroTentangSection;