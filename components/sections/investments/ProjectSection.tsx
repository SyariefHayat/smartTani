import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INVESTMENT_PROJECTS } from "@/constants/investments";
import InvestmentCard from "./InvestmentCard";

export default function ProjectSection() {
  return (
    <section className="section-padding" id="proyek-investasi">
      <div className="container-smarttani">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end mb-10 md:mb-12">
          <div className="space-y-2">
            <h2 className="section-title text-foreground">
              {INVESTMENT_PROJECTS.heading}
            </h2>
            <p className="text-body-sm text-muted-foreground md:text-body">
              {INVESTMENT_PROJECTS.subtext}
            </p>
          </div>
          <Link
            href="/investments"
            className="group flex items-center gap-2 text-body-sm font-bold text-primary hover:text-primary-dark transition-colors md:text-body"
          >
            Lihat Semua Proyek
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INVESTMENT_PROJECTS.items.map((item, index) => (
            <InvestmentCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}

