"use client";

import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LOGISTIC_CTA_BANNER } from "@/constants/logistic";
import { MessageSquare, PhoneCall } from "lucide-react";

const CTABannerLogistikSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-[#1a4d2e] to-[#12381b] p-8 sm:p-12 md:p-16 lg:px-24">
          
          {/* Decorative Elements */}
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
            
            {/* Left Column: Text & Buttons */}
            <div className="lg:col-span-7 xl:col-span-8 relative z-10 text-center lg:text-left">
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl lg:text-5xl leading-tight">
                {LOGISTIC_CTA_BANNER.heading}
              </h2>
              <p className="mb-10 text-base font-medium text-white/80 md:text-lg max-w-2xl mx-auto lg:mx-0">
                {LOGISTIC_CTA_BANNER.subtext}
              </p>
              
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center lg:justify-start">
                <Button className="h-14 rounded-full bg-primary px-8 text-base font-bold text-white hover:bg-primary/90 shadow-xl shadow-primary/20">
                  <MessageSquare className="mr-2 size-5" />
                  {LOGISTIC_CTA_BANNER.cta[0].label}
                </Button>
                <Button variant="outline" className="h-14 rounded-full border-white/20 bg-white/10 px-8 text-base font-bold text-white hover:bg-white/20 backdrop-blur-sm">
                  <PhoneCall className="mr-2 size-5" />
                  {LOGISTIC_CTA_BANNER.cta[1].label}
                </Button>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="lg:col-span-5 xl:col-span-4 relative z-10 flex justify-center">
              <div className="relative aspect-square w-full max-w-[320px] lg:max-w-full overflow-hidden rounded-3xl bg-white/10 p-4 backdrop-blur-sm border border-white/20">
                <Image
                  src={LOGISTIC_CTA_BANNER.image}
                  alt="Logistik Smarttani"
                  fill
                  className="rounded-2xl object-cover"
                  sizes="(max-width: 768px) 320px, 400px"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default CTABannerLogistikSection;
