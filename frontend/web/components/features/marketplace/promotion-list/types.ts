export type Promotion = {
  _id: string;
  farmer_id: string;
  title: string;
  type: 'discount_percent' | 'discount_amount';
  value: number;
  product_ids: string[];
  start_date: string;
  end_date: string;
  status: 'active' | 'inactive' | 'expired' | 'scheduled' | 'deleted';
  createdAt: string;
  updatedAt: string;

  // UI mock fields for compatibility
  code?: string;
  usageCount?: number;
  limit?: number;
};

export interface PromotionTableActions {
  onViewDetail: (promo: Promotion) => void;
  onEdit: (promo: Promotion) => void;
  onToggleStatus: (promo: Promotion) => void;
  onDelete: (promo: Promotion) => void;
}
