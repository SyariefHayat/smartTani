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
  User,
  Activity,
  Handshake,
  ClipboardList,
  Sprout,
  ShoppingCart,
  Boxes,
  Wallet,
  BarChart3,
  Settings,
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

export const FARMER_DASHBOARD_NAV = [
  {
    title: "Dashboard",
    url: "/dashboard/farmer",
    icon: Home,
    isActive: true,
  },
  {
    title: "Marketplace",
    url: "#",
    icon: Store,
    items: [
      {
        title: "Daftar Produk",
        url: "/dashboard/farmer/products",
      },
      {
        title: "Tambah Produk",
        url: "/dashboard/farmer/products/new",
      },
      { title: "Kategori", url: "/dashboard/farmer/categories" },
      { title: "Promo & Diskon", url: "/dashboard/farmer/promos" },
      { title: "Ulasan Pembeli", url: "/dashboard/farmer/reviews" },
    ],
  },
  {
    title: "Penjualan",
    url: "#",
    icon: ShoppingCart,
    items: [
      {
        title: "Pesanan Masuk",
        url: "/dashboard/farmer/orders",
      },
      {
        title: "Riwayat Penjualan",
        url: "/dashboard/farmer/orders/history",
      },
    ],
  },
  {
    title: "Pembelian",
    url: "#",
    icon: ClipboardList,
    items: [
      {
        title: "Daftar Pembelian",
        url: "/dashboard/farmer/purchases",
      },
      {
        title: "Supplier",
        url: "/dashboard/farmer/purchases/supplier",
      },
    ],
  },
  {
    title: "Persediaan",
    url: "#",
    icon: Boxes,
    items: [
      {
        title: "Stok Produk",
        url: "/dashboard/farmer/inventory",
      },
      {
        title: "Gudang",
        url: "/dashboard/farmer/inventory/warehouse",
      },
    ],
  },
  {
    title: "Manajemen Pertanian",
    url: "#",
    icon: Sprout,
    items: [
      { title: "Lahan & Tanaman", url: "/dashboard/farmer/lands" },
      {
        title: "Manajemen Panen",
        url: "/dashboard/farmer/harvests",
      },
      {
        title: "Smart Farming",
        url: "/dashboard/farmer/smart-farming",
      },
    ],
  },
  {
    title: "Keuangan",
    url: "#",
    icon: Wallet,
    items: [
      {
        title: "Saldo & Penghasilan",
        url: "/dashboard/farmer/finance",
      },
      {
        title: "Riwayat Transaksi",
        url: "/dashboard/farmer/finance/history",
      },
    ],
  },
  {
    title: "Laporan & BI",
    url: "#",
    icon: BarChart3,
    items: [
      {
        title: "Laporan Penjualan",
        url: "/dashboard/farmer/reports/sales",
      },
      {
        title: "Laporan Pertanian",
        url: "/dashboard/farmer/reports/farming",
      },
    ],
  },
  {
    title: "Pengaturan",
    url: "/dashboard/farmer/settings",
    icon: Settings,
  },
];

export const INVESTOR_DASHBOARD_NAV = [
  {
    title: "Portfolio",
    url: "/dashboard/investor",
    icon: TrendingUp,
    isActive: true,
  },
  {
    title: "Investasi",
    url: "#",
    icon: Package,
    items: [
      { title: "Proyek Aktif", url: "/dashboard/investor/active-projects" },
      { title: "Riwayat Investasi", url: "/dashboard/investor/history" },
      { title: "Jelajahi Proyek", url: "/investments" },
    ],
  },
  {
    title: "Laporan",
    url: "/dashboard/investor/reports",
    icon: Newspaper,
  },
];

export const DISTRIBUTOR_DASHBOARD_NAV = [
  {
    title: "Ringkasan Bisnis",
    url: "/dashboard/distributor",
    icon: Home,
    isActive: true,
  },
  {
    title: "Inventaris",
    url: "#",
    icon: Package,
    items: [
      { title: "Stok Produk", url: "/dashboard/distributor/inventory" },
      { title: "Manajemen Harga", url: "/dashboard/distributor/pricing" },
      { title: "Produk Baru", url: "/dashboard/distributor/products/new" },
    ],
  },
  {
    title: "Penjualan",
    url: "#",
    icon: Store,
    items: [
      { title: "Pesanan Baru", url: "/dashboard/distributor/orders" },
      {
        title: "Riwayat Penjualan",
        url: "/dashboard/distributor/sales-history",
      },
      { title: "Pelanggan", url: "/dashboard/distributor/customers" },
    ],
  },
  {
    title: "Logistik",
    url: "/dashboard/distributor/logistics",
    icon: Truck,
  },
];

export const MITRA_BISNIS_DASHBOARD_NAV = [
  {
    title: "Dashboard Kemitraan",
    url: "/dashboard/mitra-bisnis",
    icon: Home,
    isActive: true,
  },
  {
    title: "Kerjasama",
    url: "#",
    icon: Handshake,
    items: [
      { title: "Proyek Bersama", url: "/dashboard/mitra-bisnis/projects" },
      { title: "Kontrak Aktif", url: "/dashboard/mitra-bisnis/contracts" },
      { title: "Pengajuan Baru", url: "/dashboard/mitra-bisnis/proposals" },
    ],
  },
  {
    title: "Rantai Pasok",
    url: "#",
    icon: Package,
    items: [
      { title: "Monitor Suplai", url: "/dashboard/mitra-bisnis/supply-chain" },
      {
        title: "Kualitas Produk",
        url: "/dashboard/mitra-bisnis/quality-control",
      },
    ],
  },
];

export const ADMIN_PERUSAHAAN_DASHBOARD_NAV = [
  {
    title: "Overview Operasional",
    url: "/dashboard/admin-perusahaan",
    icon: Home,
    isActive: true,
  },
  {
    title: "Manajemen Pengguna",
    url: "#",
    icon: User,
    items: [
      { title: "Daftar Petani", url: "/dashboard/admin-perusahaan/farmers" },
      {
        title: "Daftar Investor",
        url: "/dashboard/admin-perusahaan/investors",
      },
      {
        title: "Daftar Distributor",
        url: "/dashboard/admin-perusahaan/distributors",
      },
    ],
  },
  {
    title: "Monitoring",
    url: "#",
    icon: Activity,
    items: [
      { title: "Statistik Platform", url: "/dashboard/admin-perusahaan/stats" },
      { title: "Log Aktivitas", url: "/dashboard/admin-perusahaan/logs" },
    ],
  },
];

export const ACADEMY_DASHBOARD_NAV = [
  {
    title: "Dashboard Akademi",
    url: "/dashboard/academy",
    icon: Home,
    isActive: true,
  },
  {
    title: "Manajemen Kursus",
    url: "#",
    icon: GraduationCap,
    items: [
      { title: "Daftar Kursus", url: "/dashboard/academy/courses" },
      { title: "Kurikulum", url: "/dashboard/academy/curriculum" },
      { title: "Materi Baru", url: "/dashboard/academy/materials/new" },
    ],
  },
  {
    title: "Peserta & Instruktur",
    url: "#",
    icon: User,
    items: [
      { title: "Daftar Siswa", url: "/dashboard/academy/students" },
      { title: "Instruktur", url: "/dashboard/academy/instructors" },
      { title: "Sertifikasi", url: "/dashboard/academy/certifications" },
    ],
  },
  {
    title: "Event & Webinar",
    url: "#",
    icon: Activity,
    items: [
      { title: "Jadwal Webinar", url: "/dashboard/academy/webinars" },
      { title: "Workshop", url: "/dashboard/academy/workshops" },
    ],
  },
];

export const SECONDARY_NAV = [
  {
    title: "Profil",
    url: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Bantuan",
    url: "/contact",
    icon: Mail,
  },
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
      { label: "Kebijakan Privasi", href: "/privacy" },
      { label: "Syarat & Ketentuan", href: "/terms" },
    ],
  },
  {
    title: "Kontak Kami",
    links: [
      {
        label:
          "JI. Raya Karangbinangun KM 1 No. 42 Alang- Alang, Karangbinangun Lamongan 62293, Jawa Timur Indonesia",
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
  address:
    "Jl. Raya Karangbinangun KM 1 No. 42 Alang- Alang, Karangbinangun Lamongan 62293, Jawa Timur Indonesia",
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
