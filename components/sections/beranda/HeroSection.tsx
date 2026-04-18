import Image from "next/image";
import Link from "next/link";

import {
  HERO_ACTION,
  HOME_HERO,
  HOME_HERO_STATS,
  STAT_ICONS,
} from "@/constants";

import { Button } from "@/components/ui/button";
import { ShieldCheck, Sprout } from "lucide-react";

export default function HeroSection() {
  const getHref = (role: string) => {
    switch (role) {
      case "Petani":
        return "/signup?role=petani";
      case "Investor":
        return "/signup?role=investor";
      case "Hasil Tani":
        return "/marketplace";
      case "Pelatihan":
        return "/sitani-academy";
      default:
        return "/";
    }
  };

  return (
    <section className="pb-8 md:pb-10">
      <div className="w-full">
        <div className="relative overflow-hidden bg-[#245a2f]">
          <Image
            src="/images/home/hero.png"
            alt="Petani Smarttani sedang memantau lahan"
            width={1920}
            height={1080}
            priority
            quality={90}
            className="w-full h-full object-cover absolute inset-0"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(18,56,27,0.92)_0%,rgba(18,56,27,0.8)_28%,rgba(18,56,27,0.18)_45%,rgba(18,56,27,0.15)_100%)]" />

          <div className="relative z-10 grid gap-8 px-5 py-8 sm:px-8 md:px-10 lg:grid-cols-[minmax(0,1.3fr)_340px] lg:gap-10 lg:px-12 lg:py-12">
            {/* Hero Text */}
            <div className="max-w-3xl text-white">
              <h1 className="text-display mb-4 text-white max-w-xl">
                {HOME_HERO.heading}
              </h1>
              <p className="text-body-lg mt-4 max-w-lg text-white/90">
                {HOME_HERO.subtext}
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:max-w-2xl">
                {HERO_ACTION.map(({ prefix, role, icon: Icon, className }) => (
                  <Button
                    key={role}
                    size="lg"
                    aria-label={`${prefix} sebagai ${role}`}
                    className={`h-14 justify-start rounded-lg px-4 text-left shadow-lg cursor-pointer ${className}`}
                    asChild
                  >
                    <Link href={getHref(role)}>
                      <Icon className="size-7 shrink-0 mr-3" />
                      <div className="flex flex-col items-start leading-tight">
                        <span className="prefix text-[0.65rem] font-normal opacity-80">
                          {prefix}
                        </span>
                        <span className="text-sm font-bold">{role}</span>
                      </div>
                    </Link>
                  </Button>
                ))}
              </div>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#b5d296]/30 bg-[#163e1f]/60 px-4 py-2 text-xs font-medium text-[#eef8e5] backdrop-blur-sm sm:text-sm">
                <ShieldCheck className="size-4 text-[#f5c35b]" />
                {HOME_HERO.trustBar}
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 lg:grid-cols-1 lg:self-end lg:mb-16">
              {HOME_HERO_STATS.map((item, index) => {
                const Icon = STAT_ICONS[index] ?? Sprout;
                return (
                  <div
                    key={item.label}
                    className="rounded-xl border border-white/60 bg-white p-4 shadow-[0_18px_40px_rgba(9,35,17,0.18)] backdrop-blur-md"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex size-11 shrink-0 items-center justify-center rounded-2xl"
                        style={{ background: item.iconBg }}
                      >
                        <Icon
                          className="size-6"
                          style={{ color: item.iconColor }}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.7rem] font-semibold uppercase text-[#5d7a64]">
                          {item.label}
                        </p>
                        <div className="mt-1 flex items-center gap-4">
                          <p className="text-sm font-extrabold text-[#17391f]">
                            {item.value}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: item.sublabelColor }}
                          >
                            {item.sublabel}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
