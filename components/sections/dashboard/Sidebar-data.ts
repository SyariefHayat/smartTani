import { DASHBOARD_TEAMS, DASHBOARD_NAV_GROUPS } from "@/constants/dashboard-sidebar";

type User = {
  name: string;
  email: string;
  avatar: string;
};

type Team = {
  name: string;
  logo: React.ElementType;
  plan: string;
};

type BaseNavItem = {
  title: string;
  badge?: string;
  icon?: React.ElementType;
};

type NavLink = BaseNavItem & {
  url: string;
  items?: never;
};

type NavCollapsible = BaseNavItem & {
  items: (BaseNavItem & { url: string })[];
  url?: never;
};

type NavItem = NavCollapsible | NavLink;

type NavGroup = {
  title: string;
  items: NavItem[];
};

type SidebarData = {
  user: User;
  teams: Team[];
  navGroups: NavGroup[];
};

export const sidebarData: SidebarData = {
  user: {
    name: "SmartTani User",
    email: "user@smarttaniindonesia.com",
    avatar: "/images/home/dashboard-logo.png",
  },
  teams: DASHBOARD_TEAMS,
  navGroups: DASHBOARD_NAV_GROUPS,
};
