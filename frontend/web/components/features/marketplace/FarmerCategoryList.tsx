'use client';

import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

import { useAuthStore } from '@/stores/auth';
import { marketplaceService } from '@/services/marketplace';
import { exportToCSV } from '@/lib/export-csv';
import { CategoryHeader } from './category-list/CategoryHeader';
import { CategoryStats } from './category-list/CategoryStats';
import { CategoryTable } from './category-list/CategoryTable';
import { Category as UICategory } from './category-list/types';

export function FarmerCategoryList() {
  const user = useAuthStore((s) => s.user);
  const [searchTerm, setSearchTerm] = useState('');

  // State for category proposal dialog
  const [proposeOpen, setProposeOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatReason, setNewCatReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => marketplaceService.getCategories(),
  });

  const {
    data: productsData,
    isLoading: isLoadingProducts,
    isError: isErrorProducts,
    error: errorProducts,
  } = useQuery({
    queryKey: ['farmer-products-all', user?.id],
    queryFn: () => marketplaceService.getProducts({ farmer_id: user?.id, limit: 1000 }),
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (isErrorCategories || isErrorProducts) {
      const err = errorCategories || errorProducts;
      toast.error(
        'Gagal memuat data: ' + (err instanceof Error ? err.message : 'Terjadi kesalahan')
      );
    }
  }, [isErrorCategories, isErrorProducts, errorCategories, errorProducts]);

  const categories: UICategory[] = useMemo(() => {
    if (!categoriesData?.data) return [];

    const products = productsData?.data?.products || [];

    return categoriesData.data.map((cat) => {
      const count = products.filter((p) => p.category === cat.name || p.category === cat.id).length;

      return {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        productCount: count,
        status: 'active',
        description: cat.description || `Kategori untuk ${cat.name}`,
        icon: '📦', // default icon as not provided by API
      };
    });
  }, [categoriesData, productsData]);

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categories, searchTerm]);

  const handleExport = () => {
    if (categories.length === 0) {
      toast.error('Tidak ada data kategori untuk diekspor.');
      return;
    }

    exportToCSV({
      data: categories,
      columns: [
        { header: 'ID Kategori', accessor: (row) => row.id },
        { header: 'Nama Kategori', accessor: (row) => row.name },
        { header: 'Slug', accessor: (row) => row.slug },
        { header: 'Deskripsi', accessor: (row) => row.description },
        { header: 'Jumlah Produk', accessor: (row) => row.productCount },
        { header: 'Status', accessor: (row) => (row.status === 'active' ? 'Aktif' : 'Nonaktif') },
      ],
      filename: 'daftar_kategori',
    });
    toast.success('Data kategori berhasil diekspor.');
  };

  const handleProposeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatDesc || !newCatReason) {
      toast.error('Gagal', { description: 'Semua bidang form pengajuan wajib diisi.' });
      return;
    }

    setIsSubmitting(true);
    // Simulate API request to propose category
    setTimeout(() => {
      setIsSubmitting(false);
      setProposeOpen(false);
      setNewCatName('');
      setNewCatDesc('');
      setNewCatReason('');
      toast.success('Pengajuan Berhasil', {
        description:
          'Pengajuan kategori baru Anda telah terkirim ke Admin SmartTani untuk ditinjau.',
      });
    }, 1000);
  };
  const isLoading = isLoadingCategories || isLoadingProducts;

  return (
    <div className="w-full text-slate-900">
      <div className="mx-auto flex w-full flex-col gap-4">
        <CategoryHeader onExport={handleExport} onAddCategory={() => setProposeOpen(true)} />

        <CategoryStats categories={categories} />

        <CategoryTable
          categories={filteredCategories}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          isLoading={isLoading}
        />
      </div>

      {/* Category Proposal Dialog */}
      <Dialog open={proposeOpen} onOpenChange={setProposeOpen}>
        <DialogContent className="sm:max-w-[600px] text-slate-900 bg-white">
          <DialogHeader>
            <DialogTitle>Ajukan Kategori Baru</DialogTitle>
            <DialogDescription>
              Sebagai Petani, Anda dapat mengajukan kategori baru ke Admin untuk ditambahkan ke
              marketplace global.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleProposeSubmit} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="catName" className="text-xs font-semibold text-slate-700">
                Nama Kategori
              </Label>
              <Input
                id="catName"
                placeholder="Contoh: Mulsa & Penutup Tanah"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="catDesc" className="text-xs font-semibold text-slate-700">
                Deskripsi Kategori
              </Label>
              <Textarea
                id="catDesc"
                placeholder="Tulis penjelasan singkat mengenai kategori ini..."
                className="h-20 resize-none"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="catReason" className="text-xs font-semibold text-slate-700">
                Alasan Pengajuan
              </Label>
              <Textarea
                id="catReason"
                placeholder="Kenapa kategori ini dibutuhkan oleh petani?"
                className="h-20 resize-none"
                value={newCatReason}
                onChange={(e) => setNewCatReason(e.target.value)}
              />
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setProposeOpen(false)}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
                {isSubmitting ? 'Mengirim...' : 'Kirim Pengajuan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
