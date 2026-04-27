import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
}

export interface SocialLink {
  label: string;
  href: string;
  icon: string;
}

export interface FooterLink {
  label: string;
  href: string;
  icon?: "map-pin" | "phone" | "mail" | "globe";
  external?: boolean;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}

export interface StatItem {
  label: string;
  value: string;
  icon?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon?: string;
}

export interface Article {
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  readingTime: string;
  author: {
    name: string;
    role: string;
    image: string;
  };
}

export interface Milestone {
  year: string;
  description: string;
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface FormField {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  terjual: string;
  isPromo: boolean;
  storeType: "Official Store" | "Distributor Resmi" | "UMKM";
  storeName: string;
}

export interface AcademyInstructor {
  nama: string;
  gelar: string;
  image?: string;
  rating?: number;
  jumlahPeserta?: number;
  jumlahKursus?: number;
}

export interface AcademyCourse {
  id: string;
  badge: string | null;
  title: string;
  description: string;
  image: string;
  instruktur: AcademyInstructor;
  rating: number;
  ulasan: number;
  durasi: string;
  mode: "Online" | "Offline" | "Blended";
  cta: string;
}

export interface AcademyWebinar {
  title: string;
  tanggal: string;
  waktu: string;
  image: string;
  cta: string;
  kategori: string;
  narasumber: string;
}

export interface AcademyLearningPath {
  level: string;
  description: string;
  jumlahKursus: number;
  jumlahJam: number;
}

export interface AcademyTestimonial {
  nama: string;
  role: string;
  avatar: string;
  rating: number;
  quote: string;
}
