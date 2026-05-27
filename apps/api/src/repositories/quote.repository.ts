import mongoose, { Schema, Document } from 'mongoose';
import { Quote } from '@producthubb/shared';

export interface IQuote extends Quote, Document {}

const QuoteItemSchema = new Schema({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  discount: { type: Number, default: 0 },
});

const QuoteSchema = new Schema<IQuote>({
  quoteNumber: { type: String, required: true, unique: true },
  version: { type: Number, required: true, default: 1 },
  status: {
    type: String,
    enum: ['Draft', 'Sent', 'Approved', 'Expired'],
    default: 'Draft'
  },
  customerId: { type: String, required: true, index: true },
  userId: { type: Schema.Types.ObjectId as any, ref: 'User', required: true },
  items: [QuoteItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
  validUntil: { type: Date },
  parentQuoteId: { type: Schema.Types.ObjectId, ref: 'Quote' },
}, { timestamps: true });

export const QuoteModel = mongoose.model<IQuote>('Quote', QuoteSchema);
