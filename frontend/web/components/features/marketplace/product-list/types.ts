export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  rating: number;
  status: 'Active' | 'Out Of Stock' | 'Closed For Sale';
  image: string;
};
