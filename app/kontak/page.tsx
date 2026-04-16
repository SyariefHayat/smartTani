import { Metadata } from "next";
import { KONTAK_META } from "@/constants/kontak";
import KontakHeroSection from "@/components/sections/kontak/KontakHeroSection";
import KontakMiddleSection from "@/components/sections/kontak/KontakMiddleSection";
import KontakLokasiSection from "@/components/sections/kontak/KontakLokasiSection";

export const metadata: Metadata = {
  title: KONTAK_META.title,
  description: KONTAK_META.description,
};

export default function KontakPage() {
  return (
    <main className="min-h-screen bg-white">
      <KontakHeroSection />
      <KontakMiddleSection />
      <KontakLokasiSection />
    </main>
  );
}
