import type { Metadata } from "next";
import { INVESTASI_META } from "@/constants/investasi";
import InvestasiHeroSection from "@/components/sections/investasi/InvestasiHeroSection";
import InvestasiStatsBarSection from "@/components/sections/investasi/InvestasiStatsBarSection";
import ProjectSection from "@/components/sections/investasi/ProjectSection";
import WhySection from "@/components/sections/investasi/WhySection";
import HowSection from "@/components/sections/investasi/HowSection";
import TestimoniSection from "@/components/sections/investasi/TestimoniSection";
import CtaSection from "@/components/sections/investasi/CtaSection";

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
      <InvestasiStatsBarSection />
      <ProjectSection />
      <WhySection />
      <HowSection />
      <TestimoniSection />
      <CtaSection />
    </main>
  );
}
