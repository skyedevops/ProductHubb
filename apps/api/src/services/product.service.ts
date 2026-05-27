import { ProductModel } from '../repositories/product.repository';
import { Product } from '@producthubb/shared';

export class ProductService {
  async createProduct(data: Product) {
    return await ProductModel.create(data);
  }

  async getAllProducts() {
    return await ProductModel.find();
  }

  async getProductBySku(sku: string) {
    return await ProductModel.findOne({ sku });
  }
}

export const productService = new ProductService();
