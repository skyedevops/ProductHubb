import { z } from 'zod';

export const UserRoleSchema = z.enum(['Admin', 'SalesRep', 'Viewer']);
export type UserRole = z.infer<typeof UserRoleSchema>;

export const UserSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  role: UserRoleSchema,
  companyId: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

export const ProductSchema = z.object({
  id: z.string().optional(),
  sku: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  basePrice: z.number().positive(),
  category: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export const QuoteItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
  discountType: z.enum(['percentage', 'flat']).optional(),
  discountValue: z.number().nonnegative().optional(),
});

export type QuoteItem = z.infer<typeof QuoteItemSchema>;

export const QuoteStatusSchema = z.enum(['Draft', 'Sent', 'Approved', 'Expired']);
export type QuoteStatus = z.infer<typeof QuoteStatusSchema>;

export const QuoteSchema = z.object({
  id: z.string().optional(),
  quoteNumber: z.string().min(1),
  version: z.number().int().positive().default(1),
  status: QuoteStatusSchema,
  customerId: z.string(),
  userId: z.string(),
  items: z.array(QuoteItemSchema),
  subtotal: z.number().nonnegative(),
  tax: z.number().nonnegative(),
  total: z.number().nonnegative(),
  globalDiscountType: z.enum(['percentage', 'flat']).optional(),
  globalDiscountValue: z.number().nonnegative().optional(),
  validUntil: z.date().optional(),
  parentQuoteId: z.string().optional(),
});

export type Quote = z.infer<typeof QuoteSchema>;
