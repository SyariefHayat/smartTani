import { Feature, JenisKeanggotaan } from "./types";

// ─── META ────────────────────────────────────────────────────────────────────
export const DAFTAR_META = {
  title: "Daftar — Smarttani Indonesia",
  description:
    "Daftar akun Smarttani untuk mengakses solusi pertanian terintegrasi, marketplace, investasi, dan jaringan distribusi di seluruh Indonesia.",
};

// ─── HERO ────────────────────────────────────────────────────────────────────
export const DAFTAR_HERO = {
  heading: "Mulai Perjalanan Anda!",
  subtext:
    "Buat akun Anda untuk mengakses berbagai layanan Smarttani.",
};

// ─── JENIS KEANGGOTAAN ──────────────────────────────────────────────────────
export const DAFTAR_JENIS_KEANGGOTAAN: JenisKeanggotaan[] = [
  {
    id: "petani",
    label: "Petani",
    description:
      "Akses solusi pertanian, edukasi, dan jaringan pasar.",
    icon: "sprout",
  },
  {
    id: "distributor",
    label: "Distributor",
    description:
      "Kelola distribusi produk secara efisien.",
    icon: "truck",
  },
  {
    id: "investor",
    label: "Investor",
    description:
      "Temukan peluang investasi di sektor pertanian.",
    icon: "handshake",
  },
  {
    id: "mitra-bisnis",
    label: "Mitra Bisnis",
    description:
      "Berkolaborasi dalam ekosistem Smarttani.",
    icon: "briefcase",
  },
  {
    id: "admin-perusahaan",
    label: "Admin Perusahaan",
    description:
      "Kelola operasional dan data perusahaan.",
    icon: "users",
  },
];

// ─── KEUNTUNGAN ──────────────────────────────────────────────────────────────
export const DAFTAR_KEUNTUNGAN: Feature[] = [
  {
    title: "Aman & Terpercaya",
    description:
      "Sistem keamanan berlapis untuk melindungi data Anda.",
    icon: "shield-check",
  },
  {
    title: "Akses Cepat",
    description:
      "Masuk dengan mudah dan nikmati layanan tanpa hambatan.",
    icon: "zap",
  },
  {
    title: "Bantuan 24/7",
    description:
      "Tim kami siap membantu kapan pun Anda membutuhkan.",
    icon: "headset",
  },
  {
    title: "Jaringan Luas",
    description:
      "Terhubung dengan ribuan petani, distributor, dan mitra di seluruh Indonesia.",
    icon: "globe",
  },
];

// ─── FORM LABELS ─────────────────────────────────────────────────────────────
export const DAFTAR_FORM_LABELS = {
  namaLengkap: "Nama Lengkap",
  email: "Email atau Nomor HP",
  kataSandi: "Kata Sandi",
  konfirmasiKataSandi: "Konfirmasi Kata Sandi",
};

// ─── FORM PLACEHOLDERS ──────────────────────────────────────────────────────
export const DAFTAR_FORM_PLACEHOLDERS = {
  namaLengkap: "Masukkan nama lengkap Anda",
  email: "Masukkan email atau nomor HP Anda",
  kataSandi: "Masukkan kata sandi Anda",
  konfirmasiKataSandi: "Masukkan ulang kata sandi Anda",
};

// ─── FORM HINTS ──────────────────────────────────────────────────────────────
export const DAFTAR_FORM_HINTS = {
  namaLengkap: "Gunakan nama sesuai identitas resmi Anda.",
  email: "Pastikan email atau nomor HP aktif untuk verifikasi.",
  kataSandi: "Minimal 8 karakter, kombinasi huruf besar, huruf kecil, dan angka.",
  konfirmasiKataSandi: "Harus sama dengan kata sandi di atas.",
};

// ─── BUTTONS ─────────────────────────────────────────────────────────────────
export const DAFTAR_BUTTONS = {
  submit: "Daftar Sekarang",
  masuk: "Masuk",
  sudahPunyaAkun: "Sudah punya akun?",
};

// ─── SYARAT & KETENTUAN ─────────────────────────────────────────────────────
export const DAFTAR_SYARAT = {
  label:
    "Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi PT. Smarttani Indonesia.",
  syaratLink: "/syarat",
  privasiLink: "/privasi",
};

// ─── TRUST BAR ───────────────────────────────────────────────────────────────
export const DAFTAR_TRUST_BAR: Feature[] = [
  {
    title: "Aman & Terpercaya",
    description:
      "Sistem keamanan berlapis untuk melindungi data Anda.",
    icon: "shield-check",
  },
  {
    title: "Akses Cepat",
    description:
      "Masuk dengan mudah dan nikmati layanan tanpa hambatan.",
    icon: "zap",
  },
  {
    title: "Bantuan 24/7",
    description:
      "Tim kami siap membantu kapan pun Anda membutuhkan.",
    icon: "headset",
  },
  {
    title: "Data Terenkripsi",
    description:
      "Seluruh data Anda dienkripsi dengan standar keamanan tinggi.",
    icon: "lock",
  },
];
