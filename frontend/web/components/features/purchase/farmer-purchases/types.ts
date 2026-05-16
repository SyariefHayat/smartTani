export type PurchaseStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled';

export interface PurchaseItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface FarmerPurchase {
  id: string;
  supplierName: string;
  date: string;
  totalAmount: number;
  paymentMethod: string;
  status: PurchaseStatus;
  items: PurchaseItem[];
}
