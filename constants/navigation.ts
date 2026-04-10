import { NavItem, SocialLink, FooterSection } from "./types";

export const HEADER_NAV: NavItem[] = [
  { label: "Beranda", href: "/" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Investasi", href: "/investasi" },
  { label: "Distributor", href: "/distributor" },
  { label: "Logistik", href: "/logistik" },
  { label: "SiTani Academy", href: "/sitani-academy" },
  { label: "Artikel", href: "/artikel" },
  { label: "Tentang", href: "/tentang" },
  { label: "Kontak", href: "/kontak" },
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
      { label: "Smart Farming", href: "/solusi/smart-farming" },
      { label: "Marketplace", href: "/marketplace" },
      { label: "Supply Chain", href: "/solusi/supply-chain" },
      { label: "Logistik", href: "/logistik" },
      { label: "Edukasi", href: "/sitani-academy" },
    ],
  },
  {
    title: "Bantuan",
    links: [
      { label: "Pusat Bantuan", href: "/bantuan" },
      { label: "FAQ", href: "/faq" },
      { label: "Kebijakan Privasi", href: "/privasi" },
      { label: "Syarat & Ketentuan", href: "/syarat" },
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
