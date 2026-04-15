import React from "react";
import { ABOUT_CTA_BANNER } from "@/constants/about";
import { Button } from "@/components/ui/button";
import { Phone, ArrowRight } from "lucide-react";

const CTABannerTentangSection = () => {
  return (
    <section className="py-12 md:py-16">
      <div className="container-smarttani">
        <div className="relative overflow-hidden rounded-3xl bg-cta-gradient p-8 md:p-12 lg:p-16 text-white text-center md:text-left">
          {/* Decorative circles */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary-dark/20 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-4xl font-bold mb-4">
                {ABOUT_CTA_BANNER.heading}
              </h2>
              <p className="text-white/80 text-sm md:text-base lg:text-lg">
                {ABOUT_CTA_BANNER.subtext}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 shrink-0">
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 border-white text-white hover:bg-white hover:text-primary h-12 md:h-14 font-semibold transition-all"
              >
                <Phone className="mr-2 h-5 w-5" />
                {ABOUT_CTA_BANNER.cta[0].label}
              </Button>
              <Button
                size="lg"
                variant="accent"
                className="rounded-full px-8 h-12 md:h-14 font-bold text-white shadow-lg transition-all hover:scale-105"
              >
                {ABOUT_CTA_BANNER.cta[1].label}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABannerTentangSection;
