import { Schema, model, Document } from 'mongoose';

export interface IWishlist extends Document {
  buyer_id: string;
  product_id: Schema.Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    buyer_id: { type: String, required: true, index: true },
    product_id: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure a buyer can only add a product to their wishlist once
wishlistSchema.index({ buyer_id: 1, product_id: 1 }, { unique: true });

export const Wishlist = model<IWishlist>('Wishlist', wishlistSchema);
