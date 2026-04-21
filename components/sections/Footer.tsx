import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import {
  FOOTER_SECTIONS,
  SOCIAL_LINKS,
  FOOTER_BRAND,
} from "@/constants";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

function SocialIcon({ icon, size = "sm" }: { icon: string; size?: "sm" | "md" | "lg" }) {
  const cls = size === "lg" ? "size-6" : size === "md" ? "size-5" : "size-4";
  switch (icon) {
    case "facebook": return <FaFacebook className={cls} />;
    case "instagram": return <FaInstagram className={cls} />;
    case "youtube": return <FaYoutube className={cls} />;
    case "linkedin": return <FaLinkedin className={cls} />;
    case "tiktok": return <FaTiktok className={cls} />;
    case "twitter": return <FaXTwitter className={cls} />;
    default: return null;
  }
}

function LinkIcon({ name }: { name: string }) {
  const cls = "size-4 mt-0.5 shrink-0 text-accent";
  switch (name) {
    case "map-pin": return <MapPin className={cls} />;
    case "phone": return <Phone className={cls} />;
    case "mail": return <Mail className={cls} />;
    case "globe": return <Globe className={cls} />;
    default: return null;
  }
}

export default function Footer() {
  return (
    <footer id="main-footer" className="bg-cta-gradient text-white">
      <div className="container-smarttani pt-12 pb-9 md:pt-8 md:pb-5">

        {/* ===== MOBILE: grid 2 kolom ===== */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:hidden">

          {/* Brand — full width */}
          <div className="col-span-2 space-y-4">
            <BrandColumn />
          </div>

          {/* Nav Sections — 2 per baris */}
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="col-span-1 flex flex-col">
              <NavSection section={section} />
            </div>
          ))}

          {/* Unduh Aplikasi — full width */}
          <div className="col-span-2">
            <DownloadColumn />
          </div>
        </div>

        {/* ===== TABLET: baris 1 (Brand + Download), baris 2 (Nav links) ===== */}
        <div className="hidden md:flex lg:hidden flex-col gap-y-10">

          {/* Baris 1 */}
          <div className="flex flex-row gap-x-6">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="flex-1 flex flex-col">
                <NavSection section={section} />
              </div>
            ))}
          </div>

          {/* Baris 2 */}
          <div className="flex flex-row gap-x-6 items-center">
            <div className="flex-[2]">
              <BrandColumn />
            </div>
            <DownloadColumn className="flex-2" /> {/* lebih lebar */}
          </div>

        </div>

        {/* ===== DESKTOP: semua sejajar 1 baris ===== */}
        <div className="hidden lg:flex flex-row flex-nowrap gap-x-12">
          <div className="flex-[2]">
            <BrandColumn />
          </div>
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title} className="flex-1 flex flex-col">
              <NavSection section={section} />
            </div>
          ))}
          <div className="flex-1">
            <DownloadColumn />
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-white/10">
        <div className="container-smarttani py-4 flex flex-col md:flex-row justify-between gap-2">
          <p className="text-xs text-white/50">{FOOTER_BRAND.copyright}</p>
          <p className="text-xs text-white/50">{FOOTER_BRAND.tagline}</p>
        </div>
      </div>
    </footer>
  );
}

function BrandColumn() {
  return (
    <div className="space-y-4">
      <Link href="/" className="inline-block">
        <div className="relative h-52 w-[405px] md:h-44 md:w-[300px] lg:h-44 lg:w-[300px] -mt-5">
          <Image src="/images/home/logo.png" alt="Logo Smarttani Indonesia" fill className="object-cover" sizes="100%" priority />
        </div>
      </Link>
      <p className="text-sm text-white/70 leading-relaxed md:w-84 lg:w-auto">{FOOTER_BRAND.description}</p>
      <div className="flex items-center gap-2 pt-1">
        {SOCIAL_LINKS.map((social) => (
          <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={social.label}
            className="flex items-center justify-center w-9 h-9 md:w-11 md:h-11 lg:w-12 lg:h-12 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <SocialIcon icon={social.icon} size="md" />
          </a>
        ))}
      </div>
    </div>
  );
}

function NavSection({ section }: { section: (typeof FOOTER_SECTIONS)[0] }) {
  return (
    <>
      <h3 className="text-sm font-semibold mb-4 text-white">{section.title}</h3>
      <ul className="flex flex-col gap-2">
        {section.links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link href={link.href} target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="flex items-start gap-2.5 text-sm text-white/70 hover:text-white transition-colors">
              {link.icon && <LinkIcon name={link.icon} />}
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

function DownloadColumn({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-sm font-semibold mb-4 text-white">Unduh Aplikasi</h3>
      <p className="text-xs font-semibold text-white/80 mb-3">Unduh Aplikasi Smarttani</p>
      <div className="flex items-center gap-3 lg:flex-col lg:items-start">
        <div className="flex flex-col gap-2">
          <a href="#" target="_blank">
            <Image src="/images/home/playstore.webp" alt="Google Play" width={120} height={36} className="h-11 md:h-14 lg:h-11 w-auto" />
          </a>
          <a href="#" target="_blank">
            <Image src="/images/home/app-store.webp" alt="App Store" width={120} height={36} className="h-11 md:h-14 lg:h-11 w-auto" />
          </a>
        </div>
        <Image src="/images/home/qr-smarttani.webp" alt="QR Code" width={100} height={100} className="h-24 md:h-32 lg:h-24 w-auto rounded" />
      </div>
    </div>
  );
}