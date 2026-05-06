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
  Settings,
  ShieldCheck,
  Activity,
  Handshake,
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
} from "lucide-react";

export const DASHBOARD_TEAMS = [
  {
    name: "PT. Smarttani Indonesia",
    logo: Command,
    plan: "Enterprise",
  },
  {
    name: "Smarttani Academy",
    logo: GraduationCap,
    plan: "Education",
  },
  {
    name: "Koperasi Smarttani",
    logo: GalleryVerticalEnd,
    plan: "Member",
  },
];

export const DASHBOARD_NAV_GROUPS = [
  {
    title: "Utama",
    items: [
      {
        title: "Beranda",
        url: "/",
        icon: Home,
      },
      {
        title: "Marketplace",
        url: "/marketplace",
        icon: Store,
      },
      {
        title: "Investasi",
        url: "/investments",
        icon: TrendingUp,
      },
    ],
  },
  {
    title: "Layanan",
    items: [
      {
        title: "Distributor",
        url: "/distributors",
        icon: Package,
      },
      {
        title: "Logistik",
        url: "/logistics",
        icon: Truck,
      },
      {
        title: "SiTani Academy",
        url: "/academy",
        icon: GraduationCap,
      },
    ],
  },
  {
    title: "Informasi",
    items: [
      {
        title: "Artikel",
        url: "/articles",
        icon: Newspaper,
      },
      {
        title: "Tentang",
        url: "/about",
        icon: Info,
      },
      {
        title: "Kontak",
        url: "/contact",
        icon: Mail,
      },
    ],
  },
];
