import { Metadata } from 'next';
import { ABOUT_META } from '@/constants/about';
import Hero from '@/components/sections/about/Hero';
import Stats from '@/components/sections/about/Stats';
import VisionMission from '@/components/sections/about/VisionMission';
import Timeline from '@/components/sections/about/Timeline';
import Services from '@/components/sections/about/Services';
import Team from '@/components/sections/about/Team';
import CTA from '@/components/sections/about/CTA';

export const metadata: Metadata = {
  title: ABOUT_META.title,
  description: ABOUT_META.description,
};

export default function TentangPage() {
  return (
    <main>
      <Hero />
      <Stats />
      <VisionMission />
      <Timeline />
      <Services />
      <Team />
      <CTA />
    </main>
  );
}
