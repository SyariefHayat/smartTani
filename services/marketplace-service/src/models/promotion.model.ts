import { Schema, model, Document } from 'mongoose';

export interface IPromotion extends Document {
  farmer_id: string;
  title: string;
  type: 'discount_percent' | 'discount_amount';
  value: number;
  product_ids: string[];
  start_date: Date;
  end_date: Date;
  status: 'active' | 'inactive' | 'expired' | 'scheduled' | 'deleted';
  createdAt: Date;
  updatedAt: Date;
}

const promotionSchema = new Schema<IPromotion>(
  {
    farmer_id: { type: String, required: true },
    title: { type: String, required: true },
    type: {
      type: String,
      enum: ['discount_percent', 'discount_amount'],
      required: true,
    },
    value: { type: Number, required: true },
    product_ids: { type: [String], default: [] },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ['active', 'inactive', 'expired', 'scheduled', 'deleted'],
      default: 'active',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
promotionSchema.index({ farmer_id: 1 });
promotionSchema.index({ status: 1 });
promotionSchema.index({ product_ids: 1 });
promotionSchema.index({ start_date: 1, end_date: 1 });

export const Promotion = model<IPromotion>('Promotion', promotionSchema);
