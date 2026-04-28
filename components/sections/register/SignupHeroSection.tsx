import Image from "next/image";
import { REGISTER_HERO } from "@/constants/register";

export default function RegisterHeroSection() {
  return (
    <section className="relative flex items-start md:items-center overflow-hidden min-h-[850px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source media="(min-width: 1024px)" srcSet={REGISTER_HERO.bgImageDesktop} />
          <source media="(min-width: 768px) and (max-width: 1023px)" srcSet={REGISTER_HERO.bgImageTablet} />
          <source media="(max-width: 767px)" srcSet={REGISTER_HERO.bgImageMobile} />
          <img
            src={REGISTER_HERO.bgImageDesktop}
            alt="Smarttani Registration"
            className="w-full h-full object-cover object-center"
          />
        </picture>
        {/* Gradient Overlay for better text readability - matching home hero style */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A6B2F] via-[#1A6B2F]/80 to-transparent md:via-[#1A6B2F]/60 lg:to-transparent" />
      </div>

      <div className="container-smarttani relative z-10 py-10 lg:py-0 mt-1 md:mt-7 lg:mt-6">
        <div className="grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:items-center lg:gap-8">

          {/* Left Column - Matching Home Hero col-span-9 */}
          <div className="lg:col-span-9 text-white mt-9 md:mt-0">
            {/* Badge */}
            <div className="mb-3 inline-block rounded-lg bg-primary-medium/80 backdrop-blur-sm px-3 py-1.5 text-caption font-bold text-white uppercase tracking-wider">
              {REGISTER_HERO.badge}
            </div>

            <h1 className="text-heading-1 md:text-display text-white mb-3 max-w-sm lg:max-w-lg">
              {REGISTER_HERO.heading}
            </h1>
            <p className="text-body-sm mb-5 max-w-sm md:max-w-md text-white/85">
              {REGISTER_HERO.subtext}
            </p>
          </div>

          {/* Right Column - Kept empty to maintain the 9/3 layout balance like home hero */}
          <div className="hidden lg:col-span-3 lg:block" />
        </div>
      </div>
    </section>
  );
}
