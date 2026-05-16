'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import { CategoryHeader } from './category-list/CategoryHeader';
import { CategoryStats } from './category-list/CategoryStats';
import { CategoryTable } from './category-list/CategoryTable';
import { CategoryTips } from './category-list/CategoryTips';
import { Category } from './category-list/types';

// Mock data for Category implementation
const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'Pupuk',
    slug: 'pupuk',
    productCount: 154,
    status: 'active',
    description: 'Segala jenis pupuk organik and anorganik untuk tanaman.',
    icon: '🌱',
  },
  {
    id: '2',
    name: 'Benih',
    slug: 'benih',
    productCount: 89,
    status: 'active',
    description: 'Bibit dan benih tanaman pangan, hortikultura, dan perkebunan.',
    icon: '🌾',
  },
  {
    id: '3',
    name: 'Pestisida',
    slug: 'pestisida',
    productCount: 42,
    status: 'active',
    description: 'Obat-obatan pembasmi hama dan penyakit tanaman.',
    icon: '🧪',
  },
  {
    id: '4',
    name: 'Alat Pertanian',
    slug: 'alat-pertanian',
    productCount: 67,
    status: 'active',
    description: 'Peralatan modern dan tradisional untuk membantu tani.',
    icon: '🚜',
  },
  {
    id: '5',
    name: 'Hortikultura',
    slug: 'hortikultura',
    productCount: 12,
    status: 'inactive',
    description: 'Tanaman sayur, buah, dan tanaman hias.',
    icon: '🍎',
  },
];

export function FarmerCategoryList() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = MOCK_CATEGORIES.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-4">
        <CategoryHeader />

        <Card className="rounded-xl shadow-sm">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Cari nama kategori atau deskripsi..."
                className="h-10 border-slate-200 pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <CategoryStats categories={MOCK_CATEGORIES} />
          </CardContent>
        </Card>

        <CategoryTable categories={filteredCategories} />
        <CategoryTips />
      </div>
    </div>
  );
}
