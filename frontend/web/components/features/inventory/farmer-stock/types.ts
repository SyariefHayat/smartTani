export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Expired' | 'Incoming';

export interface ProductStock {
  id: string;
  name: string;
  sku: string;
  category: string;
  quantity: number;
  unit: string;
  warehouse: string;
  minStock: number;
  lastUpdated: string;
  status: StockStatus;
  pricePerUnit: number;
}
