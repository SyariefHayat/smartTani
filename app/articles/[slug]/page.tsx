import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ARTICLE_ITEMS, ARTICLE_MOST_POPULAR } from "@/constants/article";
import { slugify } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ChevronRight,
  Share2,
  BookmarkPlus,
} from "lucide-react";
import ArticleNewsletterSection from "@/components/sections/articles/ArticleNewsletterSection";

// Generate static params for all articles
export function generateStaticParams() {
  return ARTICLE_ITEMS.map((artikel) => ({
    slug: slugify(artikel.title),
  }));
}

// Generate metadata for each article
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const artikel = ARTICLE_ITEMS.find((a) => slugify(a.title) === slug);

  if (!artikel) {
    return { title: "Artikel Tidak Ditemukan" };
  }

  return {
    title: artikel.title,
    description: artikel.description,
  };
}

export default async function ArtikelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const artikel = ARTICLE_ITEMS.find((a) => slugify(a.title) === slug);

  if (!artikel) {
    notFound();
  }

  // Get related articles (same category, excluding current)
  const relatedArticles = ARTICLE_ITEMS.filter(
    (a) => a.kategori === artikel.kategori && a.title !== artikel.title
  ).slice(0, 3);

  // Fallback to other articles if no same-category articles
  const sidebarArticles =
    relatedArticles.length > 0
      ? relatedArticles
      : ARTICLE_ITEMS.filter((a) => a.title !== artikel.title).slice(0, 3);

  return (
    <>
      {/* Hero Banner */}
      <section className="relative min-h-[340px] md:min-h-[400px] lg:min-h-[440px] flex items-end overflow-hidden">
        {/* Background: Video YouTube atau Image biasa */}
        <div className="absolute inset-0 z-0">
          {artikel.youtubeId ? (
            <>
              {/* iframe YouTube: autoplay, muted, loop, no controls */}
              <iframe
                src={`https://www.youtube.com/embed/${artikel.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${artikel.youtubeId}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&vq=hd720`}
                title={artikel.title}
                allow="autoplay; encrypted-media"
                className="absolute w-full h-full border-0 pointer-events-none"
                style={{
                  // Scale up supaya tidak ada letterbox hitam
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) scale(1.5)",
                  minWidth: "100%",
                  minHeight: "100%",
                  width: "177.78vh", // 16:9 ratio
                  height: "56.25vw", // 16:9 ratio
                }}
              />
            </>
          ) : (
            <Image
              src={artikel.image}
              alt={artikel.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        </div>

        {/* Content Overlay — tidak berubah */}
        <div className="container-smarttani relative z-10 pb-10 pt-20 md:pb-14 md:pt-24">
          {/* ... breadcrumb, badge, title, meta — sama seperti sebelumnya */}
        </div>
      </section>

      {/* Article Body */}
      <section className="bg-white">
        <div className="container-smarttani">
          <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
            {/* Main Content */}
            <article className="flex-1 lg:max-w-[70%]">
              {/* Action Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 py-5">
                <Link
                  href="/articles"
                  className="group flex items-center gap-2 text-body-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
                >
                  <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                  Kembali ke Artikel
                </Link>
                <div className="flex items-center gap-3">
                  <button
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-caption font-semibold text-muted-foreground transition-all hover:bg-slate-50 hover:text-primary"
                    aria-label="Bagikan artikel"
                  >
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Bagikan</span>
                  </button>
                  <button
                    className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-caption font-semibold text-muted-foreground transition-all hover:bg-slate-50 hover:text-primary"
                    aria-label="Simpan artikel"
                  >
                    <BookmarkPlus className="h-4 w-4" />
                    <span className="hidden sm:inline">Simpan</span>
                  </button>
                </div>
              </div>

              {/* Article Paragraphs */}
              <div className="py-8 md:py-10">
                {/* Description as lead paragraph */}
                <p className="text-body-lg font-medium text-foreground mb-6 leading-relaxed">
                  {artikel.description}
                </p>

                {/* Body Content */}
                <div className="space-y-5">
                  {artikel.konten.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-body text-muted-foreground leading-[1.85]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Tags / Footer */}
              <div className="border-t border-slate-100 py-6">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-caption font-bold text-foreground mr-2">
                    Tags:
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-caption font-medium text-muted-foreground transition-colors hover:bg-primary-light hover:text-primary">
                    {artikel.kategori.toLowerCase()}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-caption font-medium text-muted-foreground transition-colors hover:bg-primary-light hover:text-primary">
                    pertanian
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-caption font-medium text-muted-foreground transition-colors hover:bg-primary-light hover:text-primary">
                    smarttani
                  </span>
                </div>
              </div>

              {/* Author Card */}
              <div className="rounded-2xl bg-slate-50 p-6 md:p-8">
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                  <Avatar className="h-16 w-16 shrink-0 border-2 border-white shadow-md">
                    <AvatarImage
                      src={artikel.penulis.avatar}
                      alt={artikel.penulis.nama}
                    />
                    <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
                      {artikel.penulis.nama.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <p className="text-caption font-semibold text-muted-foreground mb-1">
                      Ditulis oleh
                    </p>
                    <h3 className="text-body font-bold text-foreground">
                      {artikel.penulis.nama}
                    </h3>
                    <p className="text-body-sm text-muted-foreground mt-1">
                      {artikel.penulis.gelar}
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="w-full lg:w-[30%] lg:shrink-0 pt-0 lg:pt-5">
              <div className="flex flex-col gap-10 lg:sticky lg:top-24">
                {/* Related Articles */}
                <div>
                  <h3 className="mb-6 text-body font-bold text-foreground">
                    Artikel Terkait
                  </h3>
                  <div className="flex flex-col gap-5">
                    {sidebarArticles.map((related) => (
                      <Link
                        key={related.title}
                        href={`/articles/${slugify(related.title)}`}
                        className="group flex items-start gap-4"
                      >
                        <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                          <Image
                            src={related.image}
                            alt={related.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="mb-1 text-caption font-bold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
                            {related.title}
                          </h4>
                          <p className="text-caption text-muted-foreground">
                            {related.tanggal}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Trending Articles */}
                <div className="rounded-2xl bg-slate-50 p-6">
                  <h3 className="mb-6 text-body font-bold text-foreground">
                    Artikel Terpopuler
                  </h3>
                  <div className="flex flex-col gap-4">
                    {ARTICLE_MOST_POPULAR.slice(0, 4).map((trending) => {
                      // Find matching full article for slug
                      const matchedArticle = ARTICLE_ITEMS.find((a) =>
                        a.title
                          .toLowerCase()
                          .includes(trending.title.toLowerCase().slice(0, 20))
                      );
                      const trendingSlug = matchedArticle
                        ? slugify(matchedArticle.title)
                        : slugify(trending.title);

                      return (
                        <Link
                          key={trending.rank}
                          href={`/articles/${trendingSlug}`}
                          className="group flex items-start gap-3"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-caption font-bold text-primary">
                            {trending.rank}
                          </span>
                          <div>
                            <h4 className="text-caption font-bold leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2">
                              {trending.title}
                            </h4>
                            <p className="mt-1 text-[10px] text-muted-foreground">
                              {trending.tanggal}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <ArticleNewsletterSection />
    </>
  );
}
