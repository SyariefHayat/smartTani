"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  Bell,
  ShoppingCart,
  Menu,
  LogIn,
  UserPlus,
  X,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { HEADER_NAV } from "@/constants";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
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
      // Auth
      const auth = localStorage.getItem("smarttani-auth");
      if (auth) {
        try {
          setUser(JSON.parse(auth));
        } catch (e) {
          console.error("Error parsing auth", e);
        }
      } else {
        setUser(null);
      }

      // Cart
      const cart = localStorage.getItem("smarttani-cart");
      if (cart) {
        try {
          const parsedCart = JSON.parse(cart);
          if (Array.isArray(parsedCart)) {
            const count = parsedCart.reduce((sum, item) => sum + (item.qty || 1), 0);
            setCartCount(count);
          }
        } catch (e) {
          console.error("Error parsing cart", e);
        }
      } else {
        setCartCount(0);
      }
    };

    handleStorage();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("smarttani-cart-update", handleStorage); // Custom event for local updates
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
    if (user.role === "investor") return "/dashboard/investor";
    return "/dashboard/petani";
  };

  return (
    <header
      id="main-navbar"
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-md" : "bg-white",
      )}
    >
      {/* ─── Top Row: Logo + Search + Actions ─── */}
      <div className="container-smarttani">
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Logo */}
          <Link
            href="/"
            id="navbar-logo"
            className="flex items-center gap-3 shrink-0"
          >
            <div className="relative w-28 h-14 sm:w-32 md:w-36 md:h-20 lg:w-28 lg:h-16">
              <Image
                src="/images/home/logo.png"
                alt="Logo Smarttani Indonesia"
                className="object-contain"
                loading="eager"
                sizes="100%"
                fill
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-primary leading-tight">
                PT. Smarttani Indonesia
              </h1>
              <p className="text-xs text-muted-foreground leading-tight max-w-55 lg:max-w-70">
                Platform terintegrasi untuk ekosistem pertanian yang lebih
                cerdas, produktif, dan berkelanjutan.
              </p>
            </div>
          </Link>

          {/* Search Bar — desktop only */}
          <div className="hidden lg:flex items-center flex-1 max-w-lg mx-4">
            <form onSubmit={handleSearch} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                id="navbar-search"
                type="search"
                placeholder="Cari produk, layanan, atau informasi..."
                className="pl-10 pr-20 h-10 bg-neutral-100 border-neutral-200 rounded-full text-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 rounded-full px-4 text-xs cursor-pointer"
              >
                Cari
              </Button>
            </form>
          </div>

          {/* Actions — desktop */}
          <div className="hidden lg:flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              id="navbar-notif"
              aria-label="Notifikasi"
              className="cursor-pointer"
            >
              <Bell className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              id="navbar-cart"
              aria-label="Keranjang"
              className="cursor-pointer relative"
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-cart'))}
            >
              <ShoppingCart className="size-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Button>
            <div className="w-px h-6 bg-border mx-1" />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-2 px-2 cursor-pointer focus-visible:ring-0">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white shrink-0">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
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
                <Button
                  variant="ghost"
                  size="sm"
                  id="navbar-login"
                  className="gap-1.5 cursor-pointer rounded-md"
                  asChild
                >
                  <Link href="/login">
                    <LogIn className="size-4" />
                    Masuk
                  </Link>
                </Button>
                <Button
                  variant="accent"
                  size="sm"
                  id="navbar-register"
                  className="gap-1.5 cursor-pointer rounded-md"
                  asChild
                >
                  <Link href="/signup">
                    <UserPlus className="size-4" />
                    Daftar
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile: Notification + Cart + Hamburger */}
          <div className="flex lg:hidden items-center gap-0.5">
            {/* Mobile Notification */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notifikasi"
              className="hidden cursor-pointer h-10 w-10"
            >
              <Bell className="size-[22px] text-foreground/80" />
            </Button>

            {/* Mobile Cart */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Keranjang"
              className="hidden relative cursor-pointer h-10 w-10"
              onClick={() => window.dispatchEvent(new CustomEvent('toggle-cart'))}
            >
              <ShoppingCart className="size-[22px] text-foreground/80" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1 ring-2 ring-white">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Button>

            {/* Divider */}
            <div className="hidden w-px h-6 bg-border/60 mx-0.5" />

            {/* Mobile Hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  id="navbar-mobile-toggle"
                  aria-label="Menu navigasi"
                  className="cursor-pointer h-10 w-10"
                >
                  <Menu className="size-6 text-foreground/80" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 p-0"
                showCloseButton={false}
              >
                {/* Mobile Sheet Header */}
                <SheetHeader className="p-5 border-b border-border/60 bg-gradient-to-r from-primary/5 to-transparent">
                  <div className="flex items-center justify-between">
                    <SheetTitle>
                      <div className="flex items-center gap-3">
                        <div className="relative w-28 h-14 md:w-32 md:h-16">
                          <Image
                            src="/images/home/logo.png"
                            alt="Logo"
                            className="object-contain"
                            sizes="100%"
                            loading="eager"
                            fill
                          />
                        </div>
                      </div>
                    </SheetTitle>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon-sm" className="rounded-full hover:bg-primary/10">
                        <X className="size-4" />
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>

                {/* Mobile Search */}
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

                {/* Mobile Nav Links */}
                <nav className="flex-1 overflow-y-auto p-3">
                  <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-2">Menu</p>
                  {HEADER_NAV.map((item) => {
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);
                    const Icon = item.icon;
                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all group",
                            isActive
                              ? "bg-primary/10 text-primary font-semibold"
                              : "text-foreground hover:bg-muted/80",
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

                {/* Mobile Auth Buttons */}
                <div className="p-4 border-t border-border/60 space-y-2">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 rounded-xl mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shrink-0">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
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
                        <Button variant="destructive" className="w-full justify-start" size="lg" onClick={handleLogout}>
                          Logout
                        </Button>
                      </SheetClose>
                    </>
                  ) : (
                    <>
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          size="lg"
                          asChild
                        >
                          <Link href="/login">
                            <LogIn className="size-4" />
                            Masuk
                          </Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button variant="accent" className="w-full gap-2" size="lg" asChild>
                          <Link href="/signup">
                            <UserPlus className="size-4" />
                            Daftar
                          </Link>
                        </Button>
                      </SheetClose>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* ─── Bottom Row: Navigation Links (desktop only) ─── */}
      <div className="hidden lg:block border-t border-border/50">
        <div className="container-smarttani">
          <NavigationMenu viewport={false} className="mx-0 max-w-full w-full">
            <NavigationMenuList className="gap-0">
              {HEADER_NAV.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <NavigationMenuItem key={item.href}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href}
                        className={cn(
                          "inline-flex items-center px-4 py-3 text-sm font-medium transition-colors relative",
                          "hover:text-primary",
                          isActive
                            ? "text-primary font-semibold"
                            : "text-muted-foreground",
                        )}
                      >
                        {item.label}
                        {/* Active indicator */}
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
  );
}
