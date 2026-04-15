import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MARKETPLACE_BANNER_MITRA } from '@/constants/marketplace';

const MitraBannerSection = () => {
  return (
    <div className="bg-primary-dark rounded-xl p-6 text-white overflow-hidden relative group">
      {/* Decorative store illustration - Using opacity as requested */}
      <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none aria-hidden select-none group-hover:scale-110 transition-transform duration-500">
        <Image
          src="/images/home/keranjang-belanja.webp" // Placeholder illustration from available public images
          alt=""
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      <div className="relative z-10">
        <h4 className="text-heading-3 font-bold text-white leading-tight">
          {MARKETPLACE_BANNER_MITRA.heading}
        </h4>
        <p className="text-caption text-white/80 mt-2 mb-6 max-w-[180px]">
          {MARKETPLACE_BANNER_MITRA.subtext}
        </p>
        <Button 
          asChild
          variant="outline" 
          className="border-white text-white hover:bg-white hover:text-primary-dark w-full transition-colors"
        >
          <Link href="/daftar?role=penjual">
            {MARKETPLACE_BANNER_MITRA.cta.label}
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MitraBannerSection;
