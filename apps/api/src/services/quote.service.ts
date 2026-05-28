import { QuoteModel } from '../repositories/quote.repository';
import { ProductModel } from '../repositories/product.repository';
import { Quote, QuoteItem } from '@producthubb/shared';
import { pricingService } from './pricing.service';

export class QuoteService {
  private calculateTotals(quote: Partial<Quote>) {
    const items = quote.items || [];

    // 1. Line Item Discounts & Subtotal
    const subtotal = items.reduce((acc, item) => {
      const lineTotal = item.unitPrice * item.quantity;
      let itemDiscount = 0;

      if (item.discountType === 'percentage') {
        itemDiscount = lineTotal * (item.discountValue || 0) / 100;
      } else if (item.discountType === 'flat') {
        itemDiscount = item.discountValue || 0;
      }

      return acc + (lineTotal - itemDiscount);
    }, 0);

    // 2. Global Discount
    let discountedSubtotal = subtotal;
    if (quote.globalDiscountType === 'percentage') {
      discountedSubtotal = subtotal * (1 - (quote.globalDiscountValue || 0) / 100);
    } else if (quote.globalDiscountType === 'flat') {
      discountedSubtotal = subtotal - (quote.globalDiscountValue || 0);
    }

    // 3. Tax Calculation (10% flat)
    const taxRate = 0.10;
    const tax = discountedSubtotal * taxRate;

    // 4. Final Total (with floor of 0)
    const total = Math.max(0, discountedSubtotal + tax);

    return { subtotal, tax, total };
  }

  async createQuote(userId: string, data: Partial<Quote>) {
    const itemsWithPrices: QuoteItem[] = [];

    for (const item of data.items || []) {
      const product = await ProductModel.findOne({ sku: item.productId });
      if (!product) throw new Error(`Product ${item.productId} not found`);

      const unitPrice = await pricingService.getUnitPrice(product, item.quantity);

      itemsWithPrices.push({
        ...item,
        productId: product._id as any,
        unitPrice: unitPrice, // Tiered Price Snapshot
      });
    }

    const { subtotal, tax, total } = this.calculateTotals({
      ...data,
      items: itemsWithPrices
    });

    return await QuoteModel.create({
      ...data,
      userId,
      items: itemsWithPrices,
      subtotal,
      tax,
      total,
    });
  }

  async createNewVersion(quoteId: string) {
    const original = await QuoteModel.findById(quoteId);
    if (!original) throw new Error('Quote not found');

    const { _id, ...rest } = original.toObject();
    const updatedData = {
      ...rest,
      version: original.version + 1,
      status: 'Draft' as any,
      parentQuoteId: original._id.toString(),
      quoteNumber: `${original.quoteNumber}_v${original.version + 1}`,
    };

    return await QuoteModel.create(updatedData);
  }

  async getQuoteById(id: string) {
    return await QuoteModel.findById(id).populate('items.productId');
  }

  async getQuotesByUser(userId: string) {
    return await QuoteModel.find({ userId }).sort({ createdAt: -1 });
  }
}

export const quoteService = new QuoteService();
