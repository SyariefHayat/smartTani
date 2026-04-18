"use client";

import Image from "next/image";
import { MARKETPLACE_HERO } from "@/constants/marketplace";
import { Search } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

const MarketplaceHeroSection = () => {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/marketplace?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <section className="relative min-h-[50vh] md:min-h-[40vh] lg:min-h-[65vh] flex items-center overflow-hidden bg-[#245a2f]">
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
          <p className="text-body-lg text-white/80 max-w-lg mb-8">
            {MARKETPLACE_HERO.subtext}
          </p>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="flex items-center w-full max-w-xl bg-white rounded-xl shadow-lg overflow-hidden p-1.5"
          >
            <div className="pl-4 pr-2 text-neutral-400">
              <Search className="size-5" />
            </div>
            <input
              type="text"
              placeholder="Cari pupuk, benih, atau alat tani..."
              className="flex-1 bg-transparent border-none outline-none text-sm md:text-base text-neutral-800 placeholder:text-neutral-400 h-10 md:h-12"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-white px-6 md:px-8 py-2 md:py-3 rounded-lg font-bold transition-colors cursor-pointer"
            >
              Cari
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MarketplaceHeroSection;
