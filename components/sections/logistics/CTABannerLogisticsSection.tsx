"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LOGISTICS_CTA_BANNER } from "@/constants/logistics";
import { MessageSquare, PhoneCall } from "lucide-react";

const CTABannerLogisticsSection = () => {
  return (
    <section className="pb-10 md:pb-16">
      <div className="container-smarttani">
        <div className="relative overflow-hidden rounded-[32px] bg-primary-dark px-8 py-10 md:px-16 md:py-16">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <picture>
              {/* Desktop: lg (1024px ke atas) */}
              <source
                media="(min-width: 1024px)"
                srcSet="/images/home/cta-desktop.webp"
              />
              {/* Tablet: sm–lg (640px – 1023px) */}
              <source
                media="(min-width: 640px)"
                srcSet="/images/home/cta-tablet.png"
              />
              {/* Mobile: default (di bawah 640px) */}
              <img
                src="/images/home/cta-mobile.png"
                alt="CTA Background"
                className="h-full w-full object-cover object-center"
              />
            </picture>
          </div>

          <div className="relative z-10 flex flex-col items-center justify-between gap-10 lg:flex-row lg:gap-16">
            {/* Text Content */}
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-2xl font-extrabold text-white md:text-4xl leading-tight">
                {LOGISTICS_CTA_BANNER.heading}
              </h2>
              <p className="mt-3 text-sm font-medium text-white/90 md:text-lg leading-relaxed">
                {LOGISTICS_CTA_BANNER.subtext}
              </p>
            </div>

            {/* Actions */}
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row lg:shrink-0">
              <Button
                variant="outline"
                asChild
                className="h-14 rounded-2xl border-white bg-transparent px-8 text-sm font-bold text-white hover:bg-white/10 hover:text-white cursor-pointer transition-all active:scale-95"
              >
                <Link href="/contact">
                  <MessageSquare className="mr-2 size-5" />
                  {LOGISTICS_CTA_BANNER.cta[0]?.label}
                </Link>
              </Button>
              <Button 
                asChild
                className="h-14 rounded-2xl border-none bg-accent px-8 text-sm font-bold !text-white hover:bg-accent/90 cursor-pointer shadow-lg shadow-black/20 transition-all active:scale-95"
              >
                <Link href="/contact">
                  <PhoneCall className="mr-2 size-5" />
                  {LOGISTICS_CTA_BANNER.cta[1]?.label}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABannerLogisticsSection;
