import { Metadata } from "next";
import { CONTACT_META } from "@/constants/contact";
import ContactHeroSection from "@/components/sections/contact/ContactHeroSection";
import ContactMiddleSection from "@/components/sections/contact/ContactMiddleSection";
import ContactLocationSection from "@/components/sections/contact/ContactLocationSection";

export const metadata: Metadata = {
  title: CONTACT_META.title,
  description: CONTACT_META.description,
};

export default function KontakPage() {
  return (
    <main className="min-h-screen bg-white">
      <ContactHeroSection />
      <ContactMiddleSection />
      <ContactLocationSection />
    </main>
  );
}

