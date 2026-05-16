'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PromotionHeader } from './promotion-list/PromotionHeader';
import { PromotionStats } from './promotion-list/PromotionStats';
import { PromotionFilters } from './promotion-list/PromotionFilters';
import { PromotionTable } from './promotion-list/PromotionTable';
import { PromotionBanner } from './promotion-list/PromotionBanner';
import { Promotion } from './promotion-list/types';

// Mock data for initial implementation
const MOCK_PROMOS: Promotion[] = [
  {
    id: '1',
    name: 'Diskon Akhir Tahun Hayati',
    code: 'HAYATI2024',
    type: 'percentage',
    value: 15,
    startDate: '2024-12-01',
    endDate: '2024-12-31',
    status: 'active',
    usageCount: 142,
    limit: 500,
  },
  {
    id: '2',
    name: 'Flash Sale Benih Unggul',
    code: 'BENIHFAST',
    type: 'fixed',
    value: 10000,
    startDate: '2024-05-15',
    endDate: '2024-05-16',
    status: 'scheduled',
    usageCount: 0,
    limit: 50,
  },
  {
    id: '3',
    name: 'Promo Ramadhan Berkah',
    code: 'BERKAHRAMADHAN',
    type: 'percentage',
    value: 20,
    startDate: '2024-03-10',
    endDate: '2024-04-10',
    status: 'expired',
    usageCount: 450,
    limit: 450,
  },
  {
    id: '4',
    name: 'Subsidi Ongkir Petani',
    code: 'ONGKIRFREE',
    type: 'fixed',
    value: 20000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    status: 'active',
    usageCount: 890,
    limit: 1000,
  },
];

export function FarmerPromotionList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredPromos = MOCK_PROMOS.filter((promo) => {
    const matchesSearch =
      promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promo.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'all' || promo.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const handleReset = () => {
    setSearchTerm('');
    setActiveTab('all');
  };

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-4">
        <PromotionHeader />

        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <PromotionStats promos={MOCK_PROMOS} />
              <PromotionFilters
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </div>
          </CardContent>
        </Card>

        <PromotionTable promos={filteredPromos} onReset={handleReset} />
        <PromotionBanner />
      </div>
    </div>
  );
}
