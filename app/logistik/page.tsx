import type { Metadata } from "next";
import { LOGISTIC_META } from "@/constants/logistic";
import LogisticHeroSection from "@/components/sections/logistik/LogisticHeroSection";
import LogisticStatsBarSection from "@/components/sections/logistik/LogisticStatsBarSection";
import LogisticLayananSection from "@/components/sections/logistik/LogisticLayananSection";
import LogisticCekOngkirSection from "@/components/sections/logistik/LogisticCekOngkirSection";
import LogisticKeunggulanSection from "@/components/sections/logistik/LogisticKeunggulanSection";
import LogisticStepsSection from "@/components/sections/logistik/LogisticStepsSection";
import LogisticMitraSection from "@/components/sections/logistik/LogisticMitraSection";
import LogisticCTABannerSection from "@/components/sections/logistik/LogisticCTABannerSection";

export const metadata: Metadata = {
  title: LOGISTIC_META.title,
  description: LOGISTIC_META.description,
};

export default function LogisticPage() {
  return (
    <main className="min-h-screen bg-white">
      <LogisticHeroSection />
      <LogisticStatsBarSection />
      <LogisticLayananSection />
      <LogisticCekOngkirSection />
      <LogisticKeunggulanSection />
      <LogisticStepsSection />
      <LogisticMitraSection />
      <LogisticCTABannerSection />
    </main>
  );
}
