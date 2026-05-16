export type Review = {
  id: string;
  customerName: string;
  customerAvatar: string;
  productName: string;
  rating: number;
  date: string;
  comment: string;
  status: 'replied' | 'unreplied';
  reply: string;
};
