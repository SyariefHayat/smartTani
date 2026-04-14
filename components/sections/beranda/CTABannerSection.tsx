import { Button } from "@/components/ui/button";
import { HOME_CTA_BANNER } from "@/constants";
import Image from "next/image";

export default function CTABannerSection() {
  return (
    <section className="px-5 py-12 sm:px-8 md:px-10 lg:px-12 lg:py-16">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-[#17391f] px-8 py-12 md:px-16 md:py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-20">
          <Image
            src="/images/home/cta-background.webp"
            alt="CTA Background Pattern"
            fill
            className="object-cover"
          />
        </div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-8 lg:flex-row">
          <div className="max-w-2xl text-center lg:text-left">
            <h2 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
              {HOME_CTA_BANNER.heading}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#eef8e5] md:text-base">
              {HOME_CTA_BANNER.subtext}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              variant="outline"
              size="lg"
              className="h-12 border-white text-white hover:bg-white hover:text-[#17391f] md:h-14 md:px-8"
            >
              {HOME_CTA_BANNER.cta[0]?.label}
            </Button>
            <Button
              variant="accent"
              size="lg"
              className="h-12 border-none bg-[#f5c35b] font-bold text-[#17391f] hover:bg-[#f5c35b]/90 md:h-14 md:px-8"
            >
              {HOME_CTA_BANNER.cta[1]?.label}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
