import { notFound } from "next/navigation";
import { ARTICLE_DUMMY } from "@/constants/article";
import ArtikelHeader from "@/components/sections/artikel/ArtikelHeader";
import ArtikelContent from "@/components/sections/artikel/ArtikelContent";
import RelatedArticles from "@/components/sections/artikel/RelatedArticles";

interface ArtikelDetailPageProps {
  params: {
    id: string;
  };
}

export default async function ArtikelDetailPage({
  params,
}: ArtikelDetailPageProps) {
  const { id } = await params;
  
  // Find article by index (id-1)
  const index = parseInt(id) - 1;
  const article = ARTICLE_DUMMY[index];

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 pb-20">
        <ArtikelHeader article={article} />
        <ArtikelContent article={article} />
        <RelatedArticles />
      </div>
    </main>
  );
}
