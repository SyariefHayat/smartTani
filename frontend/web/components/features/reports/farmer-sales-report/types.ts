export interface SalesReportItem {
  id: string;
  date: string;
  customerName: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  status: 'completed' | 'cancelled';
}

export interface SalesReportSummary {
  totalSales: number;
  growth: number;
  avgTransaction: number;
  itemsSold: number;
}

export interface DailySalesData {
  date: string;
  sales: number;
  orders: number;
}
