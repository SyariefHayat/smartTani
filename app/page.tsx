import type { Metadata } from "next";
import { HOME_META } from "@/constants";
import HeroSection from "@/components/sections/beranda/HeroSection";
import StatsBarSection from "@/components/sections/beranda/StatsBarSection";
import FiturSection from "@/components/sections/beranda/FiturSection";
import StepsSection from "@/components/sections/beranda/StepsSection";
import KategoriTestimoniArtikelSection from "@/components/sections/beranda/KategoriTestimoniArtikelSection";
import CTABannerSection from "@/components/sections/beranda/CTABannerSection";

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
        url: "/images/home/hero.webp",
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
    <>
      <HeroSection />
      <StatsBarSection />
      <FiturSection />
      <StepsSection />
      <KategoriTestimoniArtikelSection />
      <CTABannerSection />
    </>
  );
}
