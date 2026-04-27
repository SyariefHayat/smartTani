import type { Metadata } from "next";
import { DISTRIBUTOR_META } from "@/constants/distributor";
import DistributorHeroSection from "@/components/sections/distributors/DistributorHeroSection";
import DistributorStatsBarSection from "@/components/sections/distributors/DistributorStatsBarSection";
import DistributorBenefitsSection from "@/components/sections/distributors/DistributorBenefitsSection";
import DistributorProductCategorySection from "@/components/sections/distributors/DistributorProductCategorySection";
import DistributorInfoCardsSection from "@/components/sections/distributors/DistributorInfoCardsSection";
import DistributorSuccessSection from "@/components/sections/distributors/DistributorSuccessSection";

export const metadata: Metadata = {
  title: DISTRIBUTOR_META.title,
  description: DISTRIBUTOR_META.description,
};

export default function DistributorPage() {
  return (
    <main className="min-h-screen bg-white">
      <DistributorHeroSection />
      <DistributorStatsBarSection />
      <DistributorBenefitsSection />
      <DistributorProductCategorySection />
      <DistributorInfoCardsSection />
      <DistributorSuccessSection />
    </main>
  );
}
