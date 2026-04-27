import type { Metadata } from "next";
import { LOGISTICS_META } from "@/constants/logistics";
import LogisticHeroSection from "@/components/sections/logistics/LogisticHeroSection";
import LogisticStatsBarSection from "@/components/sections/logistics/LogisticStatsBarSection";
import LogisticServicesSection from "@/components/sections/logistics/LogisticServicesSection";
import CoverageAdvantagesSection from "@/components/sections/logistics/CoverageAdvantagesSection";
import ShippingFlowSection from "@/components/sections/logistics/ShippingFlowSection";
import TransportationPartnersSection from "@/components/sections/logistics/TransportationPartnersSection";
import CTABannerLogisticsSection from "@/components/sections/logistics/CTABannerLogisticsSection";

export const metadata: Metadata = {
  title: LOGISTICS_META.title,
  description: LOGISTICS_META.description,
};

export default function LogisticPage() {
  return (
    <main>
      <LogisticHeroSection />
      <LogisticStatsBarSection />
      <LogisticServicesSection />
      <CoverageAdvantagesSection />
      <ShippingFlowSection />
      <TransportationPartnersSection />
      <CTABannerLogisticsSection />
    </main>
  );
}

