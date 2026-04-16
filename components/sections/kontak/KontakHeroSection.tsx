import Image from "next/image";
import { KONTAK_HERO } from "@/constants/kontak";
import { Headphones, ShieldCheck, Users } from "lucide-react";

export default function KontakHeroSection() {
  const icons = [Headphones, ShieldCheck, Users];

  return (
    <section className="relative w-full overflow-hidden bg-[#17391f]">
      {/* Hero Content */}
      <div className="container-smarttani relative z-10 pt-10 pb-20 md:pt-16 md:pb-32">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left Content */}
          <div className="max-w-2xl text-white">
            <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#b5d296] md:text-sm">
              {KONTAK_HERO.badge}
            </span>
            <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              {KONTAK_HERO.heading}
            </h1>
            <h2 className="mt-2 text-2xl font-bold text-[#b5d296] md:text-3xl">
              {KONTAK_HERO.subheading}
            </h2>
            <p className="mt-6 text-base font-medium text-white/90 md:text-lg">
              {KONTAK_HERO.subtext}
            </p>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative aspect-[4/3] w-full max-w-lg md:aspect-square">
              <Image
                src={KONTAK_HERO.image}
                alt="Kontak Smarttani"
                fill
                priority
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Info Cards */}
      <div className="container-smarttani relative z-20 -mt-16 md:-mt-20">
        <div className="grid gap-4 sm:grid-cols-3 md:gap-6">
          {KONTAK_HERO.features.map((feature, index) => {
            const Icon = icons[index];
            return (
              <div
                key={feature.title}
                className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-xl md:p-6"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF3DE] text-[#2D6A2D]">
                  <Icon className="size-6 md:size-7" strokeWidth={2} />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#17391f] md:text-base">
                    {feature.title}
                  </h3>
                  <p className="mt-0.5 text-[10px] font-medium text-[#5d7a64] md:text-xs">
                    {feature.description}
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
