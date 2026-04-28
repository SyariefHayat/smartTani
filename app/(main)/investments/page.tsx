import type { Metadata } from "next";
import { INVESTMENT_META, INVESTMENT_ADVANTAGES } from "@/constants/investments";
import InvestmentHeroSection from "@/components/sections/investments/InvestmentHeroSection";
import InvestmentStatsBarSection from "@/components/sections/investments/InvestmentStatsBarSection";
import ProjectSection from "@/components/sections/investments/ProjectSection";
import WhySection from "@/components/sections/investments/WhySection";
import HowSection from "@/components/sections/investments/HowSection";
import BottomLayoutSection from "@/components/sections/investments/BottomLayoutSection";
import CtaSection from "@/components/sections/investments/CtaSection";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: INVESTMENT_META.title,
  },
  description: INVESTMENT_META.description,
};

export default function InvestasiPage() {
  return (
    <main>
      <InvestmentHeroSection />
      <InvestmentStatsBarSection />
      <ProjectSection />

      <WhySection />
      <HowSection />

      {/* Portfolio, Testimonials, FAQ Section */}
      <BottomLayoutSection />

      {/* Bottom CTA Banner */}
      <CtaSection />
    </main>
  );
}
