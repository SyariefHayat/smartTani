export type TransactionType = 'revenue' | 'fee' | 'withdrawal' | 'refund';
export type TransactionStatus = 'success' | 'pending' | 'failed';

export interface FarmerTransaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  description: string;
  status?: TransactionStatus;
  order_id?: string;
}

export interface FinanceSummary {
  currentBalance: number;
  totalEarnings: number;
  pendingBalance: number;
  earningsChangePercent: number;
}
