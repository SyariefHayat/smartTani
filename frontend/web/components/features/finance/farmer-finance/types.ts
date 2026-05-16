export type TransactionType = 'revenue' | 'withdrawal' | 'refund';
export type TransactionStatus = 'success' | 'pending' | 'failed';

export interface FarmerTransaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
}

export interface FinanceSummary {
  currentBalance: number;
  totalEarnings: number;
  pendingBalance: number;
  monthlyWithdrawal: number;
}
