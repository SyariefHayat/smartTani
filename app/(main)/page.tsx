import type { Metadata } from "next";
import { HOME_META } from "@/constants";
import Hero from "@/components/sections/home/Hero";
import StatsBar from "@/components/sections/home/StatsBar";
import Steps from "@/components/sections/home/Steps";
import CTA from "@/components/sections/home/CTA";
import Features from "@/components/sections/home/Features";
import Testimonials from "@/components/sections/home/Testimonials";

export const metadata: Metadata = {
  title: {
    absolute: HOME_META.title,
  },
  description: HOME_META.description,
  keywords: HOME_META.keywords,
  openGraph: {
    title: HOME_META.title,
    description: HOME_META.description,
    url: "https://smarttaniindonesia.com",
    siteName: "Smarttani Indonesia",
    images: [
      {
        url: "/images/home/desktop.png",
        width: 1200,
        height: 630,
        alt: "Smarttani Indonesia — Solusi Pertanian Modern",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_META.title,
    description: HOME_META.description,
    images: ["/images/home/hero.webp"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function BerandaPage() {
  return (
    <main>
      <Hero />
      <StatsBar />
      <Features />
      <Steps />
      <Testimonials />
      <CTA />
    </main>
  );
}
