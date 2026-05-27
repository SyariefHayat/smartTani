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

export interface SupplierTableActions {
  onViewDetail: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  onDelete: (supplier: Supplier) => void;
}
