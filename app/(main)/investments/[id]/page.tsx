import { notFound } from "next/navigation";
import { INVESTMENT_PROJECTS } from "@/constants/investments";
import InvestmentDetailHero from "@/components/sections/investments/InvestmentDetailHero";
import InvestmentDetailTabs from "@/components/sections/investments/InvestmentDetailTabs";
import InvestmentForm from "@/components/sections/investments/InvestmentForm";
import RelatedInvestments from "@/components/sections/investments/RelatedInvestments";

interface InvestasiDetailPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return INVESTMENT_PROJECTS.items.map((p) => ({ id: p.id }));
}

export default async function InvestasiDetailPage({
  params,
}: InvestasiDetailPageProps) {
  const { id } = await params;
  
  // Find project by id
  const project = INVESTMENT_PROJECTS.items.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <InvestmentDetailHero project={project} />

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <InvestmentDetailTabs />
          </div>

          {/* Sidebar Form */}
          <div className="relative">
            <InvestmentForm 
              projectTitle={project.title} 
              minInvestasi={project.minimalInvestasi} 
            />
          </div>
        </div>

        {/* Related Projects */}
        <RelatedInvestments />
      </div>
    </main>
  );
}
