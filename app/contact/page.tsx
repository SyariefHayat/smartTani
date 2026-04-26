import { Metadata } from "next";
import { CONTACT_META } from "@/constants/contact";
import KontakHeroSection from "@/components/sections/contact/KontakHeroSection";
import KontakMiddleSection from "@/components/sections/contact/KontakMiddleSection";
import KontakLokasiSection from "@/components/sections/contact/KontakLokasiSection";

export const metadata: Metadata = {
  title: CONTACT_META.title,
  description: CONTACT_META.description,
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

