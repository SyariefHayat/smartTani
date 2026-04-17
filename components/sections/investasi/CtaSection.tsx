import { INVESTASI_CTA_BANNER } from "@/constants/investasi";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function CtaSection() {
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
                {INVESTASI_CTA_BANNER.heading}
              </h2>
              <p className="mt-3 text-body-sm text-white/80 md:text-body">
                {INVESTASI_CTA_BANNER.subtext}
              </p>
            </div>

            {/* Actions */}
            <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row lg:shrink-0">
              <Button
                variant="outline"
                className="h-12 rounded-lg border-white/40 bg-transparent px-8 text-body-sm font-semibold text-white hover:bg-white/10 hover:text-white cursor-pointer"
              >
                {INVESTASI_CTA_BANNER.cta[0]?.label}
              </Button>
              <Button className="h-12 rounded-lg border-none bg-accent px-8 text-body-sm font-bold !text-white hover:bg-accent/90 cursor-pointer">
                {INVESTASI_CTA_BANNER.cta[1]?.label}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
