export interface Supplier {
  id: string;
  name: string;
  category: string;
  contactPerson: string;
  phone: string;
  email: string;
  location: string;
  totalOrders: number;
  lastOrderDate: string;
  status: 'active' | 'inactive';
}
