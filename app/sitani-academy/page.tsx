import type { Metadata } from "next";
import { ACADEMY_META } from "@/constants/sitani-academy";
import AcademyHeroSection from "@/components/sections/academy/AcademyHeroSection";
import AcademyStatsSection from "@/components/sections/academy/AcademyStatsSection";
import AcademyFiturSection from "@/components/sections/academy/AcademyFiturSection";
import AcademyModelSection from "@/components/sections/academy/AcademyModelSection";
import AcademyKursusSection from "@/components/sections/academy/AcademyKursusSection";
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
      <AcademyFiturSection />
      <AcademyModelSection />
      <AcademyKursusSection />
      <AcademyInfoGridSection />
      <AcademyMoreInfoGridSection />
    </main>
  );
}
