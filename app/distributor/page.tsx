import type { Metadata } from "next";
import { DISTRIBUTOR_META } from "@/constants/distributor";
import DistributorHeroSection from "@/components/sections/distributor/DistributorHeroSection";
import DistributorStatsBarSection from "@/components/sections/distributor/DistributorStatsBarSection";
import DistributorKeuntunganSection from "@/components/sections/distributor/DistributorKeuntunganSection";
import DistributorProdukKategoriSection from "@/components/sections/distributor/DistributorProdukKategoriSection";
import DistributorStepsSection from "@/components/sections/distributor/DistributorStepsSection";
import DistributorCTABannerSection from "@/components/sections/distributor/DistributorCTABannerSection";

export const metadata: Metadata = {
  title: DISTRIBUTOR_META.title,
  description: DISTRIBUTOR_META.description,
};

export default function DistributorPage() {
  return (
    <main className="min-h-screen bg-white">
      <DistributorHeroSection />
      <DistributorStatsBarSection />
      <DistributorKeuntunganSection />
      <DistributorProdukKategoriSection />
      <DistributorStepsSection />
      <DistributorCTABannerSection />
    </main>
  );
}
