export interface PurchaseRecord {
  id: string;
  farmer_id: string;
  supplier_name: string;
  item_name: string;
  quantity: number;
  unit: string;
  total_cost: number;
  purchase_date: string;
  notes?: string;
  receipt_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePurchaseInput {
  supplier_name: string;
  item_name: string;
  quantity: number;
  unit: string;
  total_cost: number;
  purchase_date: string;
  notes?: string;
  receipt_url?: string;
}
