import Image from "next/image";
import { REGISTER_HERO } from "@/constants/register";

export default function RegisterHeroSection() {
  return (
    <section className="relative flex items-start md:items-center overflow-hidden min-h-[850px] md:min-h-[460px] lg:min-h-[420px]">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <picture className="block w-full h-full">
          <source
            media="(min-width: 1024px)"
            srcSet={REGISTER_HERO.bgImageDesktop}
          />
          <source
            media="(min-width: 768px) and (max-width: 1023px)"
            srcSet={REGISTER_HERO.bgImageTablet}
          />
          <source
            media="(max-width: 767px)"
            srcSet={REGISTER_HERO.bgImageMobile}
          />
          <img
            src={REGISTER_HERO.bgImageDesktop}
            alt="Smarttani Registration"
            className="w-full h-full object-cover object-center"
          />
        </picture>
      </div>
    </section>
  );
}
