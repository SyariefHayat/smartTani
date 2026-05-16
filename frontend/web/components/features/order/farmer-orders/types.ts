export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'confirmed_seller'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refund_requested'
  | 'refunded'
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'completed';

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface FarmerOrder {
  id: string;
  customerName: string;
  date: string;
  totalAmount: number;
  paymentMethod: string;
  status: OrderStatus;
  items: OrderItem[];
}
