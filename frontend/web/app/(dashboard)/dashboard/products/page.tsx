'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { marketplaceService, Product } from '@/services/marketplace';
import { useAuthStore } from '@/stores/auth';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, MoreVertical, Edit, Power, PowerOff, Package } from 'lucide-react';
import { ProductForm } from '@/components/features/marketplace/ProductForm';
import { toast } from 'sonner';

export default function FarmerProductsPage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>(undefined);

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['my-products', user?.id],
    queryFn: () => marketplaceService.getProducts({ farmer_id: user?.id, limit: 100 }),
    enabled: !!user?.id,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => marketplaceService.getCategories(),
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => marketplaceService.deactivateProduct(id),
    onSuccess: () => {
      toast.success('Berhasil', { description: 'Produk telah dinonaktifkan.' });
      queryClient.invalidateQueries({ queryKey: ['my-products'] });
    },
    onError: () => {
      toast.error('Gagal', { description: 'Gagal menonaktifkan produk.' });
    },
  });

  const products = productsData?.data?.products || [];
  const categories = categoriesData?.data || [];

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setSelectedProduct(undefined);
    setIsFormOpen(true);
  };

  const getStatusBadge = (product: Product) => {
    if (product.status === 'inactive') return <Badge variant="secondary">Nonaktif</Badge>;
    if (product.stock <= 0) return <Badge variant="destructive">Habis</Badge>;
    if (product.status === 'pending') return <Badge variant="outline" className="text-orange-500 border-orange-500">Pending</Badge>;
    return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Aktif</Badge>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Produk</h1>
          <p className="text-gray-500">Tambah, edit, atau nonaktifkan produk Anda.</p>
        </div>
        <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Produk
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Produk</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-10 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-12" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-20 text-gray-500">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-20" />
                  Belum ada produk. Klik &quot;Tambah Produk&quot; untuk mulai berjualan.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product: Product) => (
                <TableRow key={product.id || product._id}>
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>Rp {product.price_per_unit.toLocaleString('id-ID')}</TableCell>
                  <TableCell>{product.stock} {product.unit}</TableCell>
                  <TableCell>{getStatusBadge(product)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(product)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {product.status === 'active' ? (
                          <DropdownMenuItem 
                            className="text-red-600 focus:text-red-600"
                            onClick={() => deactivateMutation.mutate(product.id || product._id)}
                          >
                            <PowerOff className="w-4 h-4 mr-2" />
                            Nonaktifkan
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600 focus:text-green-600">
                            <Power className="w-4 h-4 mr-2" />
                            Aktifkan
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <ProductForm 
        open={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        product={selectedProduct}
        categories={categories}
      />
    </div>
  );
}
