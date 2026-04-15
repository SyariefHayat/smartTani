import React from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Globe } from "lucide-react";
import {
  FOOTER_SECTIONS,
  SOCIAL_LINKS,
  FOOTER_CONTACT,
  FOOTER_BRAND,
} from "@/constants";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTiktok,
  FaYoutube,
} from "react-icons/fa";

/* ── Social icon mapping ── */
function SocialIcon({ icon }: { icon: string }) {
  const cls = "size-4";
  switch (icon) {
    case "facebook":
      return <FaFacebook className={cls} />;
    case "instagram":
      return <FaInstagram className={cls} />;
    case "youtube":
      return <FaYoutube className={cls} />;
    case "linkedin":
      return <FaLinkedin className={cls} />;
    case "tiktok":
      return <FaTiktok className={cls} />;
    default:
      return null;
  }
}

export default function Footer() {
  return (
    <footer id="main-footer" className="bg-cta-gradient text-white">
      {/* ─── Main Footer Content ─── */}
      <div className="container-smarttani py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-13 gap-x-6 gap-y-10 lg:gap-x-12">
          <div className="col-span-2 md:col-span-2 lg:col-span-4 space-y-4">
            {/* Logo */}
            <Link href="/" className="inline-block">
              <div className="relative h-26 w-65 md:h-46 md:w-85">
                <Image
                  src="/images/home/logo.png"
                  alt="Logo Smarttani Indonesia"
                  className="object-contain object-left"
                  sizes="100%"
                  loading="eager"
                  priority
                  fill
                />
              </div>
            </Link>

            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              {FOOTER_BRAND.description}
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-2 pt-1">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.icon}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <SocialIcon icon={social.icon} />
                </a>
              ))}
            </div>
          </div>

          <div className="col-span-2 md:col-span-2 lg:col-span-3">
            <h3 className="text-sm font-semibold mb-4 text-white">
              Kontak Kami
            </h3>

            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="size-4 mt-0.5 shrink-0 text-accent" />
                <span className="text-sm text-white/70 leading-snug">
                  {FOOTER_CONTACT.address}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-accent" />
                <a
                  href={`tel:${FOOTER_CONTACT.phone}`}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {FOOTER_CONTACT.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-accent" />
                <a
                  href={`mailto:${FOOTER_CONTACT.email}`}
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {FOOTER_CONTACT.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe className="size-4 shrink-0 text-accent" />
                <a
                  href={`https://${FOOTER_CONTACT.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/70 hover:text-white transition-colors"
                >
                  {FOOTER_CONTACT.website}
                </a>
              </li>
            </ul>

            {/* App Download Badges */}
            <div className="mt-6">
              <p className="text-xs font-semibold text-white/80 mb-3">
                Unduh Aplikasi Smarttani
              </p>
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-2">
                  <a href="#" aria-label="Download dari Google Play">
                    <Image
                      src="/images/home/playstore.webp"
                      alt="Tersedia di Google Play"
                      width={120}
                      height={36}
                      className="h-11 w-auto"
                    />
                  </a>
                  <a href="#" aria-label="Download dari App Store">
                    <Image
                      src="/images/home/app-store.webp"
                      alt="Tersedia di App Store"
                      width={120}
                      height={36}
                      className="h-11 w-auto"
                    />
                  </a>
                </div>
                <Image
                  src="/images/home/qr-smarttani.webp"
                  alt="QR Code Smarttani"
                  width={500}
                  height={500}
                  className="h-25 w-auto rounded"
                />
              </div>
            </div>
          </div>

          {/* ─── Link Columns ───
              Mobile : col-span-1 (2 per row)
              Tablet : col-span-1 (4 per row → Row 2 penuh)
              Desktop: col-span-2
              Asumsi FOOTER_SECTIONS berisi tepat 4 section.
              Jika lebih/kurang, sesuaikan md:col-span di bawah
              atau bungkus dengan wrapper grid khusus.
          */}
          {FOOTER_SECTIONS.map((section) => (
            <div
              key={section.title}
              className="col-span-1 md:col-span-1 lg:col-span-2"
            >
              <h3 className="text-sm font-semibold mb-4 text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/70 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Copyright Bar ─── */}
      <div className="border-t border-white/10">
        <div className="container-smarttani py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/50 text-center md:text-left">
            {FOOTER_BRAND.copyright}
          </p>
          <p className="text-xs text-white/50 text-center md:text-right">
            {FOOTER_BRAND.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
