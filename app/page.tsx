import type { Metadata } from "next";
import { HOME_META } from "@/constants";
import HeroSection from "@/components/sections/beranda/HeroSection";
import StatsBarSection from "@/components/sections/beranda/StatsBarSection";
import StepsSection from "@/components/sections/beranda/StepsSection";
import CTABannerSection from "@/components/sections/beranda/CTABannerSection";
import FeatureSection from "@/components/sections/beranda/FeatureSection";
import TestimoniSection from "@/components/sections/beranda/TestimoniSection";

export const metadata: Metadata = {
  title: {
    absolute: HOME_META.title,
  },
  description: HOME_META.description,
  keywords: HOME_META.keywords,
  openGraph: {
    title: HOME_META.title,
    description: HOME_META.description,
    url: "https://smarttani.id",
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
      <HeroSection />
      <StatsBarSection />
      <FeatureSection />
      <StepsSection />
      <TestimoniSection />
      <CTABannerSection />
    </main>
  );
}
