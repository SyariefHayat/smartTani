import type { Metadata } from "next";
import { DISTRIBUTOR_META } from "@/constants/distributor";
import Hero from "@/components/sections/distributors/Hero";
import StatsBar from "@/components/sections/distributors/StatsBar";
import Benefits from "@/components/sections/distributors/Benefits";
import ProductCategory from "@/components/sections/distributors/ProductCategory";
import InfoCards from "@/components/sections/distributors/InfoCards";
import Success from "@/components/sections/distributors/Success";

export const metadata: Metadata = {
  title: DISTRIBUTOR_META.title,
  description: DISTRIBUTOR_META.description,
};

export default function DistributorPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <StatsBar />
      <Benefits />
      <ProductCategory />
      <InfoCards />
      <Success />
    </main>
  );
}
