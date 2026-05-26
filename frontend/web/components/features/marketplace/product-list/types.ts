export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  rating: number;
  status: 'Active' | 'Out Of Stock' | 'Closed For Sale' | 'Nonaktif' | 'Draft';
  image: string;
};

/** Actions available from the table row dropdown menu */
export interface ProductTableActions {
  onViewDetail: (product: Product) => void;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
}
