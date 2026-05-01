import type { Metadata } from "next";
import { MARKETPLACE_META } from "@/constants/marketplace";
import Hero from "@/components/sections/marketplace/Hero";
import TabsFilter from "@/components/sections/marketplace/TabsFilter";
import TrustBar from "@/components/sections/marketplace/TrustBar";
import BestSelling from "@/components/sections/marketplace/BestSelling";
import WhyMarketplace from "@/components/sections/marketplace/WhyMarketplace";
import Layout from "@/components/sections/marketplace/Layout";
import Categories from "@/components/sections/marketplace/Categories";

export const metadata: Metadata = {
  title: MARKETPLACE_META.title,
  description: MARKETPLACE_META.description,
};

export default function MarketplacePage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <Layout>
        <TabsFilter />
        {/* <TrustBar /> */}
        <Categories />
        <BestSelling />
      </Layout>
      {/* <WhyMarketplace /> */}
    </main>
  );
}
