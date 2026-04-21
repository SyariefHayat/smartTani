import {
  ChartNoAxesCombined,
  CloudSun,
  Droplets,
  GraduationCap,
  ShieldCheck,
  ShoppingBasket,
  ShoppingCart,
  Sprout,
  TrendingUp,
  Truck,
  UserPlus,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

export const HOME_META = {
  title: "Smarttani Indonesia — Platform Terintegrasi Ekosistem Pertanian",
  description:
    "PT. Smarttani Indonesia menghadirkan teknologi dan ekosistem terintegrasi untuk membantu petani, pelaku usaha, dan mitra mencapai hasil terbaik. Platform yang lebih cerdas, produktif, dan berkelanjutan.",
  keywords: [
    "Smarttani",
    "Pertanian Modern",
    "Investasi Pertanian",
    "Marketplace Hasil Tani",
    "Logistik Pertanian",
    "SiTani Academy",
    "Smart Farming Indonesia",
  ],
  ogImage: "/images/home/hero.png",
};

export const HOME_HERO = {
  heading: "Wujudkan Pertanian yang Lebih Cerdas, Produktif, dan Berkelanjutan",
  subtext:
    "PT. Smarttani Indonesia menghadirkan teknologi dan ekosistem terintegrasi untuk membantu petani, pelaku usaha, dan mitra mencapai hasil terbaik.",
  trustBar: "Aman, Transparan, Terpercaya • Mendukung Petani, Membangun Negeri",
  bgImageDesktop: "/images/home/desktop.png",
  bgImageTablet: "/images/home/tablet.png",
  bgImageMobile: "/images/home/mobile.png",
  cta: [
    { label: "Daftar sebagai Petani" },
    { label: "Gabung sebagai Investor" },
    { label: "Belanja Hasil Tani" },
    { label: "Ikuti Pelatihan" },
  ],
};

export const HERO_ACTION = [
  {
    prefix: "Daftar sebagai",
    role: "Petani",
    icon: Sprout,
    className: "bg-[#1A6B2F] text-[#EAF3DE] hover:bg-[#14521F]",
  },
  {
    prefix: "Gabung sebagai",
    role: "Investor",
    icon: ChartNoAxesCombined,
    className: "bg-[#BA7517] text-[#FAEEDA] hover:bg-[#854F0B]",
  },
  {
    prefix: "Belanja",
    role: "Hasil Tani",
    icon: ShoppingCart,
    className: "bg-[#185FA5] text-[#E6F1FB] hover:bg-[#0C447C]",
  },
  {
    prefix: "Ikuti",
    role: "Pelatihan",
    icon: GraduationCap,
    className: "bg-[#5F5E5A] text-[#F1EFE8] hover:bg-[#444441]",
  },
];

export const STAT_ICONS = [UsersRound, TrendingUp, Droplets, CloudSun];

export const HOME_HERO_STATS = [
  {
    value: "50.000 Petani",
    label: "Lebih dari",
    sublabel: "tergabung",
    sublabelColor: "#3B6D11",
    iconBg: "#EAF3DE",
    iconColor: "#3B6D11",
  },
  {
    value: "2,4 Ton/Ha",
    label: "Prediksi Panen",
    sublabel: "+12% dari musim lalu",
    sublabelColor: "#BA7517",
    iconBg: "#FAEEDA",
    iconColor: "#854F0B",
  },
  {
    value: "65%",
    label: "Kelembaban Tanah",
    sublabel: "Optimal",
    sublabelColor: "#185FA5",
    iconBg: "#E6F1FB",
    iconColor: "#185FA5",
  },
  {
    value: "28°C",
    label: "Cuaca Hari Ini",
    sublabel: "Cerah",
    sublabelColor: "#BA7517",
    iconBg: "#FAEEDA",
    iconColor: "#854F0B",
  },
];

export const HOME_STATS_BAR = [
  { value: "125K+", label: "Petani Aktif" },
  { value: "1,25 Jt+", label: "Total Transaksi" },
  { value: "320M+", label: "Proyek Terdanai" },
  { value: "8.750+", label: "Investor Terdaftar" },
  { value: "45K+", label: "Peserta Pelatihan" },
  { value: "1,2 Jt Ton+", label: "Tonase Distribusi" },
];

export const STAT_BAR_ICONS = [
  UsersRound,
  ShoppingCart,
  ChartNoAxesCombined,
  UserRoundCheck,
  GraduationCap,
  Truck,
];

export const HOME_FEATURES = [
  {
    title: "Marketplace Hasil Tani",
    description:
      "Jual dan beli hasil pertanian langsung dari petani dengan harga terbaik.",
    cta: "Lihat Produk →",
  },
  {
    title: "Investasi Pertanian",
    description:
      "Danai proyek pertanian potensial dan dapatkan keuntungan menjanjikan.",
    cta: "Mulai Investasi →",
  },
  {
    title: "Distributor & Supply Chain",
    description:
      "Kelola stok, gudang, dan distribusi secara efisien dan transparan.",
    cta: "Jelajahi →",
  },
  {
    title: "Logistik Terintegrasi",
    description:
      "Layanan pengiriman cepat dan aman hingga ke seluruh Indonesia.",
    cta: "Cek Tarif →",
  },
  {
    title: "SiTani Academy",
    description:
      "Tingkatkan pengetahuan dan keterampilan dengan pelatihan bersertifikat.",
    cta: "Mulai Belajar →",
  },
];

export const FEATURES_IMAGES = [
  "/images/home/keranjang-belanja.webp",
  "/images/home/grafik-investasi.webp",
  "/images/home/gudang-truk.webp",
  "/images/home/truk-logistik.webp",
  "/images/home/buku-akademi.webp",
];

export const FEATURES_BG_COLORS = [
  "bg-[#EAF3DE]",
  "bg-[#FAEEDA]",
  "bg-[#E6F1FB]",
  "bg-[#F3E8FB]",
  "bg-[#F1EFE8]",
];

export const STEP_ICONS = [UserPlus, ShoppingBasket, ShieldCheck, TrendingUp];

export const HOME_STEPS = [
  {
    step: 1,
    title: "Daftar Akun",
    description: "Pilih peran Anda dan lengkapi profil",
  },
  {
    step: 2,
    title: "Jelajahi & Pilih",
    description: "Temukan produk, proyek, atau pelatihan yang Anda butuhkan",
  },
  {
    step: 3,
    title: "Transaksi Aman",
    description: "Sistem pembayaran dan proteksi yang terjamin",
  },
  {
    step: 4,
    title: "Sukses Bersama",
    description: "Raih keuntungan dan kembangkan ekosistem pertanian",
  },
];

export const HOME_CATEGORY = [
  "Padi & Gabah",
  "Beras",
  "Jagung",
  "Sayur",
  "Buah",
  "Kedelai",
  "Komoditas Lokal",
];

export const CATEGORY_IMAGES = [
  "/images/home/padi-gabah.webp",
  "/images/home/beras.webp",
  "/images/home/jagung.webp",
  "/images/home/sayur.webp",
  "/images/home/buah.webp",
  "/images/home/kedelai.webp",
  "/images/home/komoditas-lokal.webp",
];

export const HOME_TESTIMONI = [
  {
    name: "Siti Aminah",
    role: "Petani Padi, Jawa Barat",
    rating: 5,
    quote:
      "Smarttani membantu saya menjual hasil panen dengan harga lebih baik dan akses modal untuk musim tanam berikutnya.",
  },
  {
    name: "Budi Santoso",
    role: "Investor",
    rating: 5,
    quote:
      "Investasi di proyek pertanian melalui Smarttani memberikan return yang kompetitif dengan risiko yang terkelola.",
  },
];

export const TESTIMONI_AVATARS = [
  "/images/about/pimpinan-siti-aminah.jpeg",
  "/images/about/pimpinan-budi-santoso.jpeg",
];

export const ARTICLE_IMAGES = [
  "/images/article/kualitas-hasil-panen.webp",
  "/images/article/kelola-keuangan.webp",
  "/images/article/teknologi-drone.webp",
];

export const HOME_ARTICLE = [
  {
    title: "5 Tips Meningkatkan Hasil Panen Padi hingga 30%",
    date: "24 Mei 2024",
  },
  {
    title: "Teknologi Drone dalam Pertanian: Manfaat dan Cara Penggunaan",
    date: "20 Mei 2024",
  },
  {
    title: "Manajemen Pakan Sapi Modern untuk Hasil Maksimal",
    date: "18 Mei 2024",
  },
];

export const HOME_CTA_BANNER = {
  heading: "Bergabunglah dengan Ekosistem Pertanian Terbesar di Indonesia",
  subtext:
    "Ribuan petani, investor, dan mitra telah merasakan manfaatnya. Sekarang giliran Anda!",
  cta: [{ label: "Pelajari Lebih Lanjut" }, { label: "Daftar Sekarang" }],
};
