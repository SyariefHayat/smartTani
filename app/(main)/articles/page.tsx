import type { Metadata } from "next";
import { ARTICLE_META } from "@/constants/article";
import Hero from "@/components/sections/articles/Hero";
import StatsBar from "@/components/sections/articles/StatsBar";
import CategoryBar from "@/components/sections/articles/CategoryBar";
import Layout from "@/components/sections/articles/Layout";
import Newsletter from "@/components/sections/articles/Newsletter";

export const metadata: Metadata = {
  title: ARTICLE_META.title,
  description: ARTICLE_META.description,
};

export default function ArtikelPage() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <CategoryBar />
      <Layout />
      <Newsletter />
    </main>
  );
}
