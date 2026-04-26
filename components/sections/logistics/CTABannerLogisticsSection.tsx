"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LOGISTICS_CTA_BANNER } from "@/constants/logistics";
import { MessageSquare, PhoneCall } from "lucide-react";

const CTABannerLogisticsSection = () => {
  return (
    <section className="pb-10 md:pb-14">
      <div className="container-smarttani">
        <div className="relative overflow-hidden rounded-2xl bg-primary-dark px-8 py-8 md:px-16">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/home/cta-background-2.webp"
              alt="CTA Background"
              fill
              className="object-cover object-center"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center justify-between gap-10 lg:flex-row lg:gap-16">
            {/* Text Content */}
            <div className="max-w-2xl text-center lg:text-left">
              <h2 className="text-heading-2 text-white">
                {LOGISTICS_CTA_BANNER.heading}
              </h2>
              <p className="mt-3 text-body-sm text-white/80 md:text-body">
                {LOGISTICS_CTA_BANNER.subtext}
              </p>
            </div>

            {/* Actions */}
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row lg:shrink-0">
              <Button
                variant="outline"
                asChild
                className="h-12 rounded-lg border-white/40 bg-transparent px-8 text-body-sm font-semibold text-white hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <Link href="/contact">
                  <MessageSquare className="mr-2 size-4" />
                  {LOGISTICS_CTA_BANNER.cta[0]?.label}
                </Link>
              </Button>
              <Button 
                asChild
                className="h-12 rounded-lg border-none bg-accent px-8 text-body-sm font-bold !text-white hover:bg-accent/90 cursor-pointer"
              >
                <Link href="/contact">
                  <PhoneCall className="mr-2 size-4" />
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
