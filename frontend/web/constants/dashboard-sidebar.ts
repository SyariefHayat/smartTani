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
  Command,
  GalleryVerticalEnd,
} from "lucide-react";
import { SidebarData, SidebarTeam, SidebarNavGroup } from "./types";

export const DASHBOARD_TEAMS: SidebarTeam[] = [
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

export const DASHBOARD_NAV_GROUPS: SidebarNavGroup[] = [
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

export const sidebarData: SidebarData = {
  user: {
    name: "SmartTani User",
    email: "user@smarttaniindonesia.com",
    avatar: "/images/home/dashboard-logo.png",
  },
  teams: DASHBOARD_TEAMS,
  navGroups: DASHBOARD_NAV_GROUPS,
};
