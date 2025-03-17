import { Injectable } from '@nestjs/common';
import type { Product, TProduct } from '@repo/types';

@Injectable()
export class ProductsService {
  private readonly products: Product[] = [];

  createProduct(productData: Product): Product {
    const product: Product = {
      ...productData,
      id: Math.random().toString(36).substring(7),
    };
    this.products.push(product);
    return product;
  }

  getProducts(): Product[] {
    return this.products;
  }
}
