export const ACADEMY_META = {
  title: "SiTani Academy — Belajar Hari Ini, Panen Sukses Esok Hari",
  description:
    "Tingkatkan pengetahuan dan keterampilan bertani bersama para ahli. Kursus praktis, mudah dipahami, dan bisa diakses kapan saja.",
};

export const ACADEMY_HERO = {
  badge: "Academy Smarttani",
  heading: "Belajar Hari Ini, Panen Sukses Esok Hari",
  subtext:
    "Tingkatkan pengetahuan dan keterampilan bertani bersama para ahli. Kursus praktis, mudah dipahami, dan bisa diakses kapan saja.",
  bgImageDesktop: "/images/academy/desktop.png",
  bgImageTablet: "/images/academy/tablet.png",
  bgImageMobile: "/images/academy/mobile.png",
  badges: [
    {
      label: "Kelas Online & Offline",
      sublabel: "Fleksibel sesuai kebutuhan Anda",
    },
    { label: "Instruktur Ahli", sublabel: "Praktisi berpengalaman" },
    { label: "Sertifikat Resmi", sublabel: "Tingkatkan kredibilitas Anda" },
  ],
  sidebar: {
    heading: "Mulai Belajar Sekarang!",
    subtext:
      "Ribuan petani telah meningkatkan hasil panen mereka bersama kami.",
    image: "/images/academy/sidebar.webp",
    ctaPrimary: "Daftar Gratis",
    ctaSecondary: "Lihat Cara Kerja →",
  },
};

export const ACADEMY_STATS_BAR = [
  { value: "0", label: "Peserta Aktif" },
  // { value: "8.750+", label: "Peserta Aktif" },
  { value: "0", label: "Alumni" },
  // { value: "45.680+", label: "Alumni" },
  { value: "0", label: "Kursus Tersedia" },
  // { value: "320+", label: "Kursus Tersedia" },
  { value: "0", label: "Instruktur Ahli" },
  // { value: "125+", label: "Instruktur Ahli" },
  { value: "0", label: "Kepuasan Peserta" },
  // { value: "98,6%", label: "Kepuasan Peserta" },
  { value: "0", label: "Rating Rata-rata" },
  // { value: "4,8/5", label: "Rating Rata-rata" },
];

export const ACADEMY_KEUNGGULAN = [
  {
    title: "Materi Praktis",
    description: "Langsung dari pengalaman lapangan",
  },
  {
    title: "Belajar Fleksibel",
    description: "Akses kapan saja di mana saja",
  },
  {
    title: "Sertifikat Resmi",
    description: "Tingkatkan nilai dan kredibilitas Anda",
  },
  {
    title: "Komunitas Aktif",
    description: "Berbagi pengalaman dengan petani lainnya",
  },
  {
    title: "Dukungan Mentor",
    description: "Dapatkan bimbingan dari para ahli",
  },
];

export const ACADEMY_MODEL_PELATIHAN = {
  heading: "Model Pelatihan & Waktu",
  subtext: "Pilih model belajar yang sesuai dengan kebutuhan dan waktu Anda.",
  items: [
    {
      title: "Online (Belajar Fleksibel)",
      description: "Belajar mandiri dengan akses konten kapan saja.",
      waktu: "Sesuai ritme Anda",
      cocokUntuk: "Petani dengan waktu terbatas",
    },
    {
      title: "Offline (Tatap Muka)",
      description:
        "Belajar langsung bersama instruktur dan praktik di lapangan.",
      waktu: "Sesuai jadwal kelas (contoh: 08.00–16.00 WIB)",
      cocokUntuk: "Ingin praktik langsung",
    },
    {
      title: "Blended (Kombinasi)",
      description: "Gabungan belajar online dan offline untuk hasil maksimal.",
      waktu: "Fleksibel + sesi tatap muka berkala",
      cocokUntuk: "Hasil belajar optimal",
    },
    {
      title: "In-House Training",
      description: "Pelatihan khusus untuk kelompok atau perusahaan.",
      waktu: "Custom sesuai kebutuhan",
      cocokUntuk: "Kelompok tani & perusahaan",
    },
  ],
};

export const ACADEMY_KURSUS = {
  heading: "Kursus Populer",
  subtext: "Kursus pilihan dengan materi terbaik dan rating tertinggi.",
  items: [
    {
      id: "1",
      badge: "POPULER",
      title: "Budidaya Padi Berkualitas Tinggi",
      description:
        "Teknik lengkap dari pemilihan benih hingga panen untuk hasil maksimal.",
      image: "/images/academy/budidaya-padi.webp",
      instruktur: { nama: "Dr. Ir. Budi Santoso", gelar: "Pakar Agronomi" },
      rating: 4.9,
      ulasan: 1250,
      durasi: "12 Jam",
      mode: "Online",
      cta: "Mulai Belajar",
    },
    {
      id: "2",
      badge: "TERBARU",
      title: "Hidroponik untuk Pemula",
      description:
        "Belajar hidroponik sederhana dengan biaya cepat dan menguntungkan.",
      image: "/images/academy/hidroponik.webp",
      instruktur: { nama: "Rina Yuliani, SP", gelar: "Praktisi Hidroponik" },
      rating: 4.7,
      ulasan: 980,
      durasi: "8 Jam",
      mode: "Offline",
      cta: "Mulai Belajar",
    },
    {
      id: "3",
      badge: "BEST SELLER",
      title: "Manajemen Ternak Sapi Modern",
      description:
        "Panduan lengkap manajemen pakan, kesehatan, dan reproduksi.",
      image: "/images/academy/ternak-sapi-modern.webp",
      instruktur: { nama: "Drh. Andi Wijaya", gelar: "Dokter Hewan" },
      rating: 4.9,
      ulasan: 1100,
      durasi: "16 Jam",
      mode: "Blended",
      cta: "Mulai Belajar",
    },
    {
      id: "4",
      badge: "BARU",
      title: "Penggunaan Drone untuk Pertanian",
      description: "Cara menggunakan drone untuk pemantauan dan penyemprotan.",
      image: "/images/academy/penggunaan-drone.webp",
      instruktur: {
        nama: "Fajar Nugroho, M.Eng",
        gelar: "Teknologi Pertanian",
      },
      rating: 4.8,
      ulasan: 750,
      durasi: "10 Jam",
      mode: "Online",
      cta: "Mulai Belajar",
    },
    {
      id: "5",
      badge: null,
      title: "Kesuburan Tanah & Pemupukan Tepat",
      description: "Memahami tanah dan strategi pemupukan yang efektif.",
      image: "/images/academy/kesuburan-tanah.webp",
      instruktur: { nama: "Dr. Anita Rahmawati", gelar: "Ahli Tanah" },
      rating: 4.7,
      ulasan: 620,
      durasi: "6 Jam",
      mode: "Offline",
      cta: "Mulai Belajar",
    },
    {
      id: "6",
      badge: null,
      title: "Teknik Pasca Panen Hasil Pertanian",
      description:
        "Cara mengurangi kehilangan hasil dan meningkatkan nilai jual produk.",
      image: "/images/academy/pasca-panen.webp",
      instruktur: { nama: "Agus Hidayat, SP", gelar: "Praktisi Pasca Panen" },
      rating: 4.9,
      ulasan: 540,
      durasi: "8 Jam",
      mode: "Blended",
      cta: "Mulai Belajar",
    },
  ],
};

export const ACADEMY_LEARNING_PATHS = {
  heading: "Jalur Pembelajaran Terarah",
  subtext: "Ikuti program belajar terstruktur sesuai tujuan Anda.",
  items: [
    {
      level: "Pemula",
      description: "Dasar-dasar pertanian untuk memulai dengan percaya diri.",
      jumlahKursus: 12,
      jumlahJam: 20,
    },
    {
      level: "Menengah",
      description: "Tingkatkan keterampilan dengan teknik yang lebih advanced.",
      jumlahKursus: 18,
      jumlahJam: 35,
    },
    {
      level: "Ahli",
      description:
        "Kuasai strategi tingkat lanjut dan menjadi ahli di bidangnya.",
      jumlahKursus: 25,
      jumlahJam: 50,
    },
  ],
};

export const ACADEMY_INSTRUCTORS = {
  heading: "Instruktur Ahli",
  subtext: "Belajar dari praktisi berpengalaman di bidangnya.",
  items: [
    {
      nama: "Dr. Ir. Budi Santoso",
      gelar: "Pakar Agronomi",
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.9,
      jumlahPeserta: 2100,
    },
    {
      nama: "Drh. Andi Wijaya",
      gelar: "Dokter Hewan",
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 4.9,
      jumlahPeserta: 1750,
    },
  ],
};

export const ACADEMY_TESTIMONIALS = {
  heading: "Apa Kata Mereka?",
  subtext: "Ribuan petani telah merasakan manfaat nyata dari program pembelajaran di SiTani Academy.",
  items: [
    {
      nama: "Siti Aminah",
      role: "Petani Padi, Jawa Barat",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 5,
      quote:
        "Materi sangat praktis dan mudah dipahami. Setelah ikut kursus budidaya padi, hasil panen saya meningkat 30% dan biaya pupuk jadi lebih efisien. Terima kasih SiTani Academy!",
    },
    {
      nama: "Budi Santoso",
      role: "Petani Jagung, Jawa Timur",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg",
      rating: 5,
      quote:
        "Dulu saya bertani hanya berdasarkan kebiasaan. Sekarang saya paham cara mengelola tanah yang benar. Komunitasnya juga sangat membantu untuk berbagi kendala di lapangan.",
    },
    {
      nama: "Arif Wijaya",
      role: "Petani Hortikultura, Jawa Tengah",
      avatar: "https://randomuser.me/api/portraits/men/91.jpg",
      rating: 4,
      quote:
        "Belajar hidroponik dari nol ternyata seru dan menjanjikan. Instrukturnya sabar membimbing sampai saya benar-benar bisa panen sendiri di pekarangan rumah.",
    },
  ],
};

export const ACADEMY_WEBINARS = {
  heading: "Webinar & Event Mendatang",
  subtext: "Ikuti sesi diskusi interaktif secara live bersama para pakar pertanian.",
  items: [
    {
      title: "Masa Depan Pertanian Digital di Indonesia",
      tanggal: "22 Mei 2024",
      waktu: "19.00 - 20.30 WIB",
      image: "/images/academy/masa-depan-pertanian.webp",
      cta: "Daftar Sekarang",
      kategori: "WEBINAR",
      narasumber: "Dr. Ir. Budi Santoso",
    },
    {
      title: "Workshop: Manajemen Ternak Sapi Modern",
      tanggal: "30 Mei 2024",
      waktu: "09.00 - 15.00 WIB",
      image: "/images/academy/ternak-modern.webp",
      cta: "Daftar Sekarang",
      kategori: "WORKSHOP",
      narasumber: "Drh. Andi Wijaya",
    },
    {
      title: "Optimasi Lahan Sempit dengan Hidroponik",
      tanggal: "05 Juni 2024",
      waktu: "14.00 - 16.00 WIB",
      image: "/images/academy/hidroponik.webp",
      cta: "Daftar Sekarang",
      kategori: "WEBINAR",
      narasumber: "Rina Yuliani, SP",
    },
  ],
};

export const ACADEMY_CTA_BANNER = {
  heading: "Mulai Perjalanan Belajar Anda Sekarang!",
  subtext:
    "Bergabunglah dengan ribuan petani yang telah meningkatkan hasil dan pendapatan mereka.",
  cta: [{ label: "Jelajahi Kursus" }, { label: "Daftar Gratis" }],
};

