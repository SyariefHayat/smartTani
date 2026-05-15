import { Schema, model, Document } from 'mongoose';

export interface IProduct extends Document {
  farmer_id: string;
  title: string;
  description: string;
  category: string;
  price_per_unit: number;
  unit: string;
  stock: number;
  min_order: number;
  location: {
    province: string;
    city: string;
  };
  images: string[];
  status: 'active' | 'inactive' | 'pending';
  search_text: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    farmer_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price_per_unit: { type: Number, required: true },
    unit: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    min_order: { type: Number, required: true, default: 1 },
    location: {
      province: { type: String, required: true },
      city: { type: String, required: true },
    },
    images: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending',
      required: true,
    },
    search_text: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Indexes
productSchema.index({ search_text: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1, category: 1 });
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ 'location.province': 1, 'location.city': 1 });

export const Product = model<IProduct>('Product', productSchema);
