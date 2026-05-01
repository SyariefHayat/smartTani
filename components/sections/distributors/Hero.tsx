"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DISTRIBUTOR_HERO, DISTRIBUTOR_HERO_ACTIONS } from "@/constants/distributor";
import { ShieldCheck, Tag, Headphones, UsersRound } from "lucide-react";

const ICON_MAP = [ShieldCheck, Tag, Headphones, UsersRound];

const Hero = () => {
  const handleDownload = () => {
    window.open("/files/brosur-distributor.pdf", "_blank");
  };

  return (
    <section className="relative flex items-start md:items-center overflow-hidden min-h-[850px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source media="(min-width: 1024px)" srcSet={DISTRIBUTOR_HERO.bgImageDesktop} />
          <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={DISTRIBUTOR_HERO.bgImageTablet} />
          <source media="(max-width: 767px)" srcSet={DISTRIBUTOR_HERO.bgImageMobile} />
          <img
            src={DISTRIBUTOR_HERO.bgImageDesktop}
            alt="Distributor Smarttani"
            className="w-full h-full object-cover object-center"
          />
        </picture>
      </div>

      {/* Content */}
      <div className="container-smarttani relative z-10 py-10 lg:py-0 mt-1 md:mt-7 lg:mt-5.5">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">

          {/* Left Column */}
          <div className="lg:col-span-9 text-white mt-9 md:mt-0">
            {/* Badge */}
            <div className="mb-3 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-3 py-1.5 text-caption font-bold text-white">
              {DISTRIBUTOR_HERO.badge}
            </div>

            <h1 className="text-heading-1 md:text-display text-white mb-3 max-w-sm lg:max-w-lg">
              {DISTRIBUTOR_HERO.heading}
            </h1>
            <p className="text-body-sm mb-5 max-w-sm md:max-w-md text-white/85">
              {DISTRIBUTOR_HERO.subtext}
            </p>

            <div className="grid grid-cols-2 gap-3 max-w-sm mb-4">
              {DISTRIBUTOR_HERO_ACTIONS.map(({ prefix, label, icon: Icon, className, href }) => (
                <Button
                  key={label}
                  asChild={!!href}
                  onClick={!href ? handleDownload : undefined}
                  className={`h-14 justify-start rounded-lg px-4 text-left shadow-lg cursor-pointer ${className}`}
                >
                  {href ? (
                    <Link href={href}>
                      <Icon className="size-7 shrink-0 mr-3" strokeWidth={1.5} />
                      <div className="flex flex-col items-start leading-tight">
                        <span className="prefix text-[0.65rem] font-normal opacity-80">{prefix}</span>
                        <span className="text-sm font-bold">{label}</span>
                      </div>
                    </Link>
                  ) : (
                    <>
                      <Icon className="size-7 shrink-0 mr-3" strokeWidth={1.5} />
                      <div className="flex flex-col items-start leading-tight">
                        <span className="prefix text-[0.65rem] font-normal opacity-80">{prefix}</span>
                        <span className="text-sm font-bold">{label}</span>
                      </div>
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;