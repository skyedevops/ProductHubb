import mongoose, { Schema, Document } from 'mongoose';
import { Product } from '@producthubb/shared';

export interface IProduct extends Product, Document {}

const ProductSchema = new Schema<IProduct>({
  sku: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  basePrice: { type: Number, required: true },
  category: { type: String },
  metadata: { type: Map, of: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

export const ProductModel = mongoose.model<IProduct>('Product', ProductSchema);
