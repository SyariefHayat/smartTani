import React from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { MARKETPLACE_HERO } from '@/constants/marketplace';
import { ShieldCheck, Tag, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = [ShieldCheck, Tag, Truck];

const MarketplaceHeroSection = () => {
  return (
    <section className="relative overflow-hidden min-h-[320px] lg:min-h-[400px] bg-primary-dark">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/marketplace/hero-bg.webp"
          alt=""
          fill
          className="object-cover object-right opacity-40 lg:opacity-70"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/70 to-transparent" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container-smarttani py-10 lg:py-20">
        <div className="max-w-3xl">
          {/* Top Badge */}
          <Badge 
            variant="secondary" 
            className="bg-accent text-primary-dark font-semibold mb-4 px-3 py-1 hover:bg-accent/90"
          >
            {MARKETPLACE_HERO.badge}
          </Badge>

          {/* Heading */}
          <h1 className="text-heading-1 lg:text-display text-white font-bold leading-tight mb-4">
            {MARKETPLACE_HERO.heading}
          </h1>

          {/* Subtext */}
          <p className="text-body md:text-body-lg text-white/85 max-w-xl mb-8">
            {MARKETPLACE_HERO.subtext}
          </p>

          {/* Trust Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
            {MARKETPLACE_HERO.badges.map((item, index) => {
              const Icon = iconMap[index];
              return (
                <div 
                  key={index} 
                  className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 hover:bg-white/20 transition-all cursor-default"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                    {Icon && <Icon className="w-5 h-5 text-accent" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-body-sm font-semibold text-white leading-tight">
                      {item.label}
                    </span>
                    <span className="text-[10px] text-white/60 uppercase tracking-wider font-medium mt-0.5">
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
