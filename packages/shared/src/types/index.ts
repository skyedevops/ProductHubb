export interface User {
  id: string;
  email: string;
  role: UserRole;
  companyId?: string;
}

export type UserRole = 'Admin' | 'SalesRep' | 'Viewer';

export interface Product {
  id?: string;
  sku: string;
  name: string;
  description?: string;
  basePrice: number;
  category?: string;
  metadata?: Record<string, any>;
}

export interface QuoteItem {
  productId: string;
  quantity: number;
  unitPrice: number;
  discountType?: 'percentage' | 'flat';
  discountValue?: number;
}

export interface Quote {
  id?: string;
  quoteNumber: string;
  version: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Expired';
  customerId: string;
  userId: string;
  items: QuoteItem[];
  subtotal: number;
  tax: number;
  total: number;
  globalDiscountType?: 'percentage' | 'flat';
  globalDiscountValue?: number;
  validUntil?: Date | string;
  parentQuoteId?: string;
  createdAt?: Date | string;
}
