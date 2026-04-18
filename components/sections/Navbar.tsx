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
import { HEADER_NAV } from "@/constants";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/marketplace?q=${encodeURIComponent(query)}`);
      setMobileOpen(false);
    }
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
            <div className="relative w-20 h-12 md:w-32 md:h-20 lg:w-28 lg:h-16">
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
              className="cursor-pointer"
            >
              <ShoppingCart className="size-5" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
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
          </div>

          {/* Mobile: Cart + Hamburger */}
          <div className="flex lg:hidden items-center gap-1">
            <Button variant="ghost" size="icon" aria-label="Keranjang">
              <ShoppingCart className="size-5" />
            </Button>
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  id="navbar-mobile-toggle"
                  aria-label="Menu navigasi"
                >
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-75 p-0"
                showCloseButton={false}
              >
                {/* Mobile Sheet Header */}
                <SheetHeader className="p-4 border-b border-border">
                  <div className="flex items-center justify-between">
                    <SheetTitle>
                      <div className="relative w-24 h-12 md:w-28 md:h-14">
                        <Image
                          src="/images/home/logo.png"
                          alt="Logo"
                          className="object-contain"
                          sizes="100%"
                          loading="eager"
                          fill
                        />
                      </div>
                    </SheetTitle>
                    <SheetClose asChild>
                      <Button variant="ghost" size="icon-sm">
                        <X className="size-4" />
                      </Button>
                    </SheetClose>
                  </div>
                </SheetHeader>

                {/* Mobile Search */}
                <div className="p-4 border-b border-border">
                  <form onSubmit={handleSearch} className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Cari..."
                      className="pl-10 h-10 bg-neutral-100 border-neutral-200 rounded-full text-sm"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                  </form>
                </div>

                {/* Mobile Nav Links */}
                <nav className="flex-1 overflow-y-auto p-2">
                  {HEADER_NAV.map((item) => {
                    const isActive =
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href);
                    return (
                      <SheetClose asChild key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                            isActive
                              ? "bg-primary-light text-primary font-semibold"
                              : "text-foreground hover:bg-muted",
                          )}
                        >
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>

                {/* Mobile Auth Buttons */}
                <div className="p-4 border-t border-border space-y-2">
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
