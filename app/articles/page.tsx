import type { Metadata } from "next";
import { ARTICLE_META } from "@/constants/article";
import ArticleHeroSection from "@/components/sections/articles/ArticleHeroSection";
import ArticleStatsBarSection from "@/components/sections/articles/ArticleStatsBarSection";
import ArticleCategoryBarSection from "@/components/sections/articles/ArticleCategoryBarSection";
import ArticleLayoutSection from "@/components/sections/articles/ArticleLayoutSection";
import ArticleNewsletterSection from "@/components/sections/articles/ArticleNewsletterSection";

export const metadata: Metadata = {
  title: ARTICLE_META.title,
  description: ARTICLE_META.description,
};

export default function ArtikelPage() {
  return (
    <main>
      <ArticleHeroSection />
      <ArticleStatsBarSection />
      <ArticleCategoryBarSection />
      <ArticleLayoutSection />
      <ArticleNewsletterSection />
    </main>
  );
}
