import type { Metadata } from "next";
import { MARKETPLACE_META } from "@/constants/marketplace";
import MarketplaceHeroSection from "@/components/sections/marketplace/MarketplaceHeroSection";
import ProductTabsSection from "@/components/sections/marketplace/ProductTabsSection";
import TrustBarSection from "@/components/sections/marketplace/TrustBarSection";
import CategoriSection from "@/components/sections/marketplace/CategoriSection";
import BestSellingProductSection from "@/components/sections/marketplace/BestSellingProductSection";
import WhyMarketplaceSection from "@/components/sections/marketplace/WhyMarketplaceSection";
import MarketplaceLayoutSection from "@/components/sections/marketplace/MarketplaceLayoutSection";

export const metadata: Metadata = {
  title: MARKETPLACE_META.title,
  description: MARKETPLACE_META.description,
};

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* 1. Hero Banner */}
      <MarketplaceHeroSection />
      
      {/* 2. Trust Bar (Small section after hero) */}
      <TrustBarSection />

      {/* 3. Kategori Populer (Before layout for wide view) */}
      <CategoriSection />

      {/* 4. Main Marketplace Layout (Sidebar Filter + Content) */}
      <MarketplaceLayoutSection>
        {/* All product content goes here */}
        <ProductTabsSection />
        <BestSellingProductSection />
        <WhyMarketplaceSection />
      </MarketplaceLayoutSection>
    </main>
  );
}
