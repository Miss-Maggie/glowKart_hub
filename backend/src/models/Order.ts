import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true }
      }
    ],
    total: { type: Number, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'processing', 'shipped', 'delivered'] },
    tracking: {
      number: { type: String },
      carrier: { type: String },
      estimatedDelivery: { type: Date },
      updates: [
        {
          status: String,
          timestamp: { type: Date, default: Date.now },
          location: String,
          description: String
        }
      ]
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
