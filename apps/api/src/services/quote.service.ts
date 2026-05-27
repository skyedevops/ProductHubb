import { QuoteModel } from '../repositories/quote.repository';
import { ProductModel } from '../repositories/product.repository';
import { Quote, QuoteItem } from '@producthubb/shared';

export class QuoteService {
  private calculateTotals(items: QuoteItem[]) {
    const subtotal = items.reduce((acc, item) => {
      return acc + (item.unitPrice * item.quantity) - (item.discount || 0);
    }, 0);

    const taxRate = 0.10; // 10% flat tax for MVP
    const tax = subtotal * taxRate;
    const total = subtotal + tax;

    return { subtotal, tax, total };
  }

  async createQuote(userId: string, data: Partial<Quote>) {
    const itemsWithPrices: QuoteItem[] = [];

    for (const item of data.items || []) {
      const product = await ProductModel.findOne({ sku: item.productId });
      if (!product) throw new Error(`Product ${item.productId} not found`);

      itemsWithPrices.push({
        ...item,
        productId: product._id as any,
        unitPrice: product.basePrice, // Price Snapshot
      });
    }

    const { subtotal, tax, total } = this.calculateTotals(itemsWithPrices);

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
