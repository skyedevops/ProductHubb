import { Product } from '@producthubb/shared';

export interface PricingTier {
  minQuantity: number;
  maxQuantity: number | null; // null for infinity
  discountPercentage: number;
}

/**
 * PricingService handles the determination of unit prices based on
 * product base prices and quantity-based pricing tiers.
 */
export class PricingService {
  // Hardcoded tiers for now. In a production system, these would be fetched from a MongoDB collection.
  private readonly productTiers: Record<string, PricingTier[]> = {
    // Example: Product ID 'prod_123' has tiered pricing
    // 'prod_123': [
    //   { minQuantity: 1, maxQuantity: 10, discountPercentage: 0 },
    //   { minQuantity: 11, maxQuantity: 50, discountPercentage: 10 },
    //   { minQuantity: 51, maxQuantity: null, discountPercentage: 20 },
    // ],
  };

  /**
   * Calculates the unit price for a product based on the requested quantity.
   * @param product The product being quoted
   * @param quantity The quantity requested
   * @returns The adjusted unit price
   */
  async getUnitPrice(product: Product, quantity: number): Promise<number> {
    const tiers = this.productTiers[product.id || ''];

    if (!tiers || tiers.length === 0) {
      return product.basePrice;
    }

    const tier = tiers.find(t =>
      quantity >= t.minQuantity &&
      (t.maxQuantity === null || quantity <= t.maxQuantity)
    );

    if (tier) {
      return product.basePrice * (1 - tier.discountPercentage / 100);
    }

    return product.basePrice;
  }
}

export const pricingService = new PricingService();
