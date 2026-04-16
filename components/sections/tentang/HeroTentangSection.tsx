import React from "react";
import Image from "next/image";
import { ABOUT_HERO } from "@/constants/about";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

const HeroTentangSection = () => {
  return (
    <section className="relative min-h-[60vh] w-full overflow-hidden flex items-end md:items-center">
      {/* Background Image */}
      <Image
        src={ABOUT_HERO.backgroundImage}
        alt={ABOUT_HERO.heading}
        width={1920}
        height={1080}
        priority
        quality={90}
        className="absolute inset-0 w-full h-full object-cover object-center"
        sizes="100vw"
      />

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />

      {/* Content */}
      <div className="container-smarttani relative z-10 py-16 md:py-24">
        <div className="max-w-xl text-white">
          <h1 className="text-display mb-6 leading-tight">
            {ABOUT_HERO.heading}
          </h1>

          <p className="text-body-lg mb-10 text-white/90 max-w-2xl">
            {ABOUT_HERO.subtext}
          </p>

          <div className="flex flex-wrap gap-4">
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