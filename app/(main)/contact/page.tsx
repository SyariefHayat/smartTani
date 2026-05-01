import { Metadata } from "next";
import { CONTACT_META } from "@/constants/contact";
import Hero from "@/components/sections/contact/Hero";
import FormInfo from "@/components/sections/contact/FormInfo";
import Location from "@/components/sections/contact/Location";

export const metadata: Metadata = {
  title: CONTACT_META.title,
  description: CONTACT_META.description,
};

export default function KontakPage() {
  return (
    <main className="min-h-screen bg-white">
      <Hero />
      <FormInfo />
      <Location />
    </main>
  );
}

