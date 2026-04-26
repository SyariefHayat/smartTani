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
  { label: "Investasi", href: "/investments", icon: TrendingUp },
  { label: "Distributor", href: "/distributors", icon: Package },
  { label: "Logistik", href: "/logistics", icon: Truck },
  { label: "SiTani Academy", href: "/academy", icon: GraduationCap },
  { label: "Artikel", href: "/articles", icon: Newspaper },
  { label: "Tentang", href: "/about", icon: Info },
  { label: "Kontak", href: "/contact", icon: Mail },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: "Navigasi",
    links: [
      { label: "Beranda", href: "/" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Investasi", href: "/investments" },
      { label: "Distributor", href: "/distributors" },
      { label: "Logistik", href: "/logistics" },
      { label: "SiTani Academy", href: "/academy" },
      { label: "Artikel", href: "/articles" },
      { label: "Tentang", href: "/about" },
      { label: "Kontak", href: "/contact" },
    ],
  },
  {
    title: "Solusi",
    links: [
      { label: "Smart Farming", href: "/articles" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Supply Chain", href: "/investments" },
      { label: "Logistik", href: "/logistics" },
      { label: "Edukasi", href: "/academy" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Pusat Bantuan", href: "/contact" },
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
        label: "0823-2695-2833",
        href: `tel:082326952833`,
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
  phone: "0823-2695-2833",
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
