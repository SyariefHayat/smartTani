import { Button } from "@/components/ui/button";
import { ABOUT_CTA_BANNER } from "@/constants/about";
import Image from "next/image";
import Link from "next/link";

export default function CTABannerTentangSection() {
  return (
    <section className="pb-8 pt-8 bg-white">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        <div className="relative overflow-hidden rounded-2xl bg-[#1a4d2e] px-8 py-8 md:px-16">
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
              <h2 className="text-xl font-bold leading-tight text-white sm:text-2xl lg:text-3xl">
                {ABOUT_CTA_BANNER.heading}
              </h2>
              <p className="mt-3 text-sm font-medium text-[#eef8e5]/80 md:text-base">
                {ABOUT_CTA_BANNER.subtext}
              </p>
            </div>

            {/* Actions */}
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row lg:shrink-0">
              <Button
                variant="outline"
                asChild
                className="h-12 rounded-lg border-white/40 bg-transparent px-8 text-sm font-semibold text-white hover:bg-white/10 hover:text-white cursor-pointer"
              >
                <Link href="/kontak">
                  {ABOUT_CTA_BANNER.cta[0]?.label}
                </Link>
              </Button>
              <Button 
                asChild
                className="h-12 rounded-lg border-none bg-[#FFB21C] px-8 text-sm font-bold text-white hover:bg-[#FFB21C]/90 cursor-pointer"
              >
                <Link href="/signup">
                  {ABOUT_CTA_BANNER.cta[1]?.label}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
