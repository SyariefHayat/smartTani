import type { Metadata } from "next";
import { DISTRIBUTOR_META } from "@/constants/distributor";
import DistributorHeroSection from "@/components/sections/distributor/DistributorHeroSection";
import StatsBarDistributorSection from "@/components/sections/distributor/StatsBarDistributorSection";
import DistributorKeuntunganSection from "@/components/sections/distributor/DistributorKeuntunganSection";
import DistributorProdukKategoriSection from "@/components/sections/distributor/DistributorProdukKategoriSection";
import DistributorInfoCardsSection from "@/components/sections/distributor/DistributorInfoCardsSection";
import DistributorCTABannerSection from "@/components/sections/distributor/DistributorCTABannerSection";

export const metadata: Metadata = {
  title: DISTRIBUTOR_META.title,
  description: DISTRIBUTOR_META.description,
};

export default function DistributorPage() {
  return (
    <main className="min-h-screen bg-white">
      <DistributorHeroSection />
      <StatsBarDistributorSection />
      <DistributorKeuntunganSection />
      <DistributorProdukKategoriSection />
      <DistributorInfoCardsSection />
      <DistributorCTABannerSection />
    </main>
  );
}
