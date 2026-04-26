import { PlayCircle, Search } from "lucide-react";

export const INVESTMENT_META = {
  title: "Investasi Smarttani — Investasi Cerdas untuk Pertanian Berkelanjutan",
  description:
    "Dukung proyek-proyek pertanian potensial di Indonesia dan raih keuntungan menarik sambil memberi dampak nyata bagi petani dan ketahanan pangan negeri.",
};

export const INVESTMENT_HERO = {
  badge: "Investasi Smarttani",
  heading: "Investasi Cerdas untuk Pertanian Berkelanjutan",
  subtext:
    "Dukung proyek-proyek pertanian potensial di Indonesia dan raih keuntungan menarik sambil memberi dampak nyata bagi petani dan ketahanan pangan negeri.",
  bgImageDesktop: "/images/investments/desktop.png",
  bgImageTablet: "/images/investments/tablet.png",
  bgImageMobile: "/images/investments/mobile.png",
  cta: [{ label: "Jelajahi Proyek" }, { label: "Cara Investasi" }],
  badges: [
    { label: "Aman & Terpercaya", sublabel: "Proyek diversifikasi ketat" },
    { label: "Keuntungan Menarik", sublabel: "Imbal hasil kompetitif" },
    { label: "Dampak Nyata", sublabel: "Membantu petani, membangun negeri" },
  ],
};

export const INVESTMENT_HERO_ACTIONS = [
  {
    prefix: "Temukan",
    label: "Jelajahi Proyek",
    icon: Search,
    sectionId: "proyek-investasi",
    className: "bg-[#BA7517] text-[#FAEEDA] hover:bg-[#854F0B]",
  },
  {
    prefix: "Pelajari",
    label: "Cara Investasi",
    icon: PlayCircle,
    sectionId: "cara-investasi",
    className: "bg-[#5F5E5A] text-[#F1EFE8] hover:bg-[#444441]",
  },
];

export const INVESTMENT_STATS_BAR = [
  { value: "320+", label: "Proyek Terdanai" },
  { value: "Rp320 Miliar", label: "Total Dana Terkumpul" },
  { value: "18.750+", label: "Investor Terdaftar" },
  { value: "12,5%", label: "Rata-rata Imbal Hasil" },
  { value: "98,6%", label: "Tingkat Keberhasilan" },
  { value: "4,8/5", label: "Kepuasan Investor" },
];

export const INVESTMENT_PROJECTS = {
  heading: "Proyek Investasi Terpilih",
  subtext: "Proyek berkualitas dengan potensi keuntungan optimal",
  items: [
    {
      id: "1",
      badge: "POPULER",
      title: "Budidaya Padi Premium Jawa Tengah",
      kategori: "Pertanian Pangan",
      imbalHasil: "12,5% per tahun",
      durasi: "6 Bulan",
      terkumpul: "Rp2,4 Miliar",
      progress: 80,
      minimalInvestasi: "Rp100.000",
      image: "/images/investments/budidaya-padi-premium.webp",
    },
    {
      id: "2",
      badge: "BARU",
      title: "Greenhouse Hortikultura Lembang, Jawa Barat",
      kategori: "Hortikultura",
      imbalHasil: "13,8% per tahun",
      durasi: "8 Bulan",
      terkumpul: "Rp1,8 Miliar",
      progress: 24,
      minimalInvestasi: "Rp100.000",
      image: "/images/investments/greenhouse.webp",
    },
    {
      id: "3",
      badge: "POPULER",
      title: "Perkebunan Tebu Modern Lampung",
      kategori: "Perkebunan",
      imbalHasil: "14,3% per tahun",
      durasi: "12 Bulan",
      terkumpul: "Rp3,7 Miliar",
      progress: 74,
      minimalInvestasi: "Rp250.000",
      image: "/images/investments/perkebunan-tebu-modern.webp",
    },
    {
      id: "4",
      badge: null,
      title: "Cold Storage & Distribusi Pertanian",
      kategori: "Infrastruktur",
      imbalHasil: "11,5% per tahun",
      durasi: "9 Bulan",
      terkumpul: "Rp2,1 Miliar",
      progress: 55,
      minimalInvestasi: "Rp100.000",
      image: "/images/investments/cold-storage.webp",
    },
    {
      id: "5",
      badge: null,
      title: "Pembibitan Kelapa Sawit Berkelanjutan",
      kategori: "Perkebunan",
      imbalHasil: "10,8% per tahun",
      durasi: "10 Bulan",
      terkumpul: "Rp1,5 Miliar",
      progress: 68,
      minimalInvestasi: "Rp100.000",
      image: "/images/investments/pembibitan-kelapa-sawit.webp",
    },
    {
      id: "6",
      badge: null,
      title: "Smart Farming IoT Jawa Timur",
      kategori: "Teknologi Pertanian",
      imbalHasil: "15,0% per tahun",
      durasi: "8 Bulan",
      terkumpul: "Rp2,9 Miliar",
      progress: 82,
      minimalInvestasi: "Rp250.000",
      image: "/images/investments/smart-farming-iot.webp",
    },
  ],
};

export const INVESTMENT_ADVANTAGES = {
  heading: "Mengapa Investasi di Smarttani?",
  subtext: "Keunggulan yang membuat investasi Anda aman dan menguntungkan.",
  items: [
    {
      title: "Proyek Terverifikasi",
      description: "Setiap proyek melalui proses seleksi dan verifikasi ketat.",
    },
    {
      title: "Transparansi Penuh",
      description:
        "Pantau perkembangan proyek dan penggunaan dana secara real-time.",
    },
    {
      title: "Imbal Hasil Kompetitif",
      description: "Dapatkan return menarik di atas rata-rata pasar.",
    },
    {
      title: "Manajemen Profesional",
      description: "Dikelola oleh tim ahli dengan pengalaman bertahun-tahun.",
    },
    {
      title: "Dampak Sosial Nyata",
      description: "Membantu petani dan ketahanan pangan Indonesia.",
    },
    {
      title: "Perlindungan Investor",
      description: "Sistem keamanan berlapis untuk melindungi investasi Anda.",
    },
  ],
  tagline: "Investasi Aman, Hasil Optimal",
  taglineSubtext:
    "Bergabunglah dengan ribuan investor yang telah merasakan manfaatnya.",
  ctaTagline: "Mulai Investasi",
};

export const INVESTMENT_STEPS = {
  heading: "Bagaimana Cara Berinvestasi?",
  subtext: "4 langkah mudah untuk memulai investasi",
  items: [
    {
      step: 1,
      title: "Daftar Akun",
      description: "Lengkapi profil dan verifikasi identitas.",
    },
    {
      step: 2,
      title: "Pilih Proyek",
      description: "Jelajahi proyek dan pilih yang sesuai tujuan Anda.",
    },
    {
      step: 3,
      title: "Investasi",
      description: "Tentukan nominal dan lakukan pembayaran.",
    },
    {
      step: 4,
      title: "Pantau & Raih Hasil",
      description: "Pantau perkembangan dan terima imbal hasil.",
    },
  ],
};

export const INVESTMENT_TESTIMONIALS = {
  heading: "Testimoni Investor",
  subtext: "Apa kata investor kami",
  items: [
    {
      name: "Ahmad Surya",
      role: "Investor Aktif",
      avatar: "/images/about/director-budi-santoso.jpeg",
      rating: 5,
      quote:
        "Platform Smarttani sangat terpercaya. Proyeknya jelas, return-nya menarik, and paling penting bisa membantu petani Indonesia.",
    },
    {
      name: "Dewi Lestari",
      role: "Investor Aktif",
      avatar: "/images/about/director-siti-aminah.jpeg",
      rating: 5,
      quote:
        "Sudah 1 tahun investasi di Smarttani, imbal hasilnya selalu sesuai harapan. Transparan dan laporannya juga sangat baik.",
    },
  ],
};

export const INVESTMENT_FAQ = {
  heading: "Pertanyaan Umum",
  items: [
    { question: "Apakah investasi di Smarttani aman?" },
    { question: "Berapa minimal investasi?" },
    { question: "Bagaimana cara mendapatkan imbal hasil?" },
    { question: "Kapan imbal hasil dibayarkan?" },
    { question: "Apakah ada biaya tambahan?" },
  ],
};

export const INVESTMENT_PORTFOLIO_DUMMY = {
  heading: "Portofolio Saya",
  subtext: "Ringkasan Investasi Anda di Smarttani",
  summary: {
    totalInvestasi: "Rp25.750.000",
    totalKeuntungan: "Rp2.887.500",
    proyekAktif: 5,
    imbalHasilRataRata: "12,7%",
  },
  investasiAktif: [
    {
      proyek: "Budidaya Padi Premium",
      tanggalInvestasi: "15 Mei 2024",
      totalInvestasi: "Rp5.000.000",
      imbalHasil: "12,5%",
      status: "Aktif",
    },
    {
      proyek: "Greenhouse Hortikultura",
      tanggalInvestasi: "20 Mei 2024",
      totalInvestasi: "Rp5.000.000",
      imbalHasil: "13,8%",
      status: "Aktif",
    },
    {
      proyek: "Perkebunan Tebu Modern",
      tanggalInvestasi: "10 Juni 2024",
      totalInvestasi: "Rp5.000.000",
      imbalHasil: "14,2%",
      status: "Aktif",
    },
  ],
};

export const INVESTMENT_CTA_BANNER = {
  heading: "Mulai Investasi Cerdas Anda Sekarang!",
  subtext:
    "Pilih proyek terbaik, raih keuntungan optimal, dan bersama-sama membangun pertanian Indonesia yang lebih maju.",
  cta: [{ label: "Pelajari Lebih Lanjut" }, { label: "Daftar Sekarang" }],
};
