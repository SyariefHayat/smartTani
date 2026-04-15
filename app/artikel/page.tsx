import type { Metadata } from "next";
import { ARTICLE_META } from "@/constants/article";
import ArtikelHeroSection from "@/components/sections/artikel/ArtikelHeroSection";
import ArtikelStatsBarSection from "@/components/sections/artikel/ArtikelStatsBarSection";
import ArtikelKategoriBarSection from "@/components/sections/artikel/ArtikelKategoriBarSection";
import ArtikelLayoutSection from "@/components/sections/artikel/ArtikelLayoutSection";
import ArtikelNewsletterSection from "@/components/sections/artikel/ArtikelNewsletterSection";

export const metadata: Metadata = {
  title: ARTICLE_META.title,
  description: ARTICLE_META.description,
};

export default function ArtikelPage() {
  return (
    <main>
      <ArtikelHeroSection />
      <ArtikelKategoriBarSection />
      <ArtikelLayoutSection />
      <ArtikelStatsBarSection />
      <ArtikelNewsletterSection />
    </main>
  );
}
