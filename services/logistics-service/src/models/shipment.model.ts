import { Schema, model, Document } from 'mongoose';

export interface IShipment extends Document {
  order_id: string;
  logistic_id: string;
  status: string;
  status_history: {
    status: string;
    notes?: string;
    timestamp: Date;
  }[];
  picked_up_at?: Date;
  delivered_at?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const shipmentSchema = new Schema<IShipment>(
  {
    order_id: { type: String, required: true },
    logistic_id: { type: String, required: true },
    status: { type: String, required: true },
    status_history: [
      {
        status: { type: String, required: true },
        notes: { type: String },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    picked_up_at: { type: Date },
    delivered_at: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Indexes
shipmentSchema.index({ order_id: 1 });

export const Shipment = model<IShipment>('Shipment', shipmentSchema);
