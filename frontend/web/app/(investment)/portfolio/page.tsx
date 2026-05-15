import { InvestorPortfolio } from '@/components/features/investment/InvestorPortfolio';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Portofolio Investasi - SmartTani',
  description: 'Pantau pertumbuhan aset dan hasil investasi Anda di SmartTani.',
};

export default function InvestorPortfolioPage() {
  return <InvestorPortfolio />;
}
