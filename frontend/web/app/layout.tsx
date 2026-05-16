import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Geist } from 'next/font/google';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

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
    <html lang="id" className={cn('antialiased', 'font-sans', geist.variable)}>
      <body className="min-h-full flex flex-col font-sans antialiased">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
