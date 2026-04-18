import { Metadata } from 'next';
import { ABOUT_META } from '@/constants/about';
import HeroTentangSection from '@/components/sections/tentang/HeroTentangSection';
import ProfilStatsSection from '@/components/sections/tentang/ProfilStatsSection';
import VisiMisiNilaiSection from '@/components/sections/tentang/VisiMisiNilaiSection';
import TimelineSection from '@/components/sections/tentang/TimelineSection';
import LayananSection from '@/components/sections/tentang/LayananSection';
import PencapaianTimSection from '@/components/sections/tentang/PencapaianTimSection';
import CTABannerTentangSection from '@/components/sections/tentang/CTABannerTentangSection';

export const metadata: Metadata = {
  title: ABOUT_META.title,
  description: ABOUT_META.description,
};

export default function TentangPage() {
  return (
    <main>
      <HeroTentangSection />
      {/* <ProfilStatsSection /> */}
      <VisiMisiNilaiSection />
      <TimelineSection />
      <LayananSection />
      <PencapaianTimSection />
      <CTABannerTentangSection />
    </main>
  );
}
