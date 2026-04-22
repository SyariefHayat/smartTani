import { NavItem, SocialLink, FooterSection } from "./types";
import {
  Home,
  Store,
  TrendingUp,
  Truck,
  Package,
  GraduationCap,
  Newspaper,
  Info,
  Mail,
} from "lucide-react";

export const HEADER_NAV: NavItem[] = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Marketplace", href: "/marketplace", icon: Store },
  { label: "Investasi", href: "/investasi", icon: TrendingUp },
  { label: "Distributor", href: "/distributor", icon: Package },
  { label: "Logistik", href: "/logistik", icon: Truck },
  { label: "SiTani Academy", href: "/sitani-academy", icon: GraduationCap },
  { label: "Artikel", href: "/artikel", icon: Newspaper },
  { label: "Tentang", href: "/tentang", icon: Info },
  { label: "Kontak", href: "/kontak", icon: Mail },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Navigasi",
    links: [
      { label: "Beranda", href: "/" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Investasi", href: "/investasi" },
      { label: "Distributor", href: "/distributor" },
      { label: "Logistik", href: "/logistik" },
      { label: "SiTani Academy", href: "/sitani-academy" },
      { label: "Artikel", href: "/artikel" },
      { label: "Tentang", href: "/tentang" },
      { label: "Kontak", href: "/kontak" },
    ],
  },
  {
    title: "Solusi",
    links: [
      { label: "Smart Farming", href: "/artikel" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Supply Chain", href: "/investasi" },
      { label: "Logistik", href: "/logistik" },
      { label: "Edukasi", href: "/sitani-academy" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Pusat Bantuan", href: "/kontak" },
      { label: "FAQ", href: "/faq" },
      { label: "Kebijakan Privasi", href: "/privasi" },
      { label: "Syarat & Ketentuan", href: "/syarat" },
    ],
  },
  {
    title: "Kontak Kami",
    links: [
      {
        label: "JI. Raya Karangbinangun KM 1 No. 42 Alang- Alang, Karangbinangun Lamongan 62293, Jawa Timur Indonesia",
        href: `https://maps.google.com/?q=${encodeURIComponent("Jakarta Selatan 12345")}`,
        icon: "map-pin",
        external: true,
      },
      {
        label: "0822-6952-8338",
        href: `tel:082269528338`,
        icon: "phone",
      },
      {
        label: "info@smarttaniindonesia.com",
        href: `mailto:info@smarttaniindonesia.com`,
        icon: "mail",
      },
      {
        label: "www.smarttaniindonesia.com",
        href: `https://www.smarttaniindonesia.com`,
        icon: "globe",
        external: true,
      },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: "Facebook", href: "https://facebook.com", icon: "facebook" },
  { label: "Instagram", href: "https://instagram.com", icon: "instagram" },
  { label: "YouTube", href: "https://youtube.com", icon: "youtube" },
  { label: "LinkedIn", href: "https://linkedin.com", icon: "linkedin" },
  { label: "TikTok", href: "https://tiktok.com", icon: "tiktok" },
];

export const FOOTER_CONTACT = {
  address: "Jl. Raya Karangbinangun KM 1 No. 42 Alang- Alang, Karangbinangun Lamongan 62293, Jawa Timur Indonesia",
  phone: "0822-6952-8338",
  email: "info@smarttaniindonesia.com",
  website: "www.smarttaniindonesia.com",
};

export const FOOTER_BRAND = {
  description:
    "PT. Smarttani Indonesia berkomitmen menjadi mitra terpercaya dalam transformasi pertanian Indonesia menuju masa depan yang lebih cerdas dan berkelanjutan.",
  copyright: "© 2024 PT. Smarttani Indonesia. All rights reserved.",
  tagline:
    "Mendukung Petani • Membangun Negeri • Masa Depan Pertanian Indonesia",
};
