import { Metadata } from 'next';
import { ABOUT_META } from '@/constants/about';
import HeroAboutSection from '@/components/sections/about/HeroAboutSection';
import ProfileStatsSection from '@/components/sections/about/ProfileStatsSection';
import VisionMissionValuesSection from '@/components/sections/about/VisionMissionValuesSection';
import TimelineSection from '@/components/sections/about/TimelineSection';
import ServicesSection from '@/components/sections/about/ServicesSection';
import TeamAchievementsSection from '@/components/sections/about/TeamAchievementsSection';
import CTABannerAboutSection from '@/components/sections/about/CTABannerAboutSection';

export const metadata: Metadata = {
  title: ABOUT_META.title,
  description: ABOUT_META.description,
};

export default function TentangPage() {
  return (
    <main>
      <HeroAboutSection />
      <ProfileStatsSection />
      <VisionMissionValuesSection />
      <TimelineSection />
      <ServicesSection />
      <TeamAchievementsSection />
      <CTABannerAboutSection />
    </main>
  );
}
