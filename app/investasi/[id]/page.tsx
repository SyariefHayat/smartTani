import { notFound } from "next/navigation";
import { INVESTASI_PROYEK } from "@/constants/investasi";
import InvestasiDetailHero from "@/components/sections/investasi/InvestasiDetailHero";
import InvestasiDetailTabs from "@/components/sections/investasi/InvestasiDetailTabs";
import InvestasiForm from "@/components/sections/investasi/InvestasiForm";
import RelatedInvestasi from "@/components/sections/investasi/RelatedInvestasi";

interface InvestasiDetailPageProps {
  params: {
    id: string;
  };
}

export default async function InvestasiDetailPage({
  params,
}: InvestasiDetailPageProps) {
  const { id } = await params;
  
  // Find project by index (id-1)
  const index = parseInt(id) - 1;
  const project = INVESTASI_PROYEK.items[index];

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <InvestasiDetailHero project={project} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <InvestasiDetailTabs />
          </div>

          {/* Sidebar Form */}
          <div className="relative">
            <InvestasiForm 
              projectTitle={project.title} 
              minInvestasi={project.minimalInvestasi} 
            />
          </div>
        </div>

        {/* Related Projects */}
        <RelatedInvestasi />
      </div>
    </main>
  );
}
