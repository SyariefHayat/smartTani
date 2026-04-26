import { ArrowRight, Phone } from "lucide-react";

export const ABOUT_META = {
  title: "Tentang Kami — PT. Smarttani Indonesia",
  description:
    "PT. Smarttani Indonesia berkomitmen menjadi mitra terpercaya dalam transformasi pertanian Indonesia menuju masa depan yang lebih cerdas, dan berkelanjutan.",
};

export const ABOUT_HERO = {
  badge: "Tentang Smarttani",
  heading: "Bersama Membangun Masa Depan Pertanian Indonesia",
  subtext:
    "PT. Smarttani Indonesia berkomitmen menjadi mitra terpercaya dalam transformasi pertanian Indonesia menuju masa depan yang lebih cerdas, dan berkelanjutan.",
  cta: [{ label: "Pelajari Lebih Lanjut" }, { label: "Hubungi Kami" }],
  bgImageDesktop: "/images/about/desktop.png",
  bgImageTablet: "/images/about/tablet.png",
  bgImageMobile: "/images/about/mobile.png",
};

export const ABOUT_DESKRIPSI = {
  heading: "Tentang PT. SmartTani Indonesia",
  content:
    "Kami adalah perusahaan teknologi pertanian yang menyediakan platform terintegrasi untuk menghubungkan petani, distributor, investor, penyedia logistik, dan ahli melalui ekosistem digital. Sejak berdiri, kami terus berinovasi untuk mendukung pertanian Indonesia yang lebih efisien, menguntungkan, dan berkelanjutan.",
  cta: "Selengkapnya →",
};

export const ABOUT_HERO_ACTIONS = [
  {
    prefix: "Pelajari",
    label: "Lebih Lanjut",
    icon: ArrowRight,
    className: "bg-[#BA7517] text-[#FAEEDA] hover:bg-[#854F0B]",
    href: null,
  },
  {
    prefix: "Hubungi",
    label: "Kami",
    icon: Phone,
    className: "bg-[#5F5E5A] text-[#F1EFE8] hover:bg-[#444441]",
    href: "/contact",
  },
];

export const ABOUT_STATS_BAR = [
  { value: "2019", label: "Tahun Berdiri" },
  { value: "10.000+", label: "Petani Aktif" },
  { value: "500+", label: "Mitra & Distributor" },
  { value: "34", label: "Provinsi Terjangkau" },
  { value: "100+", label: "Ahli & Instruktur" },
  { value: "50+", label: "Produk Tersedia" },
];

export const ABOUT_MISI = {
  heading: "Misi Kami",
  items: [
    "Menghubungkan seluruh pelaku ekosistem pertanian melalui teknologi digital.",
    "Meningkatkan efisiensi rantai pasok pertanian.",
    "Mendukung petani dalam edukasi, pendanaan, dan akses pasar.",
    "Mendorong praktik pertanian yang berkelanjutan.",
  ],
};

export const ABOUT_VISI = {
  heading: "Visi Kami",
  content:
    "Menjadi ekosistem pertanian terintegrasi terdepan kesejahteraan petani dan ketahanan pangan nasional, pesejahleraan.",
};

export const ABOUT_NILAI = {
  heading: "Nilai Inti Kami",
  items: [
    {
      title: "Integritas",
      description: "Kami menjunjung tinggi kejujuran dan transparansi.",
    },
    {
      title: "Inovasi",
      description: "Kami terus berinovasi untuk solusi yang lebih baik.",
    },
    {
      title: "Kolaborasi",
      description: "Kami percaya pada kekuatan kerja sama.",
    },
    {
      title: "Dampak",
      description: "Kami fokus pada manfaat nyata bagi petani.",
    },
    {
      title: "Keberlanjutan",
      description: "Kami berkomitmen untuk masa depan yang lestari.",
    },
  ],
};

export const ABOUT_TIMELINE = {
  heading: "Perjalanan Kami",
  subtext: "Langkah demi langkah, kami tumbuh bersama petani Indonesia.",
  items: [
    {
      tahun: "2019",
      keterangan:
        "Didirikan dengan visi mendukung pertanian melalui teknologi.",
    },
    {
      tahun: "2020",
      keterangan: "Meluncurkan platform SiTani Marketplace dan edukasi.",
    },
    {
      tahun: "2021",
      keterangan: "Memperluas jaringan distributor dan layanan logistik.",
    },
    {
      tahun: "2022",
      keterangan: "Meluncurkan SiTani Academy dan layanan Investasi pertanian.",
    },
    {
      tahun: "2023",
      keterangan: "Menjangkau 20+ provinsi dan bermitra dengan ribuan petani.",
    },
    {
      tahun: "2024",
      keterangan:
        "Terus berinovasi menjadi ekosistem pertanian digital terpadu.",
    },
  ],
};

export const ABOUT_LAYANAN = {
  heading: "Layanan Kami",
  subtext:
    "Ekosistem terintegrasi untuk memenuhi setiap kebutuhan dalam rantai pasok pertanian.",
  items: [
    {
      title: "Marketplace",
      description:
        "Platform jual beli input pertanian berkualitas dengan harga terbaik.",
    },
    {
      title: "Investasi",
      description:
        "Peluang investasi pertanian yang aman, transparan, dan menguntungkan.",
    },
    {
      title: "Distributor",
      description:
        "Jaringan distribusi luas untuk memastikan produk sampai ke petani.",
    },
    {
      title: "Logistik",
      description:
        "Layanan pengiriman cepat, aman, dan terintegrasi ke seluruh Indonesia.",
    },
    {
      title: "SiTani Academy",
      description:
        "Edukasi dan pelatihan praktis untuk meningkatkan keterampilan petani.",
    },
    {
      title: "Artikel",
      description:
        "Informasi terbaru, tips, dan insight seputar dunia pertanian.",
    },
  ],
};

export const ABOUT_PENCAPAIAN = {
  heading: "Pencapaian Kami",
  items: [
    "Terpercaya oleh 10.000+ petani di seluruh Indonesia",
    "Mitra distribusi di 34 provinsi",
    "Transaksi produk pertanian senilai 100+ miliar rupiah",
    "Tingkat kepuasan pengguna 98,5%",
    "Ribuan petani telah mengikuti pelatihan di SiTani Academy",
  ],
};

export const ABOUT_PIMPINAN = {
  heading: "Kepemimpinan Kami",
  items: [
    {
      nama: "Arif Wijaya",
      jabatan: "Direktur Utama",
      foto: "/images/about/director-arif-wijaya.jpeg",
    },
    {
      nama: "Budi Santoso",
      jabatan: "Direktur Operasional",
      foto: "/images/about/director-budi-santoso.jpeg",
    },
    {
      nama: "Siti Aminah",
      jabatan: "Direktur Edukasi",
      foto: "/images/about/director-siti-aminah.jpeg",
    },
  ],
  placeholder: "/images/about/placeholder-professional.jpeg",
};

export const ABOUT_ALAMAT = {
  heading: "Alamat & Kontak Perusahaan",
  alamat:
    "Jin raya Karangbinangun km 1 no 42, Alang Alang Karangbinangun, Lamongan 62293, Jawa Timur, Indonesia",
  telepon: "0823 2695 2833",
};

export const ABOUT_MITRA_STRATEGIS = {
  heading: "Mitra Strategis Kami",
  items: [
    { nama: "Pupuk Indonesia", logo: "/images/partners/partner-pupuk-indonesia.png" },
    { nama: "Pos Indonesia", logo: "/images/partners/partner-pos-indonesia.png" },
    { nama: "Bank BRI", logo: "/images/partners/partner-bri.png" },
    { nama: "Telkom Indonesia", logo: "/images/partners/partner-telkom.png" },
    { nama: "JNE", logo: "/images/partners/partner-jne.png" },
    { nama: "Bayer", logo: "/images/partners/partner-bayer.png" },
  ],
};

export const ABOUT_CTA_BANNER = {
  heading: "Mari Bertumbuh Bersama SmartTani",
  subtext:
    "Bergabunglah dengan ekosistem pertanian terintegrasi kami dan rasakan manfaatnya untuk bisnis pertanian Anda.",
  cta: [{ label: "Hubungi Kami" }, { label: "Daftar Sekarang" }],
};
