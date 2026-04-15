import type { Metadata } from "next";
import { MARKETPLACE_META } from "@/constants/marketplace";
import MarketplaceHeroSection from "@/components/sections/marketplace/MarketplaceHeroSection";
import ProductTabsSection from "@/components/sections/marketplace/ProductTabsSection";
import TrustBarSection from "@/components/sections/marketplace/TrustBarSection";
import CategoriSection from "@/components/sections/marketplace/CategoriSection";
import BestSellingProductSection from "@/components/sections/marketplace/BestSellingProductSection";
import WhyMarketplaceSection from "@/components/sections/marketplace/WhyMarketplaceSection";

export const metadata: Metadata = {
  title: MARKETPLACE_META.title,
  description: MARKETPLACE_META.description,
};

export default function MarketplacePage() {
  return (
    <main className="min-h-screen">
      <MarketplaceHeroSection />
      <ProductTabsSection />
      <TrustBarSection />
      <CategoriSection />
      <BestSellingProductSection />
      <WhyMarketplaceSection />
    </main>
  );
}
