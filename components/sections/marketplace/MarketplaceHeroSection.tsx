import Image from "next/image";
import { ICON_MAP, MARKETPLACE_HERO } from "@/constants/marketplace";

const MarketplaceHeroSection = () => {
  return (
    <section className="relative min-h-screen md:min-h-[40vh] lg:min-h-[65vh] flex items-center overflow-hidden bg-[#245a2f]">
      {/* Background Image */}
      <Image
        src="/images/marketplace/hero-bg.png"
        alt="Marketplace Smarttani"
        width={1920}
        height={1080}
        priority
        quality={90}
        className="absolute inset-0 w-full h-full object-cover object-right"
        sizes="100vw"
      />

      {/* Content */}
      <div className="relative z-10 container-smarttani">
        <div className="max-w-3xl">
          {/* Badge Label */}
          <p className="text-white/70 text-[11px] sm:text-xs font-medium uppercase tracking-widest mb-3">
            {MARKETPLACE_HERO.badge}
          </p>

          {/* Heading */}
          <h1 className="text-display mb-4 text-white max-w-2xl">
            {MARKETPLACE_HERO.heading}
          </h1>

          {/* Subtext */}
          <p className="text-body-lg text-white/80 max-w-lg">
            {MARKETPLACE_HERO.subtext}
          </p>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceHeroSection;
