import Image from "next/image";
import { KONTAK_HERO } from "@/constants/kontak";
import { Headphones, ShieldCheck, Users } from "lucide-react";

export default function KontakHeroSection() {
  const icons = [Headphones, ShieldCheck, Users];

  return (
    <section className="relative w-full min-h-[500px] lg:min-h-[650px] flex items-center overflow-hidden">
      {/* Background Image with <picture> for responsive sources */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          {/* Desktop: ≥1024px */}
          <source
            media="(min-width: 1024px)"
            srcSet={KONTAK_HERO.bgImageDesktop}
          />
          {/* Tablet: 768px – 1023px */}
          <source
            media="(min-width: 768px) and (max-width: 1023px)"
            srcSet={KONTAK_HERO.bgImageTablet}
          />
          {/* Mobile: <768px */}
          <source
            media="(max-width: 767px)"
            srcSet={KONTAK_HERO.bgImageMobile}
          />
          {/* Fallback */}
          <img
            src={KONTAK_HERO.bgImageDesktop}
            alt="Hero Background"
            className="w-full h-full object-cover object-center"
          />
        </picture>

        {/* Overlay: hanya tampil di tablet & mobile (tersembunyi di desktop) */}
        <div className="absolute inset-0 bg-black/50 lg:hidden" />
      </div>

      <div className="container-smarttani relative z-10 py-16 lg:py-24">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-4 py-2 text-caption font-bold text-white md:text-body-sm">
            {KONTAK_HERO.badge}
          </div>

          {/* Headings */}
          <div className="mt-8 space-y-2">
            <h1 className="text-display text-white">
              {KONTAK_HERO.heading}
            </h1>
            <h2 className="text-heading-1 text-white/90 font-semibold">
              {KONTAK_HERO.subheading}
            </h2>
          </div>

          {/* Subtext */}
          <p className="mt-8 max-w-2xl text-body-lg text-white/85">
            {KONTAK_HERO.subtext}
          </p>

          {/* Info Bar (Desktop/Tablet) */}
          <div className="mt-12 hidden rounded-2xl bg-white p-6 shadow-2xl md:grid md:grid-cols-3 md:gap-4 md:max-w-3xl">
            {KONTAK_HERO.features.map((feature, index) => {
              const Icon = icons[index];
              return (
                <div key={feature.title} className="flex items-center gap-4">
                  <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-primary-light text-primary">
                    <Icon className="size-7" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-body-sm font-bold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-0.5 text-caption text-muted-foreground">
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
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary-light text-primary">
                    <Icon className="size-6" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-body-sm font-bold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-caption text-muted-foreground">
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