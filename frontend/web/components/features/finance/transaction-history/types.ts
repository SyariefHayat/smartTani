export type TransactionType = 'Income' | 'Expense' | 'Withdrawal' | 'TopUp';
export type TransactionStatus = 'Completed' | 'Pending' | 'Failed';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  type: TransactionType;
  category: string;
  amount: number;
  status: TransactionStatus;
  paymentMethod: string;
  referenceId?: string;
}
