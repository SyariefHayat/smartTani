import { NavItem, SocialLink, FooterSection } from './types';
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
  Heart,
  MapPin,
  Star,
  Bell,
  Award,
} from 'lucide-react';

export const HEADER_NAV: NavItem[] = [
  { label: 'Beranda', href: '/', icon: Home },
  { label: 'Marketplace', href: '/marketplace', icon: Store },
  { label: 'Investasi', href: '/investments', icon: TrendingUp },
  { label: 'Distributor', href: '/distributors', icon: Package },
  { label: 'Logistik', href: '/logistics', icon: Truck },
  { label: 'SiTani Academy', href: '/academy', icon: GraduationCap },
  { label: 'Artikel', href: '/articles', icon: Newspaper },
  { label: 'Tentang', href: '/about', icon: Info },
  { label: 'Kontak', href: '/contact', icon: Mail },
];

export const FARMER_DASHBOARD_NAV = [
  {
    title: 'Dashboard',
    url: '/dashboard/farmer',
    icon: Home,
    isActive: true,
  },
  {
    title: 'Marketplace',
    url: '#',
    icon: Store,
    items: [
      {
        title: 'Daftar Produk',
        url: '/dashboard/farmer/products',
      },
      {
        title: 'Tambah Produk',
        url: '/dashboard/farmer/products/new',
      },
      { title: 'Kategori', url: '/dashboard/farmer/categories' },
      { title: 'Promo & Diskon', url: '/dashboard/farmer/promos' },
      { title: 'Ulasan Pembeli', url: '/dashboard/farmer/reviews' },
    ],
  },
  {
    title: 'Penjualan',
    url: '#',
    icon: ShoppingCart,
    items: [
      {
        title: 'Pesanan Masuk',
        url: '/dashboard/farmer/orders',
      },
      {
        title: 'Riwayat Penjualan',
        url: '/dashboard/farmer/orders/history',
      },
    ],
  },
  {
    title: 'Pembelian',
    url: '#',
    icon: ClipboardList,
    items: [
      {
        title: 'Daftar Pembelian',
        url: '/dashboard/farmer/purchases',
      },
      {
        title: 'Supplier',
        url: '/dashboard/farmer/purchases/supplier',
      },
    ],
  },
  {
    title: 'Persediaan',
    url: '#',
    icon: Boxes,
    items: [
      {
        title: 'Stok Produk',
        url: '/dashboard/farmer/inventory',
      },
      {
        title: 'Gudang',
        url: '/dashboard/farmer/inventory/warehouse',
      },
    ],
  },
  {
    title: 'Manajemen Pertanian',
    url: '#',
    icon: Sprout,
    items: [
      { title: 'Lahan & Tanaman', url: '/dashboard/farmer/lands' },
      {
        title: 'Manajemen Panen',
        url: '/dashboard/farmer/harvests',
      },
      {
        title: 'Smart Farming',
        url: '/dashboard/farmer/smart-farming',
      },
    ],
  },
  {
    title: 'Keuangan',
    url: '#',
    icon: Wallet,
    items: [
      {
        title: 'Saldo & Penghasilan',
        url: '/dashboard/farmer/finance',
      },
      {
        title: 'Riwayat Transaksi',
        url: '/dashboard/farmer/finance/history',
      },
    ],
  },
  {
    title: 'Laporan & BI',
    url: '#',
    icon: BarChart3,
    items: [
      {
        title: 'Laporan Penjualan',
        url: '/dashboard/farmer/reports/sales',
      },
      {
        title: 'Laporan Pertanian',
        url: '/dashboard/farmer/reports/farming',
      },
    ],
  },
  {
    title: 'Pengaturan',
    url: '/dashboard/farmer/settings',
    icon: Settings,
  },
];

export const BUYER_DASHBOARD_NAV = [
  {
    title: 'Overview',
    url: '/dashboard/buyer',
    icon: Home,
    isActive: true,
  },
  {
    title: 'Pesanan Saya',
    url: '#',
    icon: ShoppingCart,
    items: [
      {
        title: 'Pesanan Aktif',
        url: '/dashboard/buyer/orders',
      },
      {
        title: 'Riwayat Pesanan',
        url: '/dashboard/buyer/orders/history',
      },
    ],
  },
  {
    title: 'Pengeluaran',
    url: '#',
    icon: Wallet,
    items: [
      {
        title: 'Ringkasan Pengeluaran',
        url: '/dashboard/buyer/finance',
      },
      {
        title: 'Riwayat Transaksi',
        url: '/dashboard/buyer/finance/history',
      },
    ],
  },
  {
    title: 'Wishlist',
    url: '/dashboard/buyer/wishlist',
    icon: Heart,
  },
  {
    title: 'Alamat Tersimpan',
    url: '/dashboard/buyer/addresses',
    icon: MapPin,
  },
  {
    title: 'Ulasan Saya',
    url: '/dashboard/buyer/reviews',
    icon: Star,
  },
  {
    title: 'Notifikasi',
    url: '/dashboard/buyer/notifications',
    icon: Bell,
  },
  {
    title: 'Pengaturan',
    url: '/dashboard/buyer/settings',
    icon: Settings,
  },
];

export const INVESTOR_DASHBOARD_NAV = [
  {
    title: 'Overview',
    url: '/dashboard/investor',
    icon: Home,
    isActive: true,
  },
  {
    title: 'Portofolio Saya',
    url: '/dashboard/investor/portfolio',
    icon: TrendingUp,
  },
  {
    title: 'Cari Proposal',
    url: '/dashboard/investor/proposals',
    icon: Sprout,
  },
  {
    title: 'Analytics',
    url: '/dashboard/investor/analytics',
    icon: BarChart3,
  },
  {
    title: 'Laporan',
    url: '/dashboard/investor/reports',
    icon: Newspaper,
  },
  {
    title: 'Riwayat Transaksi',
    url: '/dashboard/investor/transactions',
    icon: Wallet,
  },
  {
    title: 'Notifikasi',
    url: '/dashboard/investor/notifications',
    icon: Bell,
  },
  {
    title: 'Pengaturan',
    url: '/dashboard/investor/settings',
    icon: Settings,
  },
];

export const LOGISTICS_DASHBOARD_NAV = [
  {
    title: 'Overview',
    url: '/dashboard/logistik',
    icon: Home,
    isActive: true,
  },
  {
    title: 'Semua Pengiriman',
    url: '/dashboard/logistik/shipments',
    icon: Truck,
  },
  {
    title: 'Menunggu Pickup',
    url: '/dashboard/logistik/shipments/pending',
    icon: ClipboardList,
  },
  {
    title: 'Dalam Perjalanan',
    url: '/dashboard/logistik/shipments/active',
    icon: Package,
  },
  {
    title: 'Riwayat Pengiriman',
    url: '/dashboard/logistik/history',
    icon: Newspaper,
  },
  {
    title: 'Performa Kurir',
    url: '/dashboard/logistik/performance',
    icon: BarChart3,
  },
  {
    title: 'Notifikasi',
    url: '/dashboard/logistik/notifications',
    icon: Bell,
  },
  {
    title: 'Pengaturan',
    url: '/dashboard/logistik/settings',
    icon: Settings,
  },
];

export const DISTRIBUTOR_DASHBOARD_NAV = [
  {
    title: 'Overview',
    url: '/dashboard/distributor',
    icon: Home,
    isActive: true,
  },
  {
    title: 'Pesanan Saya',
    url: '/dashboard/distributor/orders',
    icon: ShoppingCart,
    items: [
      { title: 'Daftar Pesanan', url: '/dashboard/distributor/orders' },
      { title: 'Riwayat Pesanan', url: '/dashboard/distributor/orders/history' },
    ],
  },
  {
    title: 'Katalog B2B',
    url: '/dashboard/distributor/catalog',
    icon: Store,
  },
  {
    title: 'Mitra Petani',
    url: '/dashboard/distributor/suppliers',
    icon: Handshake,
  },
  {
    title: 'Stok Distribusi',
    url: '/dashboard/distributor/inventory',
    icon: Boxes,
  },
  {
    title: 'Keuangan',
    url: '/dashboard/distributor/finance',
    icon: Wallet,
    items: [
      { title: 'Ringkasan Modal', url: '/dashboard/distributor/finance' },
      { title: 'Daftar Invoice', url: '/dashboard/distributor/finance/invoices' },
    ],
  },
  {
    title: 'Analisis Bisnis',
    url: '/dashboard/distributor/analytics',
    icon: BarChart3,
  },
  {
    title: 'Notifikasi',
    url: '/dashboard/distributor/notifications',
    icon: Bell,
  },
  {
    title: 'Pengaturan Bisnis',
    url: '/dashboard/distributor/settings',
    icon: Settings,
  },
];

export const MITRA_BISNIS_DASHBOARD_NAV = [
  {
    title: 'Dashboard Kemitraan',
    url: '/dashboard/mitra-bisnis',
    icon: Home,
    isActive: true,
  },
  {
    title: 'Kerjasama',
    url: '#',
    icon: Handshake,
    items: [
      { title: 'Proyek Bersama', url: '/dashboard/mitra-bisnis/projects' },
      { title: 'Kontrak Aktif', url: '/dashboard/mitra-bisnis/contracts' },
      { title: 'Pengajuan Baru', url: '/dashboard/mitra-bisnis/proposals' },
    ],
  },
  {
    title: 'Rantai Pasok',
    url: '#',
    icon: Package,
    items: [
      { title: 'Monitor Suplai', url: '/dashboard/mitra-bisnis/supply-chain' },
      {
        title: 'Kualitas Produk',
        url: '/dashboard/mitra-bisnis/quality-control',
      },
    ],
  },
];

export const ADMIN_PERUSAHAAN_DASHBOARD_NAV = [
  {
    title: 'Overview Operasional',
    url: '/dashboard/admin-perusahaan',
    icon: Home,
    isActive: true,
  },
  {
    title: 'Manajemen Pengguna',
    url: '#',
    icon: User,
    items: [
      { title: 'Daftar Petani', url: '/dashboard/admin-perusahaan/farmers' },
      {
        title: 'Daftar Investor',
        url: '/dashboard/admin-perusahaan/investors',
      },
      {
        title: 'Daftar Distributor',
        url: '/dashboard/admin-perusahaan/distributors',
      },
    ],
  },
  {
    title: 'Monitoring',
    url: '#',
    icon: Activity,
    items: [
      { title: 'Statistik Platform', url: '/dashboard/admin-perusahaan/stats' },
      { title: 'Log Aktivitas', url: '/dashboard/admin-perusahaan/logs' },
    ],
  },
];

export const ACADEMY_DASHBOARD_NAV = [
  {
    title: 'Dashboard Akademi',
    url: '/dashboard/academy',
    icon: Home,
    isActive: true,
  },
  {
    title: 'Manajemen Kursus',
    url: '#',
    icon: GraduationCap,
    items: [
      { title: 'Daftar Kursus', url: '/dashboard/academy/courses' },
      { title: 'Kurikulum', url: '/dashboard/academy/curriculum' },
      { title: 'Materi Baru', url: '/dashboard/academy/materials/new' },
    ],
  },
  {
    title: 'Peserta & Instruktur',
    url: '#',
    icon: User,
    items: [
      { title: 'Daftar Siswa', url: '/dashboard/academy/students' },
      { title: 'Instruktur', url: '/dashboard/academy/instructors' },
      { title: 'Sertifikasi', url: '/dashboard/academy/certifications' },
    ],
  },
  {
    title: 'Event & Webinar',
    url: '#',
    icon: Activity,
    items: [
      { title: 'Jadwal Webinar', url: '/dashboard/academy/webinars' },
      { title: 'Workshop', url: '/dashboard/academy/workshops' },
    ],
  },
];

export const SISWA_DASHBOARD_NAV = [
  {
    title: 'Overview Belajar',
    url: '/dashboard/siswa',
    icon: Home,
    isActive: true,
  },
  {
    title: 'Katalog Kursus',
    url: '/dashboard/siswa/courses',
    icon: GraduationCap,
  },
  {
    title: 'Kursus Saya',
    url: '/dashboard/siswa/my-courses',
    icon: ClipboardList,
  },
  {
    title: 'Sertifikat Saya',
    url: '/dashboard/siswa/certificates',
    icon: Award,
  },
  {
    title: 'Webinar & Event',
    url: '/dashboard/siswa/webinars',
    icon: Activity,
  },
  {
    title: 'Jalur Belajar',
    url: '/dashboard/siswa/learning-paths',
    icon: TrendingUp,
  },
  {
    title: 'Notifikasi',
    url: '/dashboard/siswa/notifications',
    icon: Bell,
  },
  {
    title: 'Pengaturan',
    url: '/dashboard/siswa/settings',
    icon: Settings,
  },
];

export const INSTRUKTUR_DASHBOARD_NAV = [
  {
    title: 'Overview',
    url: '/dashboard/instruktur',
    icon: Home,
    isActive: true,
  },
  {
    title: 'Kursus Saya',
    url: '/dashboard/instruktur/courses',
    icon: GraduationCap,
  },
  {
    title: 'Semua Peserta',
    url: '/dashboard/instruktur/students',
    icon: ClipboardList,
  },
  {
    title: 'Analisis',
    url: '/dashboard/instruktur/analytics',
    icon: BarChart3,
  },
  {
    title: 'Pendapatan',
    url: '/dashboard/instruktur/earnings',
    icon: Wallet,
  },
  {
    title: 'Notifikasi',
    url: '/dashboard/instruktur/notifications',
    icon: Bell,
  },
  {
    title: 'Pengaturan',
    url: '/dashboard/instruktur/settings',
    icon: Settings,
  },
];

export const ADMIN_DASHBOARD_NAV = [
  {
    title: 'Overview',
    url: '/admin',
    icon: Home,
    isActive: true,
  },
  {
    title: 'Kelola User',
    url: '/admin/users',
    icon: User,
  },
  {
    title: 'Kelola Produk',
    url: '/admin/products',
    icon: Store,
  },
  {
    title: 'Kelola Order',
    url: '/admin/orders',
    icon: ShoppingCart,
  },
  {
    title: 'Kelola Proposal',
    url: '/admin/proposals',
    icon: ClipboardList,
  },
  {
    title: 'Kelola Pengiriman',
    url: '/admin/shipments',
    icon: Truck,
  },
  {
    title: 'Kelola Investasi',
    url: '/admin/investments',
    icon: TrendingUp,
  },
  {
    title: 'Kelola Kursus',
    url: '/admin/courses',
    icon: GraduationCap,
  },
  {
    title: 'Moderasi Review',
    url: '/admin/reviews',
    icon: Star,
  },
  {
    title: 'Keuangan',
    url: '#',
    icon: Wallet,
    items: [
      { title: 'Overview Keuangan', url: '/admin/finance' },
      { title: 'Riwayat Transaksi', url: '/admin/finance/transactions' },
    ],
  },
  {
    title: 'Analytics Platform',
    url: '/admin/analytics',
    icon: BarChart3,
  },
  {
    title: 'Audit Log',
    url: '/admin/audit-log',
    icon: Newspaper,
  },
  {
    title: 'Notifikasi',
    url: '/admin/notifications',
    icon: Bell,
  },
  {
    title: 'Pengaturan',
    url: '/admin/settings',
    icon: Settings,
  },
];

export const SECONDARY_NAV = [
  {
    title: 'Profil',
    url: '/dashboard/profile',
    icon: User,
  },
  {
    title: 'Bantuan',
    url: '/contact',
    icon: Mail,
  },
];

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Navigasi',
    links: [
      { label: 'Beranda', href: '/' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Investasi', href: '/investments' },
      { label: 'Distributor', href: '/distributors' },
      { label: 'Logistik', href: '/logistics' },
      { label: 'SiTani Academy', href: '/academy' },
      { label: 'Artikel', href: '/articles' },
      { label: 'Tentang', href: '/about' },
      { label: 'Kontak', href: '/contact' },
    ],
  },
  {
    title: 'Solusi',
    links: [
      { label: 'Smart Farming', href: '/articles' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Supply Chain', href: '/investments' },
      { label: 'Logistik', href: '/logistics' },
      { label: 'Edukasi', href: '/academy' },
    ],
  },
  {
    title: 'Bantuan',
    links: [
      { label: 'Pusat Bantuan', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Kebijakan Privasi', href: '/privacy' },
      { label: 'Syarat & Ketentuan', href: '/terms' },
    ],
  },
  {
    title: 'Kontak Kami',
    links: [
      {
        label:
          'JI. Raya Karangbinangun KM 1 No. 42 Alang- Alang, Karangbinangun Lamongan 62293, Jawa Timur Indonesia',
        href: `https://maps.google.com/?q=${encodeURIComponent('Jakarta Selatan 12345')}`,
        icon: 'map-pin',
        external: true,
      },
      {
        label: '0823-2695-2833',
        href: `tel:082326952833`,
        icon: 'phone',
      },
      {
        label: 'info@smarttaniindonesia.com',
        href: `mailto:info@smarttaniindonesia.com`,
        icon: 'mail',
      },
      {
        label: 'www.smarttaniindonesia.com',
        href: `https://www.smarttaniindonesia.com`,
        icon: 'globe',
        external: true,
      },
    ],
  },
];

export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'Facebook', href: 'https://facebook.com', icon: 'facebook' },
  { label: 'Instagram', href: 'https://instagram.com', icon: 'instagram' },
  { label: 'YouTube', href: 'https://youtube.com', icon: 'youtube' },
  { label: 'LinkedIn', href: 'https://linkedin.com', icon: 'linkedin' },
  { label: 'TikTok', href: 'https://tiktok.com', icon: 'tiktok' },
];

export const FOOTER_CONTACT = {
  address:
    'Jl. Raya Karangbinangun KM 1 No. 42 Alang- Alang, Karangbinangun Lamongan 62293, Jawa Timur Indonesia',
  phone: '0823-2695-2833',
  email: 'info@smarttaniindonesia.com',
  website: 'www.smarttaniindonesia.com',
};

export const FOOTER_BRAND = {
  description:
    'PT. Smarttani Indonesia berkomitmen menjadi mitra terpercaya dalam transformasi pertanian Indonesia menuju masa depan yang lebih cerdas dan berkelanjutan.',
  copyright: '© 2024 PT. Smarttani Indonesia. All rights reserved.',
  tagline: 'Mendukung Petani • Membangun Negeri • Masa Depan Pertanian Indonesia',
};
