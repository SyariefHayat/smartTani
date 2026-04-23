import { ShieldCheck, Tag, Truck } from "lucide-react";
import { Product } from "./types";

export const MARKETPLACE_META = {
  title:
    "Marketplace Smarttani — Semua Kebutuhan Pertanian dalam Satu Platform",
  description:
    "Temukan produk berkualitas, harga terbaik, dan pengiriman cepat untuk mendukung setiap langkah usaha pertanian Anda. Marketplace terpercaya untuk petani, distributor, dan pelaku agribisnis Indonesia.",
};

export const MARKETPLACE_HERO = {
  badge: "Marketplace Smarttani",
  heading: "Semua Kebutuhan Pertanian dalam Satu Platform Terpercaya",
  subtext:
    "Temukan produk berkualitas, harga terbaik, dan pengiriman cepat untuk mendukung setiap langkah usaha pertanian Anda.",
  bgImageDesktop: "/images/marketplace/desktop.png",
  bgImageTablet: "/images/marketplace/tablet.png",
  bgImageMobile: "/images/marketplace/mobile-8.png",
  badges: [
    { label: "Produk Terverifikasi", sublabel: "Kualitas Terjamin" },
    { label: "Harga Kompetitif", sublabel: "Lebih Hemat" },
    { label: "Pengiriman Cepat", sublabel: "Sampai ke Lokasi Anda" },
  ],
};

export const ICON_MAP = [ShieldCheck, Tag, Truck];

export const MARKETPLACE_TABS = [
  "Terlaris",
  "Terbaru",
  "Promo",
  "Rating Tertinggi",
];

const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Benih Padi Inpari 32 5 Kg",
    description: "Benih berkualitas, hasil tinggi, tahan penyakit.",
    price: 95000,
    originalPrice: 110000,
    image: "/images/marketplace/benih-padi.png",
    rating: 4.8,
    terjual: "1.250+",
    isPromo: true,
    storeType: "Official Store",
    storeName: "Official Store",
  },
  {
    id: "2",
    name: "Pupuk NPK Mutiara 16-16-16 - 50 Kg",
    description: "Nutrisi seimbang untuk pertumbuhan optimal.",
    price: 210000,
    originalPrice: 250000,
    image: "/images/marketplace/pupuk-npk-mutiara.png",
    rating: 4.9,
    terjual: "950+",
    isPromo: true,
    storeType: "Official Store",
    storeName: "Official Store",
  },
  {
    id: "3",
    name: "Pestisida Amistar 250 SC - 1 Liter",
    description: "Ampuh basmi jamur, aman untuk tanaman.",
    price: 175000,
    originalPrice: 200000,
    image: "/images/marketplace/pestisida-amistar.png",
    rating: 4.7,
    terjual: "780+",
    isPromo: true,
    storeType: "Official Store",
    storeName: "Official Store",
  },
  {
    id: "4",
    name: "Traktor Roda 4 25 HP",
    description: "Tangguh di segala medan, irit bahan bakar.",
    price: 75500000,
    originalPrice: 82000000,
    image: "/images/marketplace/traktor-roda-4.png",
    rating: 4.9,
    terjual: "120+",
    isPromo: true,
    storeType: "Distributor Resmi",
    storeName: "Distributor Resmi",
  },
  {
    id: "5",
    name: "Alat Semprot Elektrik 16L",
    description: "Praktis, hemat tenaga, hasil semprotan merata.",
    price: 350000,
    originalPrice: 450000,
    image: "/images/marketplace/alat-semprot.png",
    rating: 4.6,
    terjual: "1.100+",
    isPromo: true,
    storeType: "Official Store",
    storeName: "Official Store",
  },
  {
    id: "6",
    name: "Pipa Irigasi PVC 3 Inch - 4 Meter",
    description: "Kuat, tahan lama, cocok untuk sistem irigasi.",
    price: 125000,
    originalPrice: 150000,
    image: "/images/marketplace/pipa-pvc.png",
    rating: 4.7,
    terjual: "600+",
    isPromo: true,
    storeType: "Official Store",
    storeName: "Official Store",
  },
];

export const ALL_PRODUCTS = SAMPLE_PRODUCTS;

export const MARKETPLACE_PRODUK: Record<string, Product[]> = {
  Terlaris: ALL_PRODUCTS,
  Terbaru: ALL_PRODUCTS.slice().reverse(),
  Promo: ALL_PRODUCTS.filter((p) => p.isPromo),
  "Rating Tertinggi": ALL_PRODUCTS.sort((a, b) => b.rating - a.rating),
};

export const MARKETPLACE_TERLARIS_DATA = {
  heading: "Produk Terlaris",
  items: ALL_PRODUCTS,
  cta: "Lihat Semua",
};

export const MARKETPLACE_KATEGORI_SIDEBAR = [
  { label: "Benih & Bibit", count: "1.250+" },
  { label: "Pupuk & Nutrisi", count: "2.350+" },
  { label: "Pestisida", count: "1.120+" },
  { label: "Alat & Mesin", count: "980+" },
  { label: "Irigasi", count: "640+" },
  { label: "Pakan Ternak", count: "520+" },
  { label: "Hasil Panen", count: "1.100+" },
  { label: "Lainnya", count: "200+" },
];

export const MARKETPLACE_FILTER = {
  brands: [
    { label: "Smarttani", count: 240 },
    { label: "Biotis", count: 180 },
    { label: "Petroganic", count: 120 },
    { label: "DGW", count: 95 },
    { label: "Syngenta", count: 150 },
  ],
  ratings: [
    { label: "5", value: 5, count: 450 },
    { label: "4 ke atas", value: 4, count: 820 },
    { label: "3 ke atas", value: 3, count: 120 },
  ],
  sellerTypes: [
    { label: "Official Store", value: "official" },
    { label: "Distributor Resmi", value: "distributor" },
    { label: "UMKM", value: "umkm" },
  ],
  locations: [
    "DKI Jakarta",
    "Jawa Barat",
    "Jawa Tengah",
    "Jawa Timur",
    "Sumatera Utara",
    "Sulawesi Selatan",
  ],
};

export const MARKETPLACE_KATEGORI_POPULER = [
  {
    label: "Benih & Bibit",
    jumlahProduk: "1.250+",
    image: "/images/distributor/benih-&-bibit.webp",
  },
  {
    label: "Pupuk & Nutrisi",
    jumlahProduk: "2.350+",
    image: "/images/distributor/pupuk-&-nutrisi.webp",
  },
  {
    label: "Pestisida",
    jumlahProduk: "1.120+",
    image: "/images/distributor/pestisida.webp",
  },
  {
    label: "Alat & Mesin",
    jumlahProduk: "980+",
    image: "/images/distributor/alat-&-mesin.webp",
  },
  {
    label: "Irigasi",
    jumlahProduk: "640+",
    image: "/images/distributor/irigasi.webp",
  },
  {
    label: "Pakan Ternak",
    jumlahProduk: "520+",
    image: "/images/distributor/pakan-ternak.webp",
  },
  {
    label: "Hasil Panen",
    jumlahProduk: "1.100+",
    image: "/images/distributor/hasil-panen.webp",
  },
  {
    label: "Lainnya",
    sublabel: "Lihat Semua",
    image: "/images/distributor/sidebar.webp",
  },
];

export const MARKETPLACE_TRUST_BAR = [
  { label: "Pembayaran Aman", sublabel: "Transaksi 100% aman" },
  { label: "Garansi Produk", sublabel: "Jaminan kualitas resmi" },
  { label: "Pengiriman Cepat", sublabel: "Sampai ke seluruh Indonesia" },
  { label: "Layanan Pelanggan", sublabel: "Siap membantu 24/7" },
];

export const MARKETPLACE_WHY = {
  heading: "Kenapa Belanja di Marketplace Smarttani?",
  items: [
    {
      title: "Produk Terverifikasi",
      description: "Setiap produk melalui proses verifikasi kualitas.",
    },
    {
      title: "Harga Terbaik",
      description: "Dapatkan harga kompetitif dari penjual terpercaya.",
    },
    {
      title: "Transaksi Aman",
      description: "Sistem pembayaran terenkripsi dan terpercaya.",
    },
    {
      title: "Pengiriman Cepat",
      description: "Bekerja sama dengan ekspedisi andal di seluruh Indonesia.",
    },
    {
      title: "Dukungan 24/7",
      description: "Tim kami siap membantu kapan saja.",
    },
  ],
};

export const MARKETPLACE_BANNER_MITRA = {
  heading: "Jadi Mitra Penjual Bersama Smarttani",
  subtext: "Jangkau ribuan petani di seluruh Indonesia.",
  cta: { label: "Daftar Sekarang" },
};
