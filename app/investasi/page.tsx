import type { Metadata } from "next";
import { INVESTASI_META } from "@/constants/investasi";
import InvestasiHeroSection from "@/components/sections/investasi/InvestasiHeroSection";
import InvestasiStatsBarSection from "@/components/sections/investasi/InvestasiStatsBarSection";
import ProjectSection from "@/components/sections/investasi/ProjectSection";
import WhySection from "@/components/sections/investasi/WhySection";
import HowSection from "@/components/sections/investasi/HowSection";
import BottomLayoutSection from "@/components/sections/investasi/BottomLayoutSection";
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
      
      {/* Advantages & Steps Section */}
      <section className="py-16 bg-[#f8fcf8]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <WhySection />
            <HowSection />
          </div>
        </div>
      </section>

      {/* Portfolio, Testimonials, FAQ Section */}
      <BottomLayoutSection />

      {/* Bottom CTA Banner */}
      <CtaSection />
    </main>
  );
}
