"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, Bell, ShoppingCart, Menu, LogIn, UserPlus,
  X, ChevronRight, Home, Store, TrendingUp, Truck, Package, GraduationCap,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet, SheetTrigger, SheetContent, SheetHeader,
  SheetTitle, SheetClose,
} from "@/components/ui/sheet";
import {
  NavigationMenu, NavigationMenuList,
  NavigationMenuItem, NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { HEADER_NAV } from "@/constants";

const BOTTOM_NAV = [
  { label: "Beranda", href: "/", icon: Home },
  { label: "Marketplace", href: "/marketplace", icon: Store },
  { label: "Investasi", href: "/investasi", icon: TrendingUp },
  { label: "Distributor", href: "/distributor", icon: Package },
  { label: "Logistik", href: "/logistik", icon: Truck },
  { label: "Academy", href: "/sitani-academy", icon: GraduationCap },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tabletOpen, setTabletOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      const auth = localStorage.getItem("smarttani-auth");
      if (auth) { try { setUser(JSON.parse(auth)); } catch { setUser(null); } }
      else setUser(null);

      const cart = localStorage.getItem("smarttani-cart");
      if (cart) {
        try {
          const parsed = JSON.parse(cart);
          if (Array.isArray(parsed))
            setCartCount(parsed.reduce((s, i) => s + (i.qty || 1), 0));
        } catch { setCartCount(0); }
      } else setCartCount(0);
    };
    handleStorage();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("smarttani-cart-update", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("smarttani-cart-update", handleStorage);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/marketplace?q=${encodeURIComponent(query.trim())}`);
      setMobileOpen(false);
      setTabletOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("smarttani-auth");
    localStorage.removeItem("smarttani-cart");
    setUser(null);
    setCartCount(0);
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  const getDashboardLink = () => {
    if (!user) return "/";
    return user.role === "investor" ? "/dashboard/investor" : "/dashboard/petani";
  };

  /* ─── Shared Sheet Content (dipakai mobile & tablet) ─── */
  const DrawerContent = ({ onClose }: { onClose: () => void }) => (
    <>
      {/* Header */}
      <SheetHeader className="p-5 border-b border-border/60 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center justify-between">
          <SheetTitle>
            <div className="relative w-28 h-14">
              <Image src="/images/home/logo-2.png" alt="Logo" className="object-contain" sizes="100%" loading="eager" fill />
            </div>
          </SheetTitle>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10">
              <X className="size-4" />
            </Button>
          </SheetClose>
        </div>
      </SheetHeader>

      {/* Search */}
      <div className="p-4 border-b border-border/60">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari produk, layanan..."
            className="pl-10 h-11 bg-neutral-50 border-neutral-200 rounded-full text-sm"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </form>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 overflow-y-auto p-3">
        <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Menu</p>
        {HEADER_NAV.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group",
                  isActive ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-muted/80"
                )}
              >
                {Icon && (
                  <span className={cn(
                    "flex items-center justify-center w-9 h-9 rounded-lg shrink-0 transition-colors",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "bg-muted/60 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                  )}>
                    <Icon className="size-[18px]" />
                  </span>
                )}
                <span className="flex-1">{item.label}</span>
                <ChevronRight className={cn(
                  "size-4 transition-colors",
                  isActive ? "text-primary/60" : "text-muted-foreground/40 group-hover:text-primary/50"
                )} />
              </Link>
            </SheetClose>
          );
        })}
      </nav>

      {/* Auth */}
      <div className="p-4 border-t border-border/60 space-y-2">
        {user ? (
          <>
            <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shrink-0">
                {user.name?.charAt(0).toUpperCase() ?? "U"}
              </div>
              <div className="flex-1 truncate">
                <p className="font-semibold text-sm">{user.name || "User"}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role || "Member"}</p>
              </div>
            </div>
            <SheetClose asChild>
              <Button variant="outline" className="w-full justify-start gap-2" size="lg" asChild>
                <Link href={getDashboardLink()}>Dashboard</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="outline" className="w-full justify-start gap-2" size="lg" asChild>
                <Link href="/dashboard/profile">Profile</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="destructive" className="w-full" size="lg" onClick={handleLogout}>
                Logout
              </Button>
            </SheetClose>
          </>
        ) : (
          <>
            <SheetClose asChild>
              <Button variant="outline" className="w-full gap-2" size="lg" asChild>
                <Link href="/login"><LogIn className="size-4" />Masuk</Link>
              </Button>
            </SheetClose>
            <SheetClose asChild>
              <Button variant="accent" className="w-full gap-2" size="lg" asChild>
                <Link href="/signup"><UserPlus className="size-4" />Daftar</Link>
              </Button>
            </SheetClose>
          </>
        )}
      </div>
    </>
  );

  return (
    <>
      {/* ══════════════════════════════════════════
          HEADER
      ══════════════════════════════════════════ */}
      <header
        id="main-navbar"
        className={cn(
          // Mobile (< sm): absolute transparan, overlay di atas hero
          // Tablet (sm-lg) & Desktop (lg+): sticky dengan bg putih
          "z-50 w-full transition-all duration-300",
          "sm:sticky sm:top-0 absolute top-0 left-0 right-0",
          "sm:bg-white sm:border-b sm:border-border/50",
          scrolled && "sm:shadow-md"
        )}
      >
        <div className="container-smarttani">
          <div className="flex items-center justify-between gap-4 py-3">

            {/* Logo */}
            <Link href="/" id="navbar-logo" className="flex items-center gap-3 shrink-0">
              <div className="relative w-24 h-14 sm:w-32 sm:h-16 md:w-36 md:h-20 lg:w-28 lg:h-16">
                <Image src="/images/home/logo.png" alt="Logo Smarttani Indonesia"
                  className="object-contain" loading="eager" sizes="100%" fill />
              </div>
              {/* Deskripsi hanya tampil di desktop (lg ke atas) */}
              <div className="hidden lg:block">
                <h1 className="text-base font-bold text-primary leading-tight">PT. Smarttani Indonesia</h1>
                <p className="text-xs text-muted-foreground leading-tight max-w-70">
                  Platform terintegrasi untuk ekosistem pertanian yang lebih cerdas, produktif, dan berkelanjutan.
                </p>
              </div>
            </Link>

            {/* Search Bar — desktop only */}
            <div className="hidden lg:flex items-center flex-1 max-w-lg mx-4">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input id="navbar-search" type="search"
                  placeholder="Cari produk, layanan, atau informasi..."
                  className="pl-10 pr-20 h-10 bg-neutral-100 border-neutral-200 rounded-full text-sm"
                  value={query} onChange={(e) => setQuery(e.target.value)} />
                <Button type="submit" size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 rounded-full px-4 text-xs cursor-pointer">
                  Cari
                </Button>
              </form>
            </div>

            {/* Actions — desktop */}
            <div className="hidden lg:flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Notifikasi" className="cursor-pointer">
                <Bell className="size-5" />
              </Button>
              <Button variant="ghost" size="icon" aria-label="Keranjang"
                className="cursor-pointer relative"
                onClick={() => window.dispatchEvent(new CustomEvent("toggle-cart"))}>
                <ShoppingCart className="size-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Button>
              <div className="w-px h-6 bg-border mx-1" />
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2 px-2 cursor-pointer focus-visible:ring-0">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shrink-0">
                        {user.name?.charAt(0).toUpperCase() ?? "U"}
                      </div>
                      <span className="text-sm font-medium hidden xl:inline-block">
                        {user.name ? (user.name.length > 10 ? user.name.substring(0, 10) + "..." : user.name) : "User"}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()} className="cursor-pointer w-full">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="cursor-pointer w-full">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button variant="ghost" size="sm" id="navbar-login" className="gap-1.5 cursor-pointer rounded-md" asChild>
                    <Link href="/login"><LogIn className="size-4" />Masuk</Link>
                  </Button>
                  <Button variant="accent" size="sm" id="navbar-register" className="gap-1.5 cursor-pointer rounded-md" asChild>
                    <Link href="/signup"><UserPlus className="size-4" />Daftar</Link>
                  </Button>
                </>
              )}
            </div>

            {/* ── MOBILE actions (< sm) ── */}
            <div className="flex sm:hidden items-center gap-1">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="cursor-pointer h-9 w-9 focus-visible:ring-0">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                        {user.name?.charAt(0).toUpperCase() ?? "U"}
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href={getDashboardLink()} className="cursor-pointer w-full">Dashboard</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/profile" className="cursor-pointer w-full">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-1.5">
                  <Button variant="ghost" size="sm"
                    className="gap-1 cursor-pointer h-8 px-3 text-xs font-medium text-white hover:bg-white/20 hover:text-white" asChild>
                    <Link href="/login"><LogIn className="size-3.5" />Masuk</Link>
                  </Button>
                  <Button variant="accent" size="sm" className="gap-1 cursor-pointer h-8 px-3 text-xs font-medium" asChild>
                    <Link href="/signup"><UserPlus className="size-3.5" />Daftar</Link>
                  </Button>
                </div>
              )}
            </div>

            {/* ── TABLET actions (sm → lg): Logo sudah ada, hanya Hamburger ── */}
            <div className="hidden sm:flex lg:hidden items-center">
              {/* Hamburger tablet */}
              <Sheet open={tabletOpen} onOpenChange={setTabletOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon"
                    aria-label="Menu navigasi"
                    className="cursor-pointer h-10 w-10">
                    <Menu className="size-6 text-foreground/80" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0 flex flex-col" showCloseButton={false}>
                  <DrawerContent onClose={() => setTabletOpen(false)} />
                </SheetContent>
              </Sheet>
            </div>

          </div>
        </div>

        {/* Desktop nav links */}
        <div className="hidden lg:block border-t border-border/50">
          <div className="container-smarttani">
            <NavigationMenu viewport={false} className="mx-0 max-w-full w-full">
              <NavigationMenuList className="gap-0">
                {HEADER_NAV.map((item) => {
                  const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
                  return (
                    <NavigationMenuItem key={item.href}>
                      <NavigationMenuLink asChild>
                        <Link href={item.href}
                          className={cn(
                            "inline-flex items-center px-4 py-3 text-sm font-medium transition-colors relative hover:text-primary",
                            isActive ? "text-primary font-semibold" : "text-muted-foreground"
                          )}>
                          {item.label}
                          {isActive && (
                            <span className="absolute bottom-0 left-4 right-4 h-[2.5px] bg-primary rounded-full mb-1.5" />
                          )}
                        </Link>
                      </NavigationMenuLink>
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════
          BOTTOM NAV — mobile only (< sm)
          Glassmorphism Apple style
      ══════════════════════════════════════════ */}
      <nav
        id="bottom-navbar"
        aria-label="Navigasi bawah"
        className="sm:hidden fixed bottom-0 left-0 right-0 z-50 h-[68px] flex items-center px-1.5 bg-[#0B2F13]"
        style={{
          borderTop: "1px solid rgba(255, 255, 255, 0.2)",
          boxShadow: "0 -4px 16px rgba(0,0,0,0.1)",
        }}
      >
        {BOTTOM_NAV.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              id={`bottom-nav-${item.href.replace("/", "") || "beranda"}`}
              aria-current={isActive ? "page" : undefined}
              className="flex flex-col items-center justify-center flex-1 gap-1 py-2 px-1 transition-all duration-200 relative"
            >
              <div className={cn(
                "flex items-center justify-center w-10 h-7 rounded-full transition-all duration-200",
                isActive ? "bg-white/25" : ""
              )}>
                <Icon className={cn(
                  "size-[19px] transition-all duration-200",
                  "text-white"
                )} />
              </div>
              <span className={cn(
                "text-[9.5px] leading-none font-semibold tracking-tight max-w-full",
                "text-white"
              )}>
                {item.label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[3px] bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </>
  );
}