import type { Metadata } from "next";
import { INVESTASI_META } from "@/constants/investasi";

export const metadata: Metadata = {
  title: {
    absolute: INVESTASI_META.title,
  },
  description: INVESTASI_META.description,
};

export default function InvestasiPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Content will be added per section issue */}
      <section className="py-20 text-center">
        <h1 className="text-3xl font-bold text-[#17391f]">Halaman Investasi</h1>
        <p className="text-gray-500">Halaman ini sedang dalam pengembangan...</p>
      </section>
    </main>
  );
}
