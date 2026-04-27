"use client";

import React from "react";
import Link from "next/link";
import { ABOUT_HERO, ABOUT_HERO_ACTIONS } from "@/constants/about";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone } from "lucide-react";

const HeroAboutSection = () => {
  const scrollToDetail = () => {
    const element = document.getElementById('profil');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const ButtonContent = ({ icon: Icon, prefix, label }: { icon: React.ElementType; prefix: string; label: string }) => (
    <>
      <Icon className="size-7 shrink-0 mr-3" />
      <div className="flex flex-col items-start leading-tight">
        <span className="text-[10px] font-medium opacity-80 uppercase tracking-wider">{prefix}</span>
        <span className="text-xs font-extrabold">{label}</span>
      </div>
    </>
  );

  return (
    <section className="relative flex items-starts overflow-hidden min-h-[850px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source media="(min-width: 1024px)" srcSet={ABOUT_HERO.bgImageDesktop} />
          <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={ABOUT_HERO.bgImageTablet} />
          <source media="(max-width: 767px)" srcSet={ABOUT_HERO.bgImageMobile} />
          <img
            src={ABOUT_HERO.bgImageDesktop}
            alt="Tentang Smarttani"
            className="w-full h-full object-cover object-center"
          />
        </picture>

        {/* Overlay mobile */}
        {/* <div className="absolute inset-0 bg-black/55 md:hidden" /> */}
      </div>

      {/* Content */}
      <div className="container-smarttani relative z-10 py-10 lg:py-0 mt-10 md:mt-7 lg:mt-17">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">

          {/* Left Column */}
          <div className="lg:col-span-9">
            {/* Badge */}
            <div className="mb-3 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-3 py-1.5 text-caption font-bold text-white">
              {ABOUT_HERO.badge}
            </div>

            <h1 className="text-heading-1 md:text-display text-white mb-3 max-w-sm lg:max-w-lg">
              {ABOUT_HERO.heading}
            </h1>

            <p className="text-body-sm mb-5 max-w-sm md:max-w-md text-white/85">
              {ABOUT_HERO.subtext}
            </p>

            {/* CTA Buttons */}
            <div className="grid grid-cols-2 gap-3 max-w-sm mb-4">
              {ABOUT_HERO_ACTIONS.map(({ prefix, label, icon, className, href }) => (
                <Button
                  key={label}
                  asChild={!!href}
                  onClick={!href ? scrollToDetail : undefined}
                  className={`h-14 justify-start rounded-lg px-4 text-left shadow-lg cursor-pointer ${className}`}
                >
                  {href ? (
                    <Link href={href}>
                      <ButtonContent icon={icon} prefix={prefix} label={label} />
                    </Link>
                  ) : (
                    <ButtonContent icon={icon} prefix={prefix} label={label} />
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

export default HeroAboutSection;
