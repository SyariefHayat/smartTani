import Image from "next/image";
import { INVESTASI_HERO } from "@/constants/investasi";
import { Button } from "@/components/ui/button";
import { ShieldCheck, TrendingUp, Sprout, PlayCircle, Search } from "lucide-react";

export default function InvestasiHeroSection() {
  const icons = [ShieldCheck, TrendingUp, Sprout];

  return (
    <section className="relative w-full overflow-hidden bg-[#17391f]">
      {/* Background Image */}
      <Image
        src={INVESTASI_HERO.image}
        alt="Petani Smarttani sedang memantau lahan"
        width={1920}
        height={1080}
        priority
        quality={90}
        className="absolute inset-0 w-full h-full object-cover object-center"
        sizes="100vw"
      />

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,56,27,0.92)_0%,rgba(18,56,27,0.85)_28%,rgba(18,56,27,0.18)_45%,rgba(18,56,27,0.15)_100%)]" />

      {/* Content Wrapper */}
      <div className="relative z-10 grid gap-10 px-5 py-10 sm:px-8 md:px-10 lg:grid-cols-[1fr_340px] lg:gap-16 lg:px-12 lg:py-16">

        {/* Left Content Area */}
        <div className="max-w-2xl text-white">
          <span className="text-sm font-semibold tracking-wide text-[#b5d296] md:text-base">
            {INVESTASI_HERO.badge}
          </span>
          <h1 className="text-display mt-4 text-white">
            {INVESTASI_HERO.heading}
          </h1>
          <p className="text-body-lg mt-6 max-w-lg text-white/90">
            {INVESTASI_HERO.subtext}
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button
              size="lg"
              className="h-12 rounded-xl bg-[#2D6A2D] px-6 text-sm font-bold text-white shadow-lg hover:bg-[#235323] sm:h-14 sm:px-8 sm:text-base cursor-pointer"
            >
              <Search className="mr-2 size-5" strokeWidth={2.5} />
              {INVESTASI_HERO.cta[0].label}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-none bg-white px-6 text-sm font-bold text-[#17391f] shadow-lg hover:bg-neutral-100 sm:h-14 sm:px-8 sm:text-base cursor-pointer"
            >
              <PlayCircle className="mr-2 size-5 text-[#2D6A2D]" strokeWidth={2.5} />
              {INVESTASI_HERO.cta[1].label}
            </Button>
          </div>
        </div>

        {/* Right Area - Badges */}
        <div className="flex flex-col gap-3 lg:justify-end lg:mb-4">
          {INVESTASI_HERO.badges.map((badge, index) => {
            const Icon = icons[index];
            return (
              <div
                key={badge.label}
                className="flex w-full max-w-[340px] items-start gap-4 rounded-2xl bg-white p-4 shadow-xl backdrop-blur-md sm:p-5"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF3DE] text-[#2D6A2D] sm:size-12">
                  <Icon className="size-6 sm:size-7" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-[#17391f] sm:text-base">
                    {badge.label}
                  </h3>
                  <p className="mt-0.5 text-[10px] font-medium text-[#5d7a64] sm:text-xs">
                    {badge.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}