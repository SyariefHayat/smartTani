import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Providers } from '@/components/shared/Providers';
import { Toaster } from '@/components/ui/sonner';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://smarttani.id'),
  title: {
    default: 'Smarttani Indonesia — Solusi Pertanian Modern',
    template: '%s | Smarttani Indonesia',
  },
  description: 'Platform ekosistem pertanian terintegrasi untuk petani, investor, dan pembeli.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn('h-full', plusJakartaSans.variable)} suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <TooltipProvider>
          <Toaster position="top-right" />
          <Providers>{children}</Providers>
        </TooltipProvider>
      </body>
    </html>
  );
}
