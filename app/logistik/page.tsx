import type { Metadata } from "next";
import { LOGISTIC_META } from "@/constants/logistic";
import LogisticHeroSection from "@/components/sections/logistik/LogisticHeroSection";
import LogisticStatsBarSection from "@/components/sections/logistik/LogisticStatsBarSection";
import LogisticLayananSection from "@/components/sections/logistik/LogisticLayananSection";
import JangkauanKeunggulanOngkirSection from "@/components/sections/logistik/JangkauanKeunggulanOngkirSection";
import AlurPengirimanSection from "@/components/sections/logistik/AlurPengirimanSection";
import MitraTransportasiSection from "@/components/sections/logistik/MitraTransportasiSection";
import CTABannerLogistikSection from "@/components/sections/logistik/CTABannerLogistikSection";

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
      <JangkauanKeunggulanOngkirSection />
      <AlurPengirimanSection />
      <MitraTransportasiSection />
      <CTABannerLogistikSection />
    </main>
  );
}
