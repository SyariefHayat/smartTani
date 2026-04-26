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
      {/* <InvestmentStatsBarSection /> */}
      <ProjectSection />

      {/* Advantages & Steps Section */}
      <section className="">
        <div className="container-smarttani">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            <WhySection />
            <HowSection />
          </div>

          {/* Full-width Green mini CTA banner */}
          <div className="mt-8 rounded-2xl bg-primary-dark p-6 text-white flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex size-10 items-center justify-center rounded-full bg-white/20">
                <ShieldCheck className="size-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-body-sm md:text-body">{INVESTMENT_ADVANTAGES.tagline}</h3>
                <p className="text-caption text-white/80">{INVESTMENT_ADVANTAGES.taglineSubtext}</p>
              </div>
            </div>
            <Button className="bg-white !text-primary-dark hover:bg-slate-100 text-caption h-10 px-8 font-bold rounded-full shadow-lg cursor-pointer">
              {INVESTMENT_ADVANTAGES.ctaTagline}
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

