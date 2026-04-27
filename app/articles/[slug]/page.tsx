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
      <section className="relative min-h-[400px] md:min-h-[500px] lg:min-h-[600px] flex items-end overflow-hidden">
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
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%) scale(1.5)",
                  minWidth: "100%",
                  minHeight: "100%",
                  width: "177.78vh",
                  height: "56.25vw",
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
          <div className="absolute inset-0 bg-gradient-to-t from-[#17391f] via-[#17391f]/40 to-black/20" />
        </div>

        {/* Content Overlay */}
        <div className="container-smarttani relative z-10 pb-12 pt-24 md:pb-16 md:pt-32">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/70">
            <Link href="/" className="hover:text-white transition-colors">Beranda</Link>
            <ChevronRight className="size-3" />
            <Link href="/articles" className="hover:text-white transition-colors">Artikel</Link>
            <ChevronRight className="size-3" />
            <span className="text-white line-clamp-1">{artikel.title}</span>
          </nav>

          <Badge className="bg-primary !text-white text-[10px] font-extrabold px-3 py-1 border-none rounded-lg shadow-lg mb-6 uppercase tracking-wider">
            {artikel.kategori}
          </Badge>

          <h1 className="text-3xl font-extrabold md:text-display lg:text-6xl text-white leading-tight mb-8 max-w-4xl">
            {artikel.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-white/80">
            <div className="flex items-center gap-3">
              <Avatar className="size-10 ring-2 ring-white/20">
                <AvatarImage src={artikel.penulis.avatar} alt={artikel.penulis.nama} />
                <AvatarFallback className="bg-white/10 text-xs font-bold text-white">
                  {artikel.penulis.nama.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-extrabold text-white leading-tight">{artikel.penulis.nama}</p>
                <p className="text-[10px] font-medium text-white/60">{artikel.penulis.gelar}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <Calendar className="size-4 text-accent" />
              <span>{artikel.tanggal}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <Clock className="size-4 text-accent" />
              <span>{artikel.waktuBaca}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <section className="bg-white py-12 md:py-20">
        <div className="container-smarttani">
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            {/* Main Content */}
            <article className="flex-1 lg:max-w-[70%]">
              {/* Action Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-6">
                <Link
                  href="/articles"
                  className="group flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-[#5d7a64] transition-colors hover:text-primary"
                >
                  <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
                  Kembali
                </Link>
                <div className="flex items-center gap-3">
                  <button
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#5d7a64] transition-all hover:bg-slate-50 hover:text-primary cursor-pointer border border-slate-100"
                    aria-label="Bagikan artikel"
                  >
                    <Share2 className="size-4" />
                    <span className="hidden sm:inline">Bagikan</span>
                  </button>
                  <button
                    className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-[#5d7a64] transition-all hover:bg-slate-50 hover:text-primary cursor-pointer border border-slate-100"
                    aria-label="Simpan artikel"
                  >
                    <BookmarkPlus className="size-4" />
                    <span className="hidden sm:inline">Simpan</span>
                  </button>
                </div>
              </div>

              {/* Article Paragraphs */}
              <div className="py-10 md:py-14">
                {/* Description as lead paragraph */}
                <p className="text-lg font-bold text-[#17391f] mb-10 leading-relaxed md:text-xl border-l-4 border-primary pl-6 py-2 bg-primary-light/30 rounded-r-2xl">
                  {artikel.description}
                </p>

                {/* Body Content */}
                <div className="space-y-6">
                  {artikel.konten.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-base md:text-lg text-[#5d7a64] font-medium leading-[1.8] text-justify"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Tags / Footer */}
              <div className="border-t border-slate-100 py-8">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-[#17391f] mr-2">
                    Tags:
                  </span>
                  {["budidaya", "pertanian", "modern", "smarttani"].map((tag) => (
                    <span key={tag} className="rounded-xl bg-slate-50 px-4 py-2 text-[10px] font-extrabold uppercase tracking-wider text-[#5d7a64] transition-all hover:bg-primary hover:text-white cursor-pointer border border-slate-100">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Author Card */}
              <div className="rounded-3xl bg-slate-50 p-8 md:p-10 border border-slate-100 shadow-sm mt-8">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                  <Avatar className="size-20 shrink-0 ring-4 ring-white shadow-xl">
                    <AvatarImage
                      src={artikel.penulis.avatar}
                      alt={artikel.penulis.nama}
                    />
                    <AvatarFallback className="bg-primary/10 text-xl font-bold text-primary">
                      {artikel.penulis.nama.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-center sm:text-left">
                    <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-primary mb-2">
                      Ditulis oleh
                    </p>
                    <h3 className="text-xl font-extrabold text-[#17391f] mb-1">
                      {artikel.penulis.nama}
                    </h3>
                    <p className="text-sm font-medium text-[#5d7a64]">
                      {artikel.penulis.gelar}
                    </p>
                    <p className="mt-4 text-xs font-medium text-[#5d7a64] leading-relaxed max-w-lg">
                      Pakar berpengalaman yang berdedikasi untuk memajukan sektor pertanian Indonesia melalui wawasan dan teknologi modern.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="w-full lg:w-[30%] lg:shrink-0">
              <div className="flex flex-col gap-12 lg:sticky lg:top-28">
                {/* Related Articles */}
                <div>
                  <h3 className="mb-8 text-lg font-extrabold text-[#17391f]">
                    Artikel Terkait
                  </h3>
                  <div className="flex flex-col gap-6">
                    {sidebarArticles.map((related) => (
                      <Link
                        key={related.title}
                        href={`/articles/${slugify(related.title)}`}
                        className="group flex items-start gap-4"
                      >
                        <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 border border-slate-50 shadow-sm">
                          <Image
                            src={related.image}
                            alt={related.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="mb-1.5 text-xs font-extrabold leading-tight text-[#17391f] transition-colors group-hover:text-primary line-clamp-2">
                            {related.title}
                          </h4>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#5d7a64]">
                            {related.tanggal}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Trending Articles */}
                <div className="rounded-3xl bg-slate-50 p-8 border border-slate-100 shadow-sm">
                  <h3 className="mb-8 text-lg font-extrabold text-[#17391f]">
                    Paling Populer
                  </h3>
                  <div className="flex flex-col gap-6">
                    {ARTICLE_MOST_POPULAR.slice(0, 4).map((trending) => {
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
                          className="group flex items-start gap-4"
                        >
                          <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-100 text-xs font-extrabold text-primary shadow-sm">
                            {trending.rank}
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-xs font-extrabold leading-tight text-[#17391f] transition-colors group-hover:text-primary line-clamp-2">
                              {trending.title}
                            </h4>
                            <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5d7a64]">
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
