import type { Metadata } from "next";
import { LOGISTIC_META } from "@/constants/logistic";
import LogisticHeroSection from "@/components/sections/logistics/LogisticHeroSection";
import LogisticStatsBarSection from "@/components/sections/logistics/LogisticStatsBarSection";
import LogisticLayananSection from "@/components/sections/logistics/LogisticLayananSection";
import JangkauanKeunggulanOngkirSection from "@/components/sections/logistics/JangkauanKeunggulanOngkirSection";
import AlurPengirimanSection from "@/components/sections/logistics/AlurPengirimanSection";
import MitraTransportasiSection from "@/components/sections/logistics/MitraTransportasiSection";
import CTABannerLogistikSection from "@/components/sections/logistics/CTABannerLogistikSection";

export const metadata: Metadata = {
  title: LOGISTIC_META.title,
  description: LOGISTIC_META.description,
};

export default function LogisticPage() {
  return (
    <main>
      <LogisticHeroSection />
      {/* <LogisticStatsBarSection /> */}
      <LogisticLayananSection />
      <JangkauanKeunggulanOngkirSection />
      <AlurPengirimanSection />
      <MitraTransportasiSection />
      <CTABannerLogistikSection />
    </main>
  );
}
