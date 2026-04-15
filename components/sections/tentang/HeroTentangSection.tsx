import React from "react";
import Image from "next/image";
import { ABOUT_HERO } from "@/constants/about";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Phone } from "lucide-react";

const HeroTentangSection = () => {
  return (
    <section className="relative min-h-[480px] w-full overflow-hidden flex items-end md:items-center py-16 md:py-24 lg:py-32">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={ABOUT_HERO.backgroundImage}
          alt={ABOUT_HERO.heading}
          fill
          priority
          className="object-cover object-center"
          quality={100}
        />
        {/* Gradient Overlay - Based on issue #171: from-black/70 via-black/40 to-transparent */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="container-smarttani relative z-10">
        <div className="max-w-3xl text-white">
          <Badge
            variant="default"
            className="mb-6 bg-primary hover:bg-primary border-none text-white px-4 py-1.5 h-auto text-sm font-semibold rounded-lg"
          >
            {ABOUT_HERO.badge}
          </Badge>

          <h1 className="text-display mb-6 font-extrabold leading-tight">
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
