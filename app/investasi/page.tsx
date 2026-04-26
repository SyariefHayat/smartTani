import type { Metadata } from "next";
import { INVESTASI_META, INVESTASI_KEUNGGULAN } from "@/constants/investasi";
import InvestasiHeroSection from "@/components/sections/investasi/InvestasiHeroSection";
import InvestasiStatsBarSection from "@/components/sections/investasi/InvestasiStatsBarSection";
import ProjectSection from "@/components/sections/investasi/ProjectSection";
import WhySection from "@/components/sections/investasi/WhySection";
import HowSection from "@/components/sections/investasi/HowSection";
import BottomLayoutSection from "@/components/sections/investasi/BottomLayoutSection";
import CtaSection from "@/components/sections/investasi/CtaSection";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: INVESTASI_META.title,
  },
  description: INVESTASI_META.description,
};

export default function InvestasiPage() {
  return (
    <main>
      <InvestasiHeroSection />
      {/* <InvestasiStatsBarSection /> */}
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
