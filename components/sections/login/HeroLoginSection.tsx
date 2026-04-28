"use client";

import React from "react";
import { LOGIN_HERO } from "@/constants/login";

const HeroLoginSection = () => {
  return (
    <section className="relative flex items-start md:items-center overflow-hidden min-h-[850px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source media="(min-width: 1024px)" srcSet={LOGIN_HERO.bgImageDesktop} />
          <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={LOGIN_HERO.bgImageTablet} />
          <source media="(max-width: 767px)" srcSet={LOGIN_HERO.bgImageMobile} />
          <img
            src={LOGIN_HERO.bgImageDesktop}
            alt="Masuk ke Smarttani"
            className="w-full h-full object-cover object-center"
          />
        </picture>
      </div>

      {/* Content */}
      <div className="container-smarttani relative z-10 py-10 lg:py-0 mt-10 md:mt-7">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-9">
            {/* Badge */}
            <div className="mb-3 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-3 py-1.5 text-caption font-bold text-white tracking-wider">
              {LOGIN_HERO.badge}
            </div>

            <h1 className="text-heading-1 md:text-display text-white mb-3 max-w-lg lg:max-w-2xl whitespace-pre-line">
              {LOGIN_HERO.heading}
            </h1>

            <p className="text-body-sm mb-5 max-w-sm lg:max-w-md text-white/85">
              {LOGIN_HERO.subtext}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroLoginSection;
