import type { Metadata } from "next";
import { ACADEMY_META } from "@/constants/academy";
import AcademyHeroSection from "@/components/sections/academy/AcademyHeroSection";
import AcademyStatsSection from "@/components/sections/academy/AcademyStatsSection";
import AcademyFeaturesSection from "@/components/sections/academy/AcademyFeaturesSection";
import AcademyModelSection from "@/components/sections/academy/AcademyModelSection";
import AcademyCoursesSection from "@/components/sections/academy/AcademyCoursesSection";
import AcademyInfoGridSection from "@/components/sections/academy/AcademyInfoGridSection";
import AcademyMoreInfoGridSection from "@/components/sections/academy/AcademyMoreInfoGridSection";

export const metadata: Metadata = {
  title: ACADEMY_META.title,
  description: ACADEMY_META.description,
};

export default function AcademyPage() {
  return (
    <main>
      <AcademyHeroSection />
      <AcademyStatsSection />
      <AcademyFeaturesSection />
      <AcademyModelSection />
      <AcademyCoursesSection />
      <AcademyInfoGridSection />
      <AcademyMoreInfoGridSection />
    </main>
  );
}

