import { Metadata } from 'next';
import { ABOUT_META } from '@/constants/about';
import HeroTentangSection from '@/components/sections/about/HeroTentangSection';
import ProfilStatsSection from '@/components/sections/about/ProfilStatsSection';
import VisiMisiNilaiSection from '@/components/sections/about/VisiMisiNilaiSection';
import TimelineSection from '@/components/sections/about/TimelineSection';
import LayananSection from '@/components/sections/about/LayananSection';
import PencapaianTimSection from '@/components/sections/about/PencapaianTimSection';
import CTABannerTentangSection from '@/components/sections/about/CTABannerTentangSection';

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
