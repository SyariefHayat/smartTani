import Image from "next/image";
import { ICON_MAP, MARKETPLACE_HERO } from "@/constants/marketplace";

const MarketplaceHeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-[#245a2f]">
      {/* Background Image */}
      <Image
        src="/images/marketplace/hero-bg.webp"
        alt="Marketplace Smarttani"
        width={1920}
        height={1080}
        priority
        quality={90}
        className="absolute inset-0 w-full h-full object-cover object-center"
        sizes="100vw"
      />

      {/* Content */}
      <div className="relative z-10 container-smarttani py-8 sm:py-12 lg:py-10">
        <div className="max-w-2xl">
          {/* Badge Label */}
          <p className="text-white/70 text-[11px] sm:text-xs font-medium uppercase tracking-widest mb-3">
            {MARKETPLACE_HERO.badge}
          </p>

          {/* Heading */}
          <h1 className="text-display mb-4 text-white max-w-2xl">
            {MARKETPLACE_HERO.heading}
          </h1>

          {/* Subtext */}
          <p className="text-body-lg mb-8 text-white/80 max-w-lg">
            {MARKETPLACE_HERO.subtext}
          </p>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {MARKETPLACE_HERO.badges.map((item, index) => {
              const Icon = ICON_MAP[index];
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl border border-white/60 bg-white p-3 sm:p-4 shadow-[0_18px_40px_rgba(9,35,17,0.18)] backdrop-blur-md"
                >
                  <div className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    {Icon && (
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs sm:text-sm font-semibold text-[#17391f] leading-tight truncate">
                      {item.label}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-[#5d7a64] uppercase tracking-wider font-medium mt-0.5 truncate">
                      {item.sublabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceHeroSection;
