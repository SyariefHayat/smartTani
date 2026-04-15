import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INVESTASI_PROYEK } from "@/constants/investasi";
import InvestasiCard from "./InvestasiCard";

export default function ProjectSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-10 lg:px-12">
        {/* Header */}
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end mb-10 md:mb-12">
          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-[#17391f] md:text-3xl lg:text-4xl">
              {INVESTASI_PROYEK.heading}
            </h2>
            <p className="text-sm font-medium text-gray-500 md:text-base">
              {INVESTASI_PROYEK.subtext}
            </p>
          </div>
          <Link
            href="/investasi/proyek"
            className="group flex items-center gap-2 text-sm font-bold text-[#2D6A2D] hover:text-[#235323] transition-colors md:text-base"
          >
            Lihat Semua Proyek
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {INVESTASI_PROYEK.items.map((item, index) => (
            <InvestasiCard key={index} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
