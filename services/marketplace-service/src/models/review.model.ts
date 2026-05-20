import { Schema, model, Document } from 'mongoose';

export interface IReview extends Document {
  product_id: string;
  order_id: string;
  buyer_id: string;
  buyer_name: string;
  rating: number;
  comment: string;
  created_at: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    product_id: { type: String, required: true, index: true },
    order_id: { type: String, required: true },
    buyer_id: { type: String, required: true },
    buyer_name: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, maxLength: 500 },
    created_at: { type: Date, default: Date.now },
  },
  {
    timestamps: false, // Using created_at manually as per requirement
  }
);

// Index for efficient querying of product reviews sorted by date
reviewSchema.index({ product_id: 1, created_at: -1 });

export const Review = model<IReview>('Review', reviewSchema);
