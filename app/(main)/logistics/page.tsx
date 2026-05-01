import type { Metadata } from "next";
import { LOGISTICS_META } from "@/constants/logistics";
import Hero from "@/components/sections/logistics/Hero";
import StatsBar from "@/components/sections/logistics/StatsBar";
import Services from "@/components/sections/logistics/Services";
import CoverageAdvantages from "@/components/sections/logistics/CoverageAdvantages";
import ShippingFlow from "@/components/sections/logistics/ShippingFlow";
import Partners from "@/components/sections/logistics/Partners";
import CTA from "@/components/sections/logistics/CTA";

export const metadata: Metadata = {
  title: LOGISTICS_META.title,
  description: LOGISTICS_META.description,
};

export default function LogisticPage() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <Services />
      <CoverageAdvantages />
      <ShippingFlow />
      <Partners />
      <CTA />
    </main>
  );
}

