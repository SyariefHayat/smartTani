import Image from "next/image";
import { KONTAK_HERO } from "@/constants/kontak";
import { Headphones, ShieldCheck, Users } from "lucide-react";

export default function KontakHeroSection() {
  const icons = [Headphones, ShieldCheck, Users];

  return (
    <section className="relative w-full min-h-[500px] lg:min-h-[650px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={KONTAK_HERO.bgImage}
          alt="Hero Background"
          fill
          className="object-cover object-center lg:object-right"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#17391f] via-[#17391f]/90 to-[#17391f]/20 lg:via-[#17391f]/60 lg:to-transparent" />
      </div>

      <div className="container-smarttani relative z-10 py-16 lg:py-24">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-block rounded-lg bg-[#2D6A2D]/80 backdrop-blur-sm px-4 py-2 text-xs font-bold text-white md:text-sm">
            {KONTAK_HERO.badge}
          </div>

          {/* Headings */}
          <div className="mt-8 space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {KONTAK_HERO.heading}
            </h1>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {KONTAK_HERO.subheading}
            </h2>
          </div>

          {/* Subtext */}
          <p className="mt-8 max-w-2xl text-base font-medium text-white/90 md:text-lg">
            {KONTAK_HERO.subtext}
          </p>

          {/* Info Bar (Desktop/Tablet) */}
          <div className="mt-12 hidden rounded-2xl bg-white p-6 shadow-2xl md:grid md:grid-cols-3 md:gap-8">
            {KONTAK_HERO.features.map((feature, index) => {
              const Icon = icons[index];
              return (
                <div
                  key={feature.title}
                  className="flex items-center gap-4"
                >
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3DE] text-[#2D6A2D]">
                    <Icon className="size-7" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#17391f]">
                      {feature.title}
                    </h3>
                    <p className="mt-0.5 text-xs font-medium text-[#5d7a64]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Info Cards (Mobile) */}
          <div className="mt-10 grid gap-4 md:hidden">
            {KONTAK_HERO.features.map((feature, index) => {
              const Icon = icons[index];
              return (
                <div
                  key={feature.title}
                  className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-xl"
                >
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#EAF3DE] text-[#2D6A2D]">
                    <Icon className="size-6" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#17391f]">
                      {feature.title}
                    </h3>
                    <p className="text-[10px] font-medium text-[#5d7a64]">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
