import type { Metadata } from "next";
import { ACADEMY_META } from "@/constants/academy";
import Hero from "@/components/sections/academy/Hero";
import Stats from "@/components/sections/academy/Stats";
import Features from "@/components/sections/academy/Features";
import Model from "@/components/sections/academy/Model";
import Courses from "@/components/sections/academy/Courses";
import InfoGrid from "@/components/sections/academy/InfoGrid";
import MoreInfoGrid from "@/components/sections/academy/MoreInfoGrid";

export const metadata: Metadata = {
  title: ACADEMY_META.title,
  description: ACADEMY_META.description,
};

export default function AcademyPage() {
  return (
    <main>
      <Hero />
      <Stats />
      <Features />
      <Model />
      <Courses />
      <InfoGrid />
      <MoreInfoGrid />
    </main>
  );
}

