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
      <InvestasiStatsBarSection />
      <ProjectSection />
      
      {/* Advantages & Steps Section */}
      <section className="py-16 bg-[#f8fcf8]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <WhySection />
            <HowSection />
          </div>

          {/* Full-width Green mini CTA banner */}
          <div className="mt-8 rounded-2xl bg-[#17391f] p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                <ShieldCheck className="size-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-base">{INVESTASI_KEUNGGULAN.tagline}</h3>
                <p className="text-[11px] md:text-xs text-white/80">{INVESTASI_KEUNGGULAN.taglineSubtext}</p>
              </div>
            </div>
            <Button className="bg-white text-[#17391f] hover:bg-gray-100 text-xs h-10 px-8 font-bold rounded-full shadow-lg">
              {INVESTASI_KEUNGGULAN.ctaTagline}
            </Button>
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
