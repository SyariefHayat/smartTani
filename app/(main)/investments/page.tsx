import type { Metadata } from "next";
import { INVESTMENT_META } from "@/constants/investments";
import Hero from "@/components/sections/investments/Hero";
import StatsBar from "@/components/sections/investments/StatsBar";
import Projects from "@/components/sections/investments/Projects";
import Why from "@/components/sections/investments/Why";
import How from "@/components/sections/investments/How";
import BottomLayout from "@/components/sections/investments/BottomLayout";
import CTA from "@/components/sections/investments/CTA";

export const metadata: Metadata = {
  title: {
    absolute: INVESTMENT_META.title,
  },
  description: INVESTMENT_META.description,
};

export default function InvestasiPage() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <Projects />

      <Why />
      <How />

      {/* Portfolio, Testimonials, FAQ Section */}
      <BottomLayout />

      {/* Bottom CTA Banner */}
      <CTA />
    </main>
  );
}
