import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { ProductSchema } from '@producthubb/shared';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = ProductSchema.parse(req.body);
    const product = await productService.createProduct(validatedData);
    res.status(201).json(product);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const listProducts = async (req: Request, res: Response) => {
  try {
    const products = await productService.getAllProducts();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
