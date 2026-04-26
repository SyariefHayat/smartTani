import { INVESTASI_CTA_BANNER } from "@/constants/investasi";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function CtaSection() {
  return (
    <section className="section-padding">
      <div className="container-smarttani">
        <div className="relative overflow-hidden rounded-2xl bg-primary-dark px-8 py-8 md:px-16">
          {/* Background Picture */}
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
              <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
                {INVESTASI_CTA_BANNER.heading}
              </h2>
              <p className="mt-3 text-sm font-medium text-[#eef8e5]/80 md:text-base">
                {INVESTASI_CTA_BANNER.subtext}
              </p>
            </div>

            {/* Actions */}
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row lg:shrink-0">
              <Button
                variant="outline"
                className="h-14 rounded-lg border-white/40 bg-transparent px-8 text-body-sm font-semibold text-white hover:bg-white/10 hover:text-white cursor-pointer"
                asChild
              >
                <Link href="/tentang">
                  {INVESTASI_CTA_BANNER.cta[0]?.label}
                </Link>
              </Button>
              <Button
                className="h-14 rounded-lg border-none bg-accent px-8 text-body-sm font-bold !text-white hover:bg-accent/90 cursor-pointer"
                asChild
              >
                <Link href="/signup?role=investor">
                  {INVESTASI_CTA_BANNER.cta[1]?.label}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
