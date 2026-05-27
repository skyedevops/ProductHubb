"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteSchema = exports.QuoteStatusSchema = exports.QuoteItemSchema = exports.ProductSchema = exports.UserSchema = exports.UserRoleSchema = void 0;
const zod_1 = require("zod");
exports.UserRoleSchema = zod_1.z.enum(['Admin', 'SalesRep', 'Viewer']);
exports.UserSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    email: zod_1.z.string().email(),
    role: exports.UserRoleSchema,
    companyId: zod_1.z.string().optional(),
});
exports.ProductSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    sku: zod_1.z.string().min(1),
    name: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    basePrice: zod_1.z.number().positive(),
    category: zod_1.z.string().optional(),
    metadata: zod_1.z.record(zod_1.z.any()).optional(),
});
exports.QuoteItemSchema = zod_1.z.object({
    productId: zod_1.z.string(),
    quantity: zod_1.z.number().int().positive(),
    unitPrice: zod_1.z.number().positive(),
    discount: zod_1.z.number().nonnegative().optional(),
});
exports.QuoteStatusSchema = zod_1.z.enum(['Draft', 'Sent', 'Approved', 'Expired']);
exports.QuoteSchema = zod_1.z.object({
    id: zod_1.z.string().optional(),
    quoteNumber: zod_1.z.string().min(1),
    version: zod_1.z.number().int().positive().default(1),
    status: exports.QuoteStatusSchema,
    customerId: zod_1.z.string(),
    userId: zod_1.z.string(),
    items: zod_1.z.array(exports.QuoteItemSchema),
    subtotal: zod_1.z.number().nonnegative(),
    tax: zod_1.z.number().nonnegative(),
    total: zod_1.z.number().nonnegative(),
    validUntil: zod_1.z.date().optional(),
    parentQuoteId: zod_1.z.string().optional(),
});
