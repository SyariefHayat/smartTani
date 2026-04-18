import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import CartSidebar from "@/components/ui/CartSidebar";
import ToastContainer from "@/components/ui/ToastContainer";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://smarttani.id"),
  title: {
    default: "Smarttani Indonesia — Solusi Pertanian Modern",
    template: "%s | Smarttani Indonesia",
  },
  description:
    "Platform ekosistem pertanian terintegrasi untuk petani, investor, dan pembeli.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("h-full", plusJakartaSans.variable)}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <TooltipProvider>
          <Navbar />
          <CartSidebar />
          <main className="flex-1">{children}</main>
          <Footer />
          <ToastContainer />
        </TooltipProvider>
      </body>
    </html>
  );
}
