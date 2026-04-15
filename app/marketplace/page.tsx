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
      {/* 1. Hero Banner (Full Width) */}
      <MarketplaceHeroSection />
      
      {/* 2. Main Layout (Sidebar + Main Content) */}
      <MarketplaceLayoutSection>
        {/* Seksi-seksi di bawah ini akan muncul di sisi kanan sidebar */}
        
        {/* A. Produk Pilihan (Tab + Grid) */}
        <ProductTabsSection />

        {/* B. Trust Bar (Fitur Layanan) */}
        <TrustBarSection />

        {/* C. Kategori Populer */}
        <CategoriSection />

        {/* D. Produk Terlaris */}
        <BestSellingProductSection />
      </MarketplaceLayoutSection>

      {/* 3. Kenapa Belanja (Full Width - Di bawah sistem sidebar) */}
      <WhyMarketplaceSection />
    </main>
  );
}
